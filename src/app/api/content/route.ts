import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { content, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, ilike, or, sql, and } from "drizzle-orm";

// GET /api/content - List all published content (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "published";

    const conditions = [];

    // Status filter (default to published for regular users)
    if (status !== "all") {
      conditions.push(eq(content.status, status as "draft" | "pending" | "published"));
    }

    // Type filter
    if (type && type !== "all") {
      conditions.push(eq(content.type, type as "document" | "video" | "checklist" | "wizard" | "playbook"));
    }

    // Category filter
    if (category && category !== "All Categories") {
      conditions.push(eq(content.category, category));
    }

    // Search filter (title, description, or tags)
    if (search) {
      conditions.push(
        or(
          ilike(content.title, `%${search}%`),
          ilike(content.description, `%${search}%`)
        )
      );
    }

    const items = await db
      .select({
        id: content.id,
        title: content.title,
        description: content.description,
        type: content.type,
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
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(content.updatedAt))
      .limit(50);

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

// POST /api/content - Create new content
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, type, body: contentBody, videoUrl, tags, category } = body;

    if (!title || !type) {
      return NextResponse.json({ error: "Title and type are required" }, { status: 400 });
    }

    const [newContent] = await db
      .insert(content)
      .values({
        title,
        description,
        type,
        body: contentBody,
        videoUrl,
        tags: tags || [],
        category,
        status: session.user.role === "admin" ? "published" : "pending",
        authorId: session.user.id,
        publishedAt: session.user.role === "admin" ? new Date() : null,
      })
      .returning();

    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 });
  }
}
