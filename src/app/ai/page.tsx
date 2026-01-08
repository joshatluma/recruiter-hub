"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Sparkles,
  Send,
  FileText,
  Video,
  CheckSquare,
  BookOpen,
  Upload,
  Wand2,
  RefreshCw,
  Copy,
  Check,
  Loader2,
} from "lucide-react";

const contentTypes = [
  { id: "document", label: "Document", icon: FileText, description: "Training docs, guides, SOPs" },
  { id: "checklist", label: "Checklist", icon: CheckSquare, description: "Interactive task lists" },
  { id: "playbook", label: "Playbook", icon: BookOpen, description: "Step-by-step playbooks" },
];

const inputSources = [
  { id: "text", label: "Write from scratch", icon: FileText },
  { id: "paste", label: "Paste existing content", icon: Copy },
  { id: "upload", label: "Upload file", icon: Upload },
];

const examplePrompts = [
  "Create a guide for conducting technical phone screens",
  "Write a checklist for new hire onboarding activities",
  "Generate a playbook for handling candidate objections",
  "Summarize our interview evaluation criteria",
];

export default function AIPage() {
  const user = { name: "Demo User", email: "demo@lumalabs.ai", role: "user" };
  const [selectedType, setSelectedType] = useState("document");
  const [inputSource, setInputSource] = useState("text");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: selectedType }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedContent(data.content);
        // Auto-populate suggested tags
        if (data.tags && data.tags.length > 0) {
          setSuggestedTags(data.tags);
        }
      } else {
        throw new Error("Failed to generate");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      // Fallback demo content
      setGeneratedContent(`# ${prompt}

## Overview
This is AI-generated content based on your prompt. Configure GEMINI_API_KEY for real AI generation.

## Key Points
- Point 1: Important information about ${prompt.toLowerCase()}
- Point 2: Best practices and recommendations
- Point 3: Common pitfalls to avoid

## Detailed Guide

### Getting Started
Begin by understanding the core concepts and requirements...

### Step-by-Step Process
1. First, identify your target audience
2. Next, gather relevant materials and resources
3. Then, structure your approach systematically
4. Finally, review and refine your output

### Tips for Success
- Always maintain consistency
- Document your process
- Seek feedback from peers
- Iterate and improve

## Tags
Suggested: recruiting, training, best-practices, onboarding`);
    } finally {
      setIsGenerating(false);
    }
  };

  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AppLayout user={user}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-playfair)" }}>
              AI Content Copilot
            </h1>
          </div>
          <p className="text-[var(--text-secondary)]">
            Generate training content, playbooks, and documentation with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input panel */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {/* Content type selection */}
            <div className="surface rounded-xl p-5">
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">Content Type</h3>
              <div className="space-y-2">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      selectedType === type.id
                        ? "bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)]"
                        : "bg-[var(--bg-tertiary)] border border-transparent hover:border-[var(--border-default)] text-[var(--text-secondary)]"
                    }`}
                  >
                    <type.icon className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium">{type.label}</p>
                      <p className="text-xs opacity-70">{type.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input source */}
            <div className="surface rounded-xl p-5">
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">Input Source</h3>
              <div className="flex gap-2">
                {inputSources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => setInputSource(source.id)}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                      inputSource === source.id
                        ? "bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)]"
                        : "bg-[var(--bg-tertiary)] border border-transparent hover:border-[var(--border-default)] text-[var(--text-secondary)]"
                    }`}
                  >
                    <source.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{source.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Example prompts */}
            <div className="surface rounded-xl p-5">
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">Example Prompts</h3>
              <div className="space-y-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="w-full text-left p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    &ldquo;{example}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3 space-y-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Prompt input */}
            <div className="surface rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[var(--text-primary)]">
                  What would you like to create?
                </h3>
                <span className="text-xs text-[var(--text-muted)]">
                  Powered by Gemini
                </span>
              </div>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the content you want to create..."
                  className="input min-h-[120px] resize-none pr-12"
                  rows={4}
                />
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="absolute bottom-3 right-3 w-10 h-10 rounded-lg bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Generated content */}
            {generatedContent ? (
              <div className="surface rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
                  <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-[var(--accent-primary)]" />
                    Generated Content
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerate}
                      className="btn-ghost flex items-center gap-1 text-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </button>
                    <button
                      onClick={handleCopy}
                      className="btn-secondary py-1.5 px-3 text-sm flex items-center gap-1"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-5 max-h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-[var(--text-secondary)]">
                    {generatedContent}
                  </pre>
                </div>
                <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
                  <button className="btn-primary w-full">
                    Submit for Review
                  </button>
                </div>
              </div>
            ) : (
              <div className="surface rounded-xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent-primary)]/10 mb-4">
                  <Sparkles className="w-8 h-8 text-[var(--accent-primary)]" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                  Ready to Generate
                </h3>
                <p className="text-[var(--text-secondary)] max-w-sm mx-auto">
                  Enter a prompt describing what you want to create, and AI will help you draft structured content.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
