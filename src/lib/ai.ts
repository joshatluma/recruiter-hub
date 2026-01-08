import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateContentSuggestions(input: string, type: string) {
  const prompt = `You are an AI assistant helping create recruiting training content.

Given this input:
"""
${input}
"""

Generate a structured ${type} for a recruiter training platform. Format the output as:

# Title

## Overview
Brief summary of what this content covers

## Content
Main content formatted in markdown

## Key Takeaways
- Bullet points of key learnings

## Tags
Suggested tags: [comma-separated list]`;

  const result = await gemini.generateContent(prompt);
  return result.response.text();
}

export async function semanticSearch(query: string, contentList: { id: string; title: string; description: string }[]) {
  const prompt = `Given this search query: "${query}"

And these content items:
${contentList.map((c, i) => `${i + 1}. [${c.id}] ${c.title}: ${c.description || "No description"}`).join("\n")}

Return the IDs of the most relevant items (up to 10), ranked by relevance. Return as JSON array of IDs only.
Example: ["id1", "id2", "id3"]`;

  const result = await gemini.generateContent(prompt);
  const text = result.response.text();

  try {
    const match = text.match(/\[.*\]/s);
    if (match) {
      return JSON.parse(match[0]) as string[];
    }
  } catch {
    // Fallback to returning all items
  }

  return contentList.map(c => c.id);
}

export async function suggestTags(content: string) {
  const prompt = `Analyze this recruiting training content and suggest relevant tags (5-10 tags):

"""
${content}
"""

Return tags as a JSON array of lowercase strings.
Example: ["sourcing", "technical-recruiting", "interview-prep"]`;

  const result = await gemini.generateContent(prompt);
  const text = result.response.text();

  try {
    const match = text.match(/\[.*\]/s);
    if (match) {
      return JSON.parse(match[0]) as string[];
    }
  } catch {
    // Fallback
  }

  return ["general"];
}

export async function answerFromContent(question: string, relevantContent: string[]) {
  const prompt = `You are an AI assistant for a recruiting training platform at Luma Labs.

A recruiter asked: "${question}"

Here is relevant content from our knowledge base:
${relevantContent.join("\n\n---\n\n")}

If you can answer based on the provided content, give a helpful response. If the content doesn't cover this topic, respond with:
"I don't have specific information about this topic in our knowledge base. Consider asking an expert or submitting a content request."

Keep responses concise and practical.`;

  const result = await gemini.generateContent(prompt);
  return result.response.text();
}
