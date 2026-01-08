import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { learningPaths, learningPathItems, content, contentProgress } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, asc, sql, and } from "drizzle-orm";

// GET /api/learning-paths - List all learning paths with progress
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    const paths = await db
      .select()
      .from(learningPaths)
      .orderBy(asc(learningPaths.order));

    // Get items and progress for each path
    const pathsWithDetails = await Promise.all(
      paths.map(async (path) => {
        const items = await db
          .select({
            id: learningPathItems.id,
            contentId: learningPathItems.contentId,
            order: learningPathItems.order,
            title: content.title,
            description: content.description,
            type: content.type,
          })
          .from(learningPathItems)
          .leftJoin(content, eq(learningPathItems.contentId, content.id))
          .where(eq(learningPathItems.pathId, path.id))
          .orderBy(asc(learningPathItems.order));

        // Get user progress if logged in
        let completedCount = 0;
        let itemsWithProgress = items;

        if (session?.user?.id) {
          itemsWithProgress = await Promise.all(
            items.map(async (item) => {
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
              if (completed) completedCount++;

              return {
                ...item,
                completed,
                completedAt: progress?.completedAt,
              };
            })
          );
        }

        return {
          ...path,
          items: itemsWithProgress,
          totalItems: items.length,
          completedItems: completedCount,
          progress: items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0,
        };
      })
    );

    return NextResponse.json(pathsWithDetails);
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    return NextResponse.json({ error: "Failed to fetch learning paths" }, { status: 500 });
  }
}

// POST /api/learning-paths - Create a new learning path (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, isOnboarding, order, contentIds } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [newPath] = await db
      .insert(learningPaths)
      .values({
        title,
        description,
        isOnboarding: isOnboarding || false,
        order: order || 0,
      })
      .returning();

    // Add content items to path
    if (contentIds && contentIds.length > 0) {
      await db.insert(learningPathItems).values(
        contentIds.map((contentId: string, index: number) => ({
          pathId: newPath.id,
          contentId,
          order: index,
        }))
      );
    }

    return NextResponse.json(newPath, { status: 201 });
  } catch (error) {
    console.error("Error creating learning path:", error);
    return NextResponse.json({ error: "Failed to create learning path" }, { status: 500 });
  }
}
