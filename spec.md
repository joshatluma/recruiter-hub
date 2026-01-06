# Recruiter Hub

A recruiting enablement platform for Luma Labs, centralizing all training, processes, workflows, videos, and resources for the recruiting team.

---

## Platform Overview

**Purpose:** Single source of truth for recruiter onboarding and continuous enablement

**Target Organization:** Luma Labs (single-tenant, @lumalabs.ai users only)

**Team Size:** Small (<10 recruiters initially)

**Launch Strategy:** Launch with platform structure, content built organically post-launch

---

## Core Features

### 1. Content Library

A centralized repository for all recruiting knowledge:

- **Training Materials** - Onboarding curriculum, skill development, best practices
- **Process Documentation** - Standardized workflows, interview procedures, evaluation frameworks
- **Interactive Workflows** - Mix of static docs, trackable checklists, and guided wizards
- **Video Content** - Embedded videos from Loom, YouTube, Vimeo (external hosting only)
- **Playbooks & Templates** - Scripts, email templates, sourcing strategies

**Content Organization:**
- AI-suggested taxonomy - system recommends categories/tags, users confirm or adjust
- Semantic understanding enables intelligent content relationships

### 2. AI Content Copilot (Gemini-powered)

A conversational AI assistant for content creation:

**Availability:** Content creation/editing contexts only (not a floating global assistant)

**Input Formats Supported:**
- Documents (PDFs, Google Docs, Notion exports)
- Media (video/audio recordings for transcription and summarization)
- Conversations (Slack threads, emails, meeting notes)

**Output Capabilities:**
- Structured training modules and SOPs
- Step-by-step guides and checklists
- FAQs and decision logs
- Playbooks from raw knowledge

**Workflow:** Users interact via chat interface to draft, refine, and restructure content

### 3. Learning Paths

**Model:** Role-based hybrid
- **New Recruiters:** Structured onboarding path with prescribed sequence
- **Experienced Recruiters:** Free exploration of the knowledge base

**Onboarding Track:** Single universal path for all recruiters (not specialty-specific)

**Progress Tracking:** Completion-based only (no formal quizzes or assessments)

**Recommendations:** AI-curated suggestions for related content based on semantic understanding

### 4. Knowledge Discovery

**Search:** AI-powered semantic search + faceted filtering
- Natural language queries ("show me everything about sourcing engineers")
- Filter by content type, topic, audience, recency

**Knowledge Gap Handling:**
1. AI attempts to answer from existing content first
2. If AI can't answer, routes to expert directory
3. Content request queue for topics that need new documentation

### 5. Expert Directory & Q&A

**Expertise Signals (multi-signal combined):**
- Self-declared skills on profiles
- Manager-assigned expertise badges
- Inferred from content contributions and Q&A activity

**Q&A System:**
- Public by default - all questions and answers visible to everyone
- Builds shared FAQ/knowledge base over time
- Experts can be directly messaged for guidance

### 6. Gamification & Recognition

**Point System:** Balanced mix of learning and contributing
- Points for completing content and staying current
- Points for creating content and answering questions
- Peer kudos and recognition

**Leaderboard:** Org-wide, all-time cumulative rankings

**Social Features:** Contribution streaks, badges, peer recognition

### 7. Content Versioning & Recertification

**When Content Changes:**
- Old versions overwritten (not archived)
- Notifications sent to affected users
- Users who completed old training flagged for recertification

**Recertification:** Internal quality tracking only (no external compliance requirements)

---

## Content Management

### Authoring Model

**Who Creates:** Collaborative with approvals
- Any user can propose content
- Admin review required before publishing

**AI Assistance:** Chat copilot helps build content from various input formats

### Approval Workflow

**Process:** Binary approve/reject
- Reviewer approves or rejects with optional comment
- If rejected, submitter revises and resubmits

### Sensitive Data Handling

**Approach:** Policy documentation only
- Guidelines provided about what not to include
- Trust users to follow policies
- No automatic PII detection

---

## User Management

### Authentication

- Google OAuth only
- Restricted to @lumalabs.ai email addresses
- No standalone username/password option

### Permissions

**Two-tier model:**
- **Admins:** Full control - publish content, manage users, configure platform
- **Users:** Consume content, contribute to approval queue, participate in Q&A

---

## Engagement & Notifications

### Engagement Model

**Primary:** Pull-based (users come when needed)

**Proactive:** Weekly email digest containing:
- New and updated content highlights
- Personal progress summary
- (No Slack integration)

---

## Technical Architecture

### Stack

- **Frontend:** React/Next.js
- **Backend:** Node.js
- **Database:** PostgreSQL
- **AI:** Google Gemini API
- **Hosting:** Vercel or Netlify

### Design

- **Responsive:** Desktop-first, works well on mobile browsers
- **Branding:** Hard-coded Luma Labs branding
- **Scale:** Architected for small team, simple infrastructure

---

## User Experience

### Navigation

- Content library with AI-powered search
- Learning paths section for structured onboarding
- Expert directory for finding subject matter experts
- Q&A section for public questions and answers
- Leaderboard for gamification standings
- Profile with progress, expertise, and contributions

### AI Touchpoints

- Content creation interface (chat copilot)
- Search (semantic understanding)
- Content recommendations
- Knowledge gap assistance (attempts to answer before escalating)

---

## Success Metrics

### Primary Goals

1. Accelerate recruiter onboarding and time-to-productivity
2. Ensure consistency in recruiting practices
3. Provide easy access to up-to-date resources
4. Enable continuous learning and skill development
5. Capture and share institutional knowledge

### Tracking

- Basic completion metrics (who completed what, when)
- Content engagement (views, time spent)
- Gamification activity (points, contributions)

---

## Target Users

| User Type | Primary Use Case |
|-----------|------------------|
| New Recruiters | Complete structured onboarding path |
| Experienced Recruiters | Reference materials, knowledge search |
| Recruiting Managers | Monitor team progress, contribute expertise |
| Admins | Manage content, approve submissions, configure platform |

---

## Future Considerations

*Not in V1, but architecturally aware:*

- Multi-tenant capability if needed for expansion
- ATS integration for contextual content surfacing
- Advanced analytics (performance correlation)
- Native mobile apps
- More sophisticated compliance/audit trails
