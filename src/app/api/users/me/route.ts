import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, content, questions, answers, contentProgress, pointTransactions, kudos } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, sql, and } from "drizzle-orm";

// GET /api/users/me - Get current user's profile with stats
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get stats
    const [contentCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(content)
      .where(eq(content.authorId, user.id));

    const [completedCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contentProgress)
      .where(and(eq(contentProgress.userId, user.id), eq(contentProgress.completed, true)));

    const [answerCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(answers)
      .where(eq(answers.authorId, user.id));

    const [questionCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(questions)
      .where(eq(questions.authorId, user.id));

    // Get recent point transactions
    const recentPoints = await db
      .select()
      .from(pointTransactions)
      .where(eq(pointTransactions.userId, user.id))
      .orderBy(desc(pointTransactions.createdAt))
      .limit(10);

    // Get kudos received
    const kudosReceived = await db
      .select({
        id: kudos.id,
        message: kudos.message,
        createdAt: kudos.createdAt,
        fromUserName: users.name,
        fromUserImage: users.image,
      })
      .from(kudos)
      .leftJoin(users, eq(kudos.fromUserId, users.id))
      .where(eq(kudos.toUserId, user.id))
      .orderBy(desc(kudos.createdAt))
      .limit(5);

    return NextResponse.json({
      ...user,
      stats: {
        contentCreated: Number(contentCount?.count) || 0,
        contentCompleted: Number(completedCount?.count) || 0,
        questionsAsked: Number(questionCount?.count) || 0,
        questionsAnswered: Number(answerCount?.count) || 0,
      },
      recentPoints,
      kudosReceived,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// PATCH /api/users/me - Update current user's profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.expertise !== undefined) updateData.expertise = body.expertise;

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
