import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { questions, users, answers, pointTransactions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, ilike, or, sql, and } from "drizzle-orm";

// GET /api/questions - List all questions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const filter = searchParams.get("filter") || "all";
    const session = await auth();

    const conditions = [];

    // Filter by resolved status
    if (filter === "resolved") {
      conditions.push(eq(questions.resolved, true));
    } else if (filter === "unanswered") {
      conditions.push(eq(questions.resolved, false));
    } else if (filter === "my-questions" && session?.user?.id) {
      conditions.push(eq(questions.authorId, session.user.id));
    }

    // Search filter
    if (search) {
      conditions.push(
        or(
          ilike(questions.title, `%${search}%`),
          ilike(questions.body, `%${search}%`)
        )
      );
    }

    const items = await db
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
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(questions.createdAt))
      .limit(50);

    // Get answer counts for each question
    const questionsWithCounts = await Promise.all(
      items.map(async (q) => {
        const answerCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(answers)
          .where(eq(answers.questionId, q.id));

        // Calculate upvotes from answers
        const upvoteResult = await db
          .select({ total: sql<number>`COALESCE(SUM(${answers.upvotes}), 0)` })
          .from(answers)
          .where(eq(answers.questionId, q.id));

        return {
          ...q,
          answerCount: Number(answerCount[0]?.count) || 0,
          upvotes: Number(upvoteResult[0]?.total) || 0,
        };
      })
    );

    return NextResponse.json(questionsWithCounts);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

// POST /api/questions - Create a new question
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, body: questionBody, tags } = body;

    if (!title || !questionBody) {
      return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
    }

    const [newQuestion] = await db
      .insert(questions)
      .values({
        title,
        body: questionBody,
        tags: tags || [],
        authorId: session.user.id,
      })
      .returning();

    // Award points for asking a question
    const pointsToAward = 10;
    await db.insert(pointTransactions).values({
      userId: session.user.id,
      amount: pointsToAward,
      reason: "Asked a question",
      referenceType: "question",
      referenceId: newQuestion.id,
    });

    await db
      .update(users)
      .set({ points: sql`${users.points} + ${pointsToAward}` })
      .where(eq(users.id, session.user.id));

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}
