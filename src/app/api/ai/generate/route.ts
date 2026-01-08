import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateContentSuggestions, suggestTags } from "@/lib/ai";

// POST /api/ai/generate - Generate content with AI
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, type = "document" } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      // Return mock response for demo mode
      return NextResponse.json({
        content: generateMockContent(prompt, type),
        tags: ["recruiting", "training", "best-practices"],
        isDemo: true,
      });
    }

    // Generate content with Gemini
    const generatedContent = await generateContentSuggestions(prompt, type);

    // Suggest tags for the content
    const tags = await suggestTags(generatedContent);

    return NextResponse.json({
      content: generatedContent,
      tags,
      isDemo: false,
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}

function generateMockContent(prompt: string, type: string): string {
  const typeFormatting: Record<string, string> = {
    document: `# ${prompt}

## Overview
This AI-generated ${type} provides comprehensive guidance on ${prompt.toLowerCase()}.

## Key Concepts

### Understanding the Fundamentals
When approaching ${prompt.toLowerCase()}, it's important to first understand the core principles that drive success in this area.

### Best Practices
1. **Start with research** - Gather information before taking action
2. **Plan your approach** - Create a structured plan
3. **Execute systematically** - Follow your plan step by step
4. **Measure and iterate** - Track results and improve

## Detailed Guide

### Getting Started
Begin by identifying your goals and the resources available to you. This will help you create a roadmap for success.

### Implementation Steps
1. Define clear objectives
2. Identify key stakeholders
3. Create a timeline
4. Execute and monitor progress
5. Review and optimize

### Common Pitfalls to Avoid
- Rushing without proper planning
- Ignoring feedback from stakeholders
- Not measuring results
- Failing to adapt to changing circumstances

## Key Takeaways
- Preparation is essential for success
- Consistency leads to better outcomes
- Always be willing to learn and adapt

## Suggested Tags
recruiting, training, best-practices, onboarding`,

    checklist: `# ${prompt}

## Checklist

### Preparation Phase
- [ ] Review requirements and objectives
- [ ] Gather necessary resources
- [ ] Identify key stakeholders
- [ ] Set timeline and milestones

### Execution Phase
- [ ] Complete initial setup
- [ ] Conduct first review
- [ ] Gather feedback
- [ ] Make adjustments

### Follow-up Phase
- [ ] Document lessons learned
- [ ] Update processes as needed
- [ ] Share insights with team
- [ ] Schedule next review

## Notes
Use this checklist to ensure comprehensive coverage of ${prompt.toLowerCase()}.`,

    playbook: `# ${prompt} Playbook

## Objective
Provide a step-by-step guide for ${prompt.toLowerCase()}.

## When to Use This Playbook
Use this playbook when you need to ${prompt.toLowerCase()} effectively and consistently.

## Step-by-Step Process

### Step 1: Preparation
**Goal:** Set yourself up for success

**Actions:**
- Review relevant documentation
- Identify resources needed
- Set clear objectives

**Tips:**
- Don't skip this step
- Take notes for future reference

### Step 2: Execution
**Goal:** Implement the core activities

**Actions:**
- Follow the established process
- Document progress
- Communicate with stakeholders

**Scripts/Templates:**
"Hi [Name], I wanted to reach out regarding [topic]. [Continue with purpose]..."

### Step 3: Follow-up
**Goal:** Ensure completion and capture learnings

**Actions:**
- Review outcomes
- Gather feedback
- Update documentation

## Common Scenarios

### Scenario A: Standard Process
Follow steps 1-3 as outlined above.

### Scenario B: Complex Situations
- Involve additional stakeholders
- Allow extra time for review
- Document extensively

## FAQ
**Q: How long should this take?**
A: Typically 1-2 hours for the full process.

**Q: Who should be involved?**
A: At minimum, the primary stakeholder and one reviewer.`,
  };

  return typeFormatting[type] || typeFormatting.document;
}
