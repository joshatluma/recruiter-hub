import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { learningPaths, learningPathItems, content, contentProgress } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, asc, and } from "drizzle-orm";

// GET /api/learning-paths/[id] - Get single learning path with items and progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const [path] = await db
      .select()
      .from(learningPaths)
      .where(eq(learningPaths.id, id));

    if (!path) {
      return NextResponse.json({ error: "Learning path not found" }, { status: 404 });
    }

    // Get all items with content details
    const items = await db
      .select({
        id: learningPathItems.id,
        contentId: learningPathItems.contentId,
        order: learningPathItems.order,
        title: content.title,
        description: content.description,
        type: content.type,
        body: content.body,
        videoUrl: content.videoUrl,
      })
      .from(learningPathItems)
      .leftJoin(content, eq(learningPathItems.contentId, content.id))
      .where(eq(learningPathItems.pathId, id))
      .orderBy(asc(learningPathItems.order));

    // Get progress for each item if user is logged in
    let completedCount = 0;
    let currentItemIndex = 0;

    const itemsWithProgress = await Promise.all(
      items.map(async (item, index) => {
        if (!session?.user?.id) {
          return { ...item, completed: false, isCurrent: false };
        }

        const [progress] = await db
          .select()
          .from(contentProgress)
          .where(
            and(
              eq(contentProgress.contentId, item.contentId),
              eq(contentProgress.userId, session.user.id)
            )
          );

        const completed = progress?.completed || false;
        if (completed) {
          completedCount++;
        } else if (currentItemIndex === 0) {
          currentItemIndex = index;
        }

        return {
          ...item,
          completed,
          completedAt: progress?.completedAt,
          checklistState: progress?.checklistState,
          isCurrent: !completed && index === currentItemIndex,
        };
      })
    );

    // Mark first incomplete item as current
    if (session?.user?.id && completedCount < items.length) {
      const firstIncomplete = itemsWithProgress.find((item) => !item.completed);
      if (firstIncomplete) {
        firstIncomplete.isCurrent = true;
      }
    }

    return NextResponse.json({
      ...path,
      items: itemsWithProgress,
      totalItems: items.length,
      completedItems: completedCount,
      progress: items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0,
    });
  } catch (error) {
    console.error("Error fetching learning path:", error);
    return NextResponse.json({ error: "Failed to fetch learning path" }, { status: 500 });
  }
}

// PATCH /api/learning-paths/[id] - Update learning path (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.isOnboarding !== undefined) updateData.isOnboarding = body.isOnboarding;
    if (body.order !== undefined) updateData.order = body.order;

    const [updated] = await db
      .update(learningPaths)
      .set(updateData)
      .where(eq(learningPaths.id, id))
      .returning();

    // Update items if provided
    if (body.contentIds) {
      // Remove existing items
      await db.delete(learningPathItems).where(eq(learningPathItems.pathId, id));

      // Add new items
      if (body.contentIds.length > 0) {
        await db.insert(learningPathItems).values(
          body.contentIds.map((contentId: string, index: number) => ({
            pathId: id,
            contentId,
            order: index,
          }))
        );
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating learning path:", error);
    return NextResponse.json({ error: "Failed to update learning path" }, { status: 500 });
  }
}

// DELETE /api/learning-paths/[id] - Delete learning path (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete items first
    await db.delete(learningPathItems).where(eq(learningPathItems.pathId, id));
    // Then delete path
    await db.delete(learningPaths).where(eq(learningPaths.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting learning path:", error);
    return NextResponse.json({ error: "Failed to delete learning path" }, { status: 500 });
  }
}
