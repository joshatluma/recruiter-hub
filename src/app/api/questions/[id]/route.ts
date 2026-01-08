import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { questions, users, answers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

// GET /api/questions/[id] - Get single question with answers
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [question] = await db
      .select({
        id: questions.id,
        title: questions.title,
        body: questions.body,
        tags: questions.tags,
        resolved: questions.resolved,
        createdAt: questions.createdAt,
        updatedAt: questions.updatedAt,
        authorId: questions.authorId,
        authorName: users.name,
        authorImage: users.image,
      })
      .from(questions)
      .leftJoin(users, eq(questions.authorId, users.id))
      .where(eq(questions.id, id));

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Get answers
    const questionAnswers = await db
      .select({
        id: answers.id,
        body: answers.body,
        isAccepted: answers.isAccepted,
        upvotes: answers.upvotes,
        createdAt: answers.createdAt,
        authorId: answers.authorId,
        authorName: users.name,
        authorImage: users.image,
      })
      .from(answers)
      .leftJoin(users, eq(answers.authorId, users.id))
      .where(eq(answers.questionId, id))
      .orderBy(desc(answers.isAccepted), desc(answers.upvotes), desc(answers.createdAt));

    return NextResponse.json({ ...question, answers: questionAnswers });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
  }
}

// PATCH /api/questions/[id] - Update question (mark resolved, edit)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Get existing question
    const [existing] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, id));

    if (!existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Only author or admin can update
    if (existing.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.body !== undefined) updateData.body = body.body;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.resolved !== undefined) updateData.resolved = body.resolved;

    const [updated] = await db
      .update(questions)
      .set(updateData)
      .where(eq(questions.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

// DELETE /api/questions/[id] - Delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [existing] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, id));

    if (!existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Only author or admin can delete
    if (existing.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete answers first
    await db.delete(answers).where(eq(answers.questionId, id));
    // Then delete question
    await db.delete(questions).where(eq(questions.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}
