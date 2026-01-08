import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { answers, questions, users, pointTransactions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";

// POST /api/questions/[id]/answers - Create an answer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { body: answerBody } = body;

    if (!answerBody) {
      return NextResponse.json({ error: "Answer body is required" }, { status: 400 });
    }

    // Verify question exists
    const [question] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, questionId));

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const [newAnswer] = await db
      .insert(answers)
      .values({
        questionId,
        body: answerBody,
        authorId: session.user.id,
      })
      .returning();

    // Award points for answering
    const pointsToAward = 25;
    await db.insert(pointTransactions).values({
      userId: session.user.id,
      amount: pointsToAward,
      reason: "Answered a question",
      referenceType: "answer",
      referenceId: newAnswer.id,
    });

    await db
      .update(users)
      .set({ points: sql`${users.points} + ${pointsToAward}` })
      .where(eq(users.id, session.user.id));

    return NextResponse.json(newAnswer, { status: 201 });
  } catch (error) {
    console.error("Error creating answer:", error);
    return NextResponse.json({ error: "Failed to create answer" }, { status: 500 });
  }
}

// PATCH /api/questions/[id]/answers - Accept an answer (question author only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { answerId, action } = body;

    // Verify question exists and user is the author
    const [question] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, questionId));

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    if (question.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Only question author can accept answers" }, { status: 403 });
    }

    if (action === "accept") {
      // Unaccept any previously accepted answer
      await db
        .update(answers)
        .set({ isAccepted: false })
        .where(eq(answers.questionId, questionId));

      // Accept this answer
      const [accepted] = await db
        .update(answers)
        .set({ isAccepted: true })
        .where(eq(answers.id, answerId))
        .returning();

      // Mark question as resolved
      await db
        .update(questions)
        .set({ resolved: true, updatedAt: new Date() })
        .where(eq(questions.id, questionId));

      // Award bonus points to answer author
      if (accepted) {
        const bonusPoints = 50;
        await db.insert(pointTransactions).values({
          userId: accepted.authorId,
          amount: bonusPoints,
          reason: "Answer accepted",
          referenceType: "answer",
          referenceId: answerId,
        });

        await db
          .update(users)
          .set({ points: sql`${users.points} + ${bonusPoints}` })
          .where(eq(users.id, accepted.authorId));
      }

      return NextResponse.json({ success: true, accepted: true });
    } else if (action === "upvote") {
      // Upvote answer
      const [upvoted] = await db
        .update(answers)
        .set({ upvotes: sql`${answers.upvotes} + 1` })
        .where(eq(answers.id, answerId))
        .returning();

      // Award small points to answer author
      if (upvoted) {
        await db.insert(pointTransactions).values({
          userId: upvoted.authorId,
          amount: 5,
          reason: "Answer upvoted",
          referenceType: "answer",
          referenceId: answerId,
        });

        await db
          .update(users)
          .set({ points: sql`${users.points} + 5` })
          .where(eq(users.id, upvoted.authorId));
      }

      return NextResponse.json({ success: true, upvotes: upvoted?.upvotes });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating answer:", error);
    return NextResponse.json({ error: "Failed to update answer" }, { status: 500 });
  }
}
