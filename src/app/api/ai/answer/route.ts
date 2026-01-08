import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { content } from "@/lib/db/schema";
import { eq, ilike, or } from "drizzle-orm";
import { answerFromContent, semanticSearch } from "@/lib/ai";

// POST /api/ai/answer - Get AI answer from knowledge base
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // Get all published content
    const allContent = await db
      .select({
        id: content.id,
        title: content.title,
        description: content.description,
        body: content.body,
      })
      .from(content)
      .where(eq(content.status, "published"));

    // If no API key, return demo response
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        answer: generateDemoAnswer(question),
        sources: [],
        isDemo: true,
        canAnswer: true,
      });
    }

    // Find relevant content using semantic search
    const contentList = allContent.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description || "",
    }));

    const relevantIds = await semanticSearch(question, contentList);
    const relevantContent = relevantIds
      .slice(0, 5)
      .map((id) => {
        const item = allContent.find((c) => c.id === id);
        if (item) {
          return `## ${item.title}\n${item.description || ""}\n\n${item.body || ""}`;
        }
        return null;
      })
      .filter(Boolean) as string[];

    // Get AI answer
    const answer = await answerFromContent(question, relevantContent);

    // Check if AI could answer
    const canAnswer = !answer.includes("don't have specific information");

    // Get source content for citations
    const sources = relevantIds.slice(0, 3).map((id) => {
      const item = allContent.find((c) => c.id === id);
      return item ? { id: item.id, title: item.title } : null;
    }).filter(Boolean);

    return NextResponse.json({
      answer,
      sources,
      isDemo: false,
      canAnswer,
    });
  } catch (error) {
    console.error("Error getting AI answer:", error);
    return NextResponse.json({ error: "Failed to get answer" }, { status: 500 });
  }
}

function generateDemoAnswer(question: string): string {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes("source") || lowerQuestion.includes("find candidate")) {
    return `Based on our knowledge base, here are some best practices for sourcing:

**Key Sourcing Strategies:**
1. **Boolean Search** - Use advanced operators on LinkedIn (AND, OR, NOT, quotes)
2. **X-Ray Search** - Search specific sites using Google: site:linkedin.com/in "software engineer"
3. **Referrals** - Leverage your network and current employees
4. **Passive Outreach** - Craft personalized messages that stand out

**Tools to Use:**
- LinkedIn Recruiter
- GitHub (for technical roles)
- Industry-specific communities

Would you like me to elaborate on any of these strategies?`;
  }

  if (lowerQuestion.includes("interview") || lowerQuestion.includes("screen")) {
    return `Here's guidance on conducting effective interviews:

**Phone Screen Best Practices:**
1. Start with rapport building (2-3 min)
2. Review their background and experience
3. Assess role fit and motivation
4. Answer their questions about the role/company
5. Explain next steps clearly

**Key Questions to Ask:**
- "Walk me through your experience with [relevant skill]"
- "What interests you about this opportunity?"
- "What's your timeline for making a decision?"

**Red Flags to Watch For:**
- Lack of specific examples
- Negative comments about previous employers
- Unclear career goals

Check our Interview Evaluation Framework for the full rubric.`;
  }

  if (lowerQuestion.includes("offer") || lowerQuestion.includes("negotiat")) {
    return `Here's our guidance on offer management:

**Extending Offers:**
1. Always call before sending written offer
2. Express enthusiasm for the candidate
3. Walk through compensation package clearly
4. Give reasonable timeline for decision (3-5 days)

**Handling Negotiations:**
- Listen first, understand their needs
- Know your flexibility before the conversation
- Consider non-monetary alternatives (equity, PTO, flexibility)
- Escalate to manager if beyond your authority

**Counter-Offer Situations:**
- Acknowledge their position
- Reiterate why they were excited about us
- Focus on long-term career growth, not just immediate compensation

See our Offer Negotiation Playbook for scripts and scenarios.`;
  }

  return `Based on your question about "${question}", here's what I found in our knowledge base:

This is a great question! While I don't have specific documentation on this exact topic, here are some general best practices:

1. **Start with research** - Understand the context and requirements
2. **Consult with experts** - Reach out to team members with relevant experience
3. **Document your learnings** - Help build our knowledge base for others

I'd recommend:
- Checking our Content Library for related topics
- Asking in the Q&A section - someone on the team may have experience
- Reaching out to an expert in our Expert Directory

Would you like me to help you find related content or connect you with an expert?`;
}
