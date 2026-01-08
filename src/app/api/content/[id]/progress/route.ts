import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contentProgress, users, pointTransactions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

// POST /api/content/[id]/progress - Update progress on content
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { completed, checklistState } = body;

    // Check for existing progress
    const [existing] = await db
      .select()
      .from(contentProgress)
      .where(
        and(
          eq(contentProgress.contentId, contentId),
          eq(contentProgress.userId, session.user.id)
        )
      );

    let progress;
    const wasAlreadyCompleted = existing?.completed;

    if (existing) {
      // Update existing progress
      [progress] = await db
        .update(contentProgress)
        .set({
          completed: completed ?? existing.completed,
          completedAt: completed && !existing.completed ? new Date() : existing.completedAt,
          checklistState: checklistState ?? existing.checklistState,
        })
        .where(eq(contentProgress.id, existing.id))
        .returning();
    } else {
      // Create new progress record
      [progress] = await db
        .insert(contentProgress)
        .values({
          userId: session.user.id,
          contentId,
          completed: completed ?? false,
          completedAt: completed ? new Date() : null,
          checklistState,
        })
        .returning();
    }

    // Award points for completion (only if newly completed)
    if (completed && !wasAlreadyCompleted) {
      const pointsToAward = 50; // Points for completing content

      // Create point transaction
      await db.insert(pointTransactions).values({
        userId: session.user.id,
        amount: pointsToAward,
        reason: "Completed content",
        referenceType: "content",
        referenceId: contentId,
      });

      // Update user points
      await db
        .update(users)
        .set({
          points: sql`${users.points} + ${pointsToAward}`,
        })
        .where(eq(users.id, session.user.id));
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
