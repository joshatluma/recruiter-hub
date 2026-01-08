import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, content, answers, contentProgress } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc, sql, eq, and } from "drizzle-orm";

// GET /api/leaderboard - Get leaderboard rankings
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get top users by points
    const topUsers = await db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
        points: users.points,
        role: users.role,
      })
      .from(users)
      .orderBy(desc(users.points))
      .limit(limit);

    // Get detailed stats for each user
    const leaderboard = await Promise.all(
      topUsers.map(async (user, index) => {
        // Count content created
        const [contentCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(content)
          .where(and(eq(content.authorId, user.id), eq(content.status, "published")));

        // Count content completed
        const [completedCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(contentProgress)
          .where(and(eq(contentProgress.userId, user.id), eq(contentProgress.completed, true)));

        // Count answers
        const [answerCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(answers)
          .where(eq(answers.authorId, user.id));

        return {
          ...user,
          rank: index + 1,
          contentCreated: Number(contentCount?.count) || 0,
          contentCompleted: Number(completedCount?.count) || 0,
          questionsAnswered: Number(answerCount?.count) || 0,
          isCurrentUser: session?.user?.id === user.id,
        };
      })
    );

    // If current user is not in top list, get their rank
    let currentUserRank = null;
    if (session?.user?.id) {
      const userInList = leaderboard.find((u) => u.isCurrentUser);
      if (!userInList) {
        const [currentUser] = await db
          .select({
            id: users.id,
            name: users.name,
            image: users.image,
            points: users.points,
          })
          .from(users)
          .where(eq(users.id, session.user.id));

        if (currentUser) {
          // Calculate rank
          const [rankResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(users)
            .where(sql`${users.points} > ${currentUser.points}`);

          currentUserRank = {
            ...currentUser,
            rank: Number(rankResult?.count || 0) + 1,
            isCurrentUser: true,
          };
        }
      }
    }

    return NextResponse.json({
      leaderboard,
      currentUserRank,
      totalUsers: topUsers.length,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
