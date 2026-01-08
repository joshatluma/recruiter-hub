import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { content, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, ilike, or, and } from "drizzle-orm";
import { semanticSearch } from "@/lib/ai";

// POST /api/ai/search - Semantic search through content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Get all published content
    const allContent = await db
      .select({
        id: content.id,
        title: content.title,
        description: content.description,
        type: content.type,
        category: content.category,
        tags: content.tags,
        updatedAt: content.updatedAt,
        authorId: content.authorId,
        authorName: users.name,
      })
      .from(content)
      .leftJoin(users, eq(content.authorId, users.id))
      .where(eq(content.status, "published"))
      .orderBy(desc(content.updatedAt));

    // If no API key, fall back to basic keyword search
    if (!process.env.GEMINI_API_KEY) {
      const keywords = query.toLowerCase().split(/\s+/);
      const results = allContent.filter((item) => {
        const searchText = `${item.title} ${item.description || ""} ${(item.tags as string[] || []).join(" ")}`.toLowerCase();
        return keywords.some((keyword: string) => searchText.includes(keyword));
      });

      return NextResponse.json({
        results: results.slice(0, 20),
        isDemo: true,
      });
    }

    // Use semantic search with Gemini
    const contentList = allContent.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description || "",
    }));

    const rankedIds = await semanticSearch(query, contentList);

    // Order results by AI ranking
    const rankedResults = rankedIds
      .map((id) => allContent.find((c) => c.id === id))
      .filter(Boolean);

    return NextResponse.json({
      results: rankedResults,
      isDemo: false,
    });
  } catch (error) {
    console.error("Error in semantic search:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
