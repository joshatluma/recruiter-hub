import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { kudos, users, pointTransactions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, sql } from "drizzle-orm";

// GET /api/kudos - Get recent kudos (for feed)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const recentKudos = await db
      .select({
        id: kudos.id,
        message: kudos.message,
        createdAt: kudos.createdAt,
        fromUserId: kudos.fromUserId,
        toUserId: kudos.toUserId,
      })
      .from(kudos)
      .orderBy(desc(kudos.createdAt))
      .limit(limit);

    // Get user details for each kudos
    const kudosWithUsers = await Promise.all(
      recentKudos.map(async (k) => {
        const [fromUser] = await db
          .select({ name: users.name, image: users.image })
          .from(users)
          .where(eq(users.id, k.fromUserId));

        const [toUser] = await db
          .select({ name: users.name, image: users.image })
          .from(users)
          .where(eq(users.id, k.toUserId));

        return {
          ...k,
          fromUser,
          toUser,
        };
      })
    );

    return NextResponse.json(kudosWithUsers);
  } catch (error) {
    console.error("Error fetching kudos:", error);
    return NextResponse.json({ error: "Failed to fetch kudos" }, { status: 500 });
  }
}

// POST /api/kudos - Give kudos to someone
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { toUserId, message } = body;

    if (!toUserId) {
      return NextResponse.json({ error: "Recipient is required" }, { status: 400 });
    }

    if (toUserId === session.user.id) {
      return NextResponse.json({ error: "Cannot give kudos to yourself" }, { status: 400 });
    }

    // Verify recipient exists
    const [recipient] = await db
      .select()
      .from(users)
      .where(eq(users.id, toUserId));

    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    const [newKudos] = await db
      .insert(kudos)
      .values({
        fromUserId: session.user.id,
        toUserId,
        message,
      })
      .returning();

    // Award points to recipient
    const pointsToAward = 15;
    await db.insert(pointTransactions).values({
      userId: toUserId,
      amount: pointsToAward,
      reason: "Received kudos",
      referenceType: "kudos",
      referenceId: newKudos.id,
    });

    await db
      .update(users)
      .set({ points: sql`${users.points} + ${pointsToAward}` })
      .where(eq(users.id, toUserId));

    return NextResponse.json(newKudos, { status: 201 });
  } catch (error) {
    console.error("Error creating kudos:", error);
    return NextResponse.json({ error: "Failed to create kudos" }, { status: 500 });
  }
}
