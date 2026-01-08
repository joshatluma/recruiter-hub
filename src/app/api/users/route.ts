import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, content, questions, answers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, ilike, or, sql, and } from "drizzle-orm";

// GET /api/users - List users (for expert directory)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const expertise = searchParams.get("expertise");

    const conditions = [];

    // Search filter
    if (search) {
      conditions.push(
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.bio, `%${search}%`)
        )
      );
    }

    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
        bio: users.bio,
        expertise: users.expertise,
        points: users.points,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(users.points));

    // Get stats for each user
    const usersWithStats = await Promise.all(
      allUsers.map(async (user) => {
        // Count content created
        const contentCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(content)
          .where(and(eq(content.authorId, user.id), eq(content.status, "published")));

        // Count questions answered
        const answerCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(answers)
          .where(eq(answers.authorId, user.id));

        // Filter by expertise if specified
        if (expertise && expertise !== "All Areas") {
          const userExpertise = user.expertise as string[] | null;
          if (!userExpertise || !userExpertise.some(e =>
            e.toLowerCase().includes(expertise.toLowerCase())
          )) {
            return null;
          }
        }

        return {
          ...user,
          contentCreated: Number(contentCount[0]?.count) || 0,
          questionsAnswered: Number(answerCount[0]?.count) || 0,
        };
      })
    );

    // Filter out nulls (users who didn't match expertise filter)
    const filteredUsers = usersWithStats.filter(Boolean);

    return NextResponse.json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
