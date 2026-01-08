import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { content, users, contentProgress } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

// GET /api/content/[id] - Get single content item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const [item] = await db
      .select({
        id: content.id,
        title: content.title,
        description: content.description,
        type: content.type,
        body: content.body,
        videoUrl: content.videoUrl,
        category: content.category,
        tags: content.tags,
        status: content.status,
        version: content.version,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
        publishedAt: content.publishedAt,
        authorId: content.authorId,
        authorName: users.name,
        authorImage: users.image,
      })
      .from(content)
      .leftJoin(users, eq(content.authorId, users.id))
      .where(eq(content.id, id));

    if (!item) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Get user's progress if logged in
    let progress = null;
    if (session?.user?.id) {
      const [userProgress] = await db
        .select()
        .from(contentProgress)
        .where(
          and(
            eq(contentProgress.contentId, id),
            eq(contentProgress.userId, session.user.id)
          )
        );
      progress = userProgress || null;
    }

    return NextResponse.json({ ...item, progress });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

// PATCH /api/content/[id] - Update content
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

    // Get existing content
    const [existing] = await db
      .select()
      .from(content)
      .where(eq(content.id, id));

    if (!existing) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Only author or admin can update
    if (existing.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    // Allow updating these fields
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.body !== undefined) updateData.body = body.body;
    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.category !== undefined) updateData.category = body.category;

    // Only admin can change status
    if (body.status !== undefined && session.user.role === "admin") {
      updateData.status = body.status;
      if (body.status === "published" && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const [updated] = await db
      .update(content)
      .set(updateData)
      .where(eq(content.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}

// DELETE /api/content/[id] - Delete content
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

    // Get existing content
    const [existing] = await db
      .select()
      .from(content)
      .where(eq(content.id, id));

    if (!existing) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Only author or admin can delete
    if (existing.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.delete(content).where(eq(content.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}
