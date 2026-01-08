/**
 * Seed script for Recruiter Hub
 * Populates the database with real Luma recruiting content from Notion
 */

import { db } from "./index";
import { content, learningPaths, learningPathItems, users } from "./schema";

// Real content from Luma's Notion recruiting docs
const seedContent = [
  // ===== FOUNDATIONAL / NORTH STAR =====
  {
    title: "Our North Star: Luma's Mission & Values",
    description: "Understand Luma's mission to build multimodal general intelligence and our 7 core values that guide every hiring decision.",
    type: "document" as const,
    category: "Foundational",
    tags: ["values", "culture", "mission", "onboarding"],
    body: `# Our North Star

## Mission Statement
**Luma's mission is to build multimodal general intelligence for everyone—making the creation and consumption of visual content limitless.**

We believe intelligent systems should understand and generate the world as humans experience it: through sight, sound, and interaction.

---

## Our 7 Core Values

### 1. Bias for Speed
We move fast and ship. We'd rather be directionally correct and learn quickly than wait for perfect certainty. Speed is a competitive advantage and a cultural habit.

### 2. High Standards
We hold ourselves to exceptional quality. "Good enough" isn't good enough. We push for excellence in our work, our products, and our team.

### 3. First Principles Thinking
We question assumptions and reason from fundamentals. We don't copy playbooks—we understand why things work and build from there.

### 4. Intellectual Honesty
We tell the truth, especially when it's hard. We give and receive direct feedback. We admit mistakes and change our minds when evidence demands it.

### 5. Low Ego, High Impact
The best idea wins, regardless of who proposed it. We care about outcomes, not credit. We collaborate without politics.

### 6. Ownership & Accountability
We take full ownership of our work and its outcomes. We don't wait for permission or blame others. We see problems and fix them.

### 7. Curiosity & Continuous Learning
We're students first. We stay hungry to learn, grow, and understand. The best team members are always improving.

---

## Hiring Philosophy

### Builder Over Optimizer
We look for **builders**—people who create from scratch, thrive in ambiguity, and ship fast. Early-stage startups need people who build, not optimize existing systems.

### Intellectual Horsepower + Drive
We hire for raw intelligence combined with relentless work ethic. Smart and lazy doesn't work here. Neither does hardworking and slow.

### Culture Add, Not Culture Fit
We want people who share our values but bring diverse perspectives, experiences, and thinking styles.

### High Bar, Fast Process
We're selective but decisive. We know great talent doesn't wait. When we find someone exceptional, we move fast.
`,
    status: "published" as const,
  },

  // ===== PROCESS PLAYBOOKS =====
  {
    title: "The Recruiting Process Playbook",
    description: "Our complete standard operating procedure for hiring at Luma—from intake to offer.",
    type: "playbook" as const,
    category: "Process",
    tags: ["process", "playbook", "hiring", "gem"],
    body: `# The Recruiting Process Playbook

## Our Philosophy: Structured Process, High-Signal Outcomes

This playbook details our standard operating procedure for hiring at Luma. Following this process ensures consistency, fairness, and efficiency, allowing us to make high-quality hiring decisions quickly while providing an excellent candidate experience. **Gem is our single source of truth** for tracking all stages and activities.

---

## Overview: The Standard Hiring Funnel

While interview plans are calibrated per role (defined in the RAD), our process generally follows these core milestones:

1. **Prep & Kickoff** — Aligning on the role and strategy
2. **Sourcing & Application** — Building the candidate pool
3. **Recruiter Screen** — Initial assessment of alignment and motivation
4. **Hiring Manager Screen** — Deeper dive into domain expertise
5. **Technical / Domain Assessment** — Role-specific skills evaluation
6. **Core Interview Loop** — Cross-functional assessment
7. **Luma & You** — Final alignment with leadership
8. **Debrief & Final Decision** — Making the hire/no-hire call
9. **Closing & Offer** — Extending and securing the offer

---

## Stage-by-Stage Breakdown

### 1. Prep & Kickoff

**Goal:** Ensure full alignment between Recruiter and Hiring Manager on the role, profile, process, and sourcing strategy *before* engaging candidates.

**Owner(s):** Recruiter, Hiring Manager

**Key Activities:**
- Hiring Manager submits headcount request (if applicable)
- **Intake Meeting:** Recruiter and HM hold a formal intake meeting
- **RAD Creation:** Recruiter generates the Recruiter Alignment Document (RAD)
- **RAD Approval:** HM reviews and approves the RAD
- **Gem Setup:** Create Job in Gem, configure stages, add interview plan

**Tools:** Notion (RAD), Gem (Job Setup, Interview Plan)

**SLA:** RAD finalized & Gem job live within 48 hours of intake meeting

---

### 2. Sourcing & Application

**Goal:** Build a diverse and qualified pool of candidates aligned with the RAD.

**Owner(s):** Recruiter/Sourcer

**Key Activities:**
- Execute sourcing strategy defined in the RAD
- Utilize sourcing tools (LinkedIn Recruiter, Gem AI, Juicebox, SeekOut)
- Post job description to relevant channels
- Review inbound applications against RAD criteria

**Tools:** Gem, LinkedIn Recruiter, Juicebox, SeekOut

**SLA:** New applications reviewed within 48 business hours

---

### 3. Recruiter Screen

**Goal:** Assess core alignment with the role, understand candidate motivations, screen for logistics, and sell the Luma opportunity.

**Owner(s):** Recruiter

**Key Activities:**
- Schedule screen using self-schedule links
- Conduct 30-minute screen using RAD screening questions
- Log notes and scorecard in Gem
- Advance qualified candidates to HM Review

**SLA:** Schedule screen within 24 business hours. Notes logged within 24 hours of screen.

---

### 4. Hiring Manager Screen

**Goal:** Assess domain expertise, alignment with team needs, and confirm "builder" vs "optimizer" archetype.

**Owner(s):** Hiring Manager

**Key Activities:**
- Review Recruiter Screen notes in Gem
- Conduct 30-45 minute screen
- Submit feedback/scorecard promptly
- Provide clear Advance/Reject decision

**SLA:** HM review within 48 business hours. Feedback within 24 hours post-interview.

---

### 5. Technical / Domain Assessment

**Goal:** Objectively evaluate core technical or functional skills.

**Owner(s):** Assigned Interviewer(s)

**Key Activities:**
- Coordinate assessment (CodeSignal, live coding, portfolio review, system design)
- Conduct assessment according to calibrated plan
- Submit detailed, evidence-based feedback

**SLA:** Feedback submitted within 24 business hours post-assessment.

---

### 6. Core Interview Loop

**Goal:** Assess the candidate holistically across competencies, collaboration, and values.

**Owner(s):** Assigned Interviewers, Recruiter (Coordination)

**Key Activities:**
- Coordinate loop interviews based on approved plan
- Conduct interviews using calibrated questions
- Submit detailed, evidence-based feedback promptly

**SLA:** Feedback submitted within 24 business hours post-interview.

---

### 7. Luma & You

**Goal:** Provide candidate exposure to senior leadership, discuss vision and values, assess long-term alignment.

**Owner(s):** Senior Leader, Recruiter (Coordination)

---

### 8. Debrief & Final Decision

**Goal:** Make a calibrated, evidence-based hire/no-hire decision.

**Owner(s):** Hiring Manager (Decision Maker), Recruiter (Facilitator)

**Key Activities:**
- Ensure all feedback is submitted in Gem
- Schedule Debrief meeting with HM and core interviewers
- Follow structured format (review RAD filters, rate competencies, discuss flags)
- HM makes final hire/no-hire decision
- Update Gem with decision and notes

**SLA:** Decision within 48 business hours of final interview.

---

### 9. Closing & Offer

**Goal:** Extend a compelling offer and successfully close the candidate.

**Key Activities:**
- Collect offer details and initiate via Complete.so
- Benchmark and construct package
- Route for internal approvals
- Extend verbal offer
- Send formal offer documents
- Manage negotiation and acceptance
- Update Gem and kick off pre-boarding

**SLA:** Offer approvals within 24 business hours.
`,
    status: "published" as const,
  },

  // ===== THE OFFER PLAYBOOK =====
  {
    title: "The Offer Playbook",
    description: "A 5-stage process for extending compelling offers that close candidates.",
    type: "playbook" as const,
    category: "Closing",
    tags: ["offers", "closing", "compensation", "negotiation"],
    body: `# The Offer Playbook

## Purpose
Use async screens + LLM summarization to accelerate early evaluation while reducing scheduling overhead and increasing signal consistency.

---

## Stage 1: Pre-Offer Alignment

Before building an offer, ensure alignment on:

- **Compensation expectations** — Have we discussed comp expectations with the candidate?
- **Competing offers** — Are there active competing offers we need to address?
- **Timeline** — What's the candidate's decision timeline?
- **Concerns** — Any outstanding concerns from the candidate or the team?

**Owner:** Recruiter

---

## Stage 2: Building the Offer in Complete.so

**Steps:**
1. From Gem: Copy the \`application_id\` from the candidate's URL
2. In Complete.so: Go to Search ATS, paste the ID, and search
3. Select the candidate and click **Create Offer** to import Gem data
4. Review & Edit all details (ensure "Enable Signing Page" is ON)
5. Request Team Messages: Generate the unique link and share in candidate's Slack channel
6. (Optional) Add Competing Offers for visual comparison
7. Save & Publish to send the offer live

**Owner:** Recruiter + Biz Ops

---

## Stage 3: Verbal Offer

Before sending the formal offer:

- HM or Recruiter calls the candidate
- Walk through the key terms
- Gauge enthusiasm and address concerns
- Confirm timeline for decision

**Tips:**
- Be enthusiastic but not pushy
- Answer questions honestly
- Don't pressure immediate decisions

**Owner:** Hiring Manager and/or Recruiter

---

## Stage 4: Written Offer & Negotiation

**The offer package includes:**
- Base salary
- Equity (options/RSUs)
- Sign-on bonus (if applicable)
- Start date
- Title and level

**Negotiation principles:**
- We don't negotiate against ourselves
- We pay fairly and competitively
- We're transparent about our philosophy
- We move fast once aligned

**Owner:** Recruiter (with Biz Ops support)

---

## Stage 5: Acceptance & Handoff

Upon offer acceptance:

1. Update Gem status to "Offer Accepted"
2. Trigger pre-boarding workflows
3. Schedule welcome call with HM
4. Hand off to People Ops for onboarding
5. Celebrate! 🎉

**Owner:** Recruiter → People Ops
`,
    status: "published" as const,
  },

  // ===== SLAs & COMMUNICATION =====
  {
    title: "SLAs & Communication Standards",
    description: "Our service level agreements and communication standards for candidate experience.",
    type: "document" as const,
    category: "Standards",
    tags: ["sla", "communication", "candidate-experience", "standards"],
    body: `# SLAs & Communication Standards

## Our Philosophy: Speed, Clarity & Respect

Our Service Level Agreements (SLAs) and communication standards uphold our core philosophy: **Fast, Friendly, and Fair**. Every candidate deserves a timely, transparent, and respectful experience, regardless of the outcome.

---

## Core Recruiting SLAs

| Stage / Action | SLA Target | Owner(s) |
|----------------|------------|----------|
| New Application Review | 48 Business Hours | Recruiter |
| Recruiter Screen Scheduling | 24 Business Hours | Recruiter |
| Interview Feedback Submission | 24 Business Hours | Interviewer |
| HM Review Screened Candidates | 48 Business Hours | Hiring Manager |
| Post-Interview Loop Decision | 48 Business Hours | HM & Recruiter |
| Offer Approval Turnaround | 24 Business Hours | Biz Ops / People Ops |
| Candidate Rejection Notice | 48 Business Hours | Recruiter |
| Response to Candidate Inquiries | 24 Business Hours | Recruiter |

---

## External Communication Standards

### Tone
Always align with the **Luma AI Hiring Voice**:
- Aspirational
- Direct
- Inviting
- Human & Authentic

### Primary Channel
Use **Gem** for all primary candidate communication (emails, sequences, scheduling). This ensures everything is tracked in one place.

### Transparency
Be clear with candidates about:
- The process
- Timelines
- Next steps
- Set expectations upfront

### Personalization
While we use templates for efficiency, personalize messages where appropriate—especially for high-priority candidates or rejections after later stages.

### Feedback Policy
We generally do not provide detailed interview feedback to rejected candidates for legal and consistency reasons, but rejections should always be respectful and timely.

---

## Tools & Resources

- **Gem Sequences:** Pre-approved email templates
- **Gem Snippets:** Reusable text blocks
- **Slack Channels:** Dedicated channels per role/team
`,
    status: "published" as const,
  },

  // ===== SCHEDULING OPERATIONS =====
  {
    title: "Scheduling Operations Guide",
    description: "Standard operating procedures for handing off candidates for interview scheduling.",
    type: "document" as const,
    category: "Operations",
    tags: ["scheduling", "operations", "gem", "coordination"],
    body: `# Scheduling Operations Guide

## Purpose
This guide outlines the standard operating procedures for handing off candidates for interview scheduling and how scheduling operations manages the queue.

---

## Guide for Recruiters: How to Hand Off to Scheduling

Follow these steps *before* handing off a candidate for scheduling complex loops or panels. (Recruiter screens and HM screens should typically be self-scheduled.)

### Steps:

1. **Request Availability** — Obtain the candidate's availability first

2. **Assign Scheduler in Gem** — Use the \`Scheduling Assignee\` field and select the designated scheduler

3. **Add Note & Mention Scheduler:**
   - Create a note on the candidate's Gem profile
   - @mention the assigned scheduler
   - Include essential details using the template below

### Template Note (Copy-Paste into Gem):

\`\`\`
@SCHEDULERNAME — Candidate ready for scheduling

* **Role:** [Link to Gem Job]
* **Stage:** [e.g., Core Interview Loop]
* **Interview Plan Changes:** [None / Yes - describe]
* **Constraints:** [Timing constraints, interviewer preferences]
* **Urgency:** [Standard / URGENT]
\`\`\`

### SLA
Scheduling Ops target turnaround: **12 business hours**

### Quality Bar Before Handoff:
- ✅ Default interview plan is set in Gem
- ✅ Interviewers are attached to plan stages
- ✅ Candidate and interviewer prep notes are added
- ✅ Candidate availability has been requested/provided

---

## Guide for Schedulers: Managing the Queue

### Managing Your Queue:
1. Use Gem Projects or create a Saved View
2. Filter by \`Scheduling Assignee = [Your Name]\`
3. Uncheck \`Inactive\` + \`Unschedulable\` statuses
4. Save and pin the view for quick access

### Identifying New Items:
- Recruiters assign you via the \`Scheduling Assignee\` field
- You receive notifications when @mentioned in a Gem note

### Notifications to Enable:
- \`Notify me when candidate submits availability\`
- \`Notify me when assigned as Scheduler\`

### Prioritizing:
Prioritize candidates where you are both **assigned** and **@mentioned** in a note flagged as \`[URGENT]\`

### Handling Missing Info:
If critical details are missing, @mention the recruiter in the Gem note thread. **Do not schedule with incomplete information.**
`,
    status: "published" as const,
  },

  // ===== INTERVIEWER TRAINING =====
  {
    title: "Interviewer Training 101",
    description: "The 5-stage certification program for becoming a calibrated interviewer at Luma.",
    type: "document" as const,
    category: "Training",
    tags: ["interviewing", "training", "certification", "calibration"],
    body: `# Interviewer Training 101

## The 5-Stage Certification Program

Becoming a certified interviewer at Luma involves a structured program to ensure calibration, consistency, and quality.

---

## Stage 1: Nomination

**Who nominates:** Hiring Manager or Recruiting

**Criteria for nomination:**
- Has been at Luma for at least 90 days
- Demonstrates Luma values
- Has capacity for interview load
- Relevant domain expertise for the role type

---

## Stage 2: Training

**Format:** Self-paced + live session

**Curriculum:**
- [ ] Watch: "Calibrated Interviewing at Luma" (45 min video)
- [ ] Read: Interview question bank for your domain
- [ ] Complete: Bias awareness training
- [ ] Attend: Live calibration session (1 hour)

**Key Topics:**
- Structured interviewing methodology
- Evidence-based assessment
- Avoiding common biases
- Using scorecards effectively
- Legal considerations

---

## Stage 3: Shadow

**What you do:** Observe 2-3 interviews with a certified interviewer

**Focus areas:**
- How questions are asked
- How follow-ups probe for depth
- How evidence is captured
- How scorecards are completed

**After each shadow:**
- Debrief with the certified interviewer
- Compare your assessment to theirs
- Identify calibration gaps

---

## Stage 4: Reverse Shadow

**What you do:** Lead 2-3 interviews while a certified interviewer observes

**The observer:**
- Takes notes on your technique
- Provides feedback after each interview
- Validates your scorecard assessment

**Graduation criteria:**
- Consistent assessment quality
- Proper interview technique
- Accurate scorecard completion
- Aligned with hiring bar

---

## Stage 5: Graduate

**You're now certified to:**
- Conduct interviews independently
- Submit scorecards that inform hiring decisions
- Shadow new interviewer trainees

**Ongoing expectations:**
- Maintain feedback SLA (24 hours)
- Attend quarterly calibration sessions
- Flag any concerns about process or candidates

---

## Resources

- Interview Question Bank: [Link]
- Scorecard Templates: [Link]
- Calibration Session Schedule: [Link]
`,
    status: "published" as const,
  },

  // ===== HIRING PRIORITIES =====
  {
    title: "Understanding Luma's Hiring Priorities",
    description: "Learn how to view and understand role priority levels in Gem.",
    type: "document" as const,
    category: "Process",
    tags: ["priorities", "gem", "intake", "kickoff"],
    body: `# Understanding Luma's Hiring Priorities

## Overview
This guide defines Luma's hiring priority levels and explains how to view them in Gem.

---

## Priority Definitions

### P0 - Critical
- Full recruiting service + agency support
- Wins all trade-offs
- Dedicated recruiter bandwidth
- Escalation path to leadership

### P1 - High Priority
- Full recruiting service
- Comes second to P0s in any trade-off
- Regular status updates
- Active sourcing

### P2 - Active
- The role is posted
- Primary focus on reviewing inbound applications
- Limited proactive sourcing
- Standard process flow

### P3 - Passive
- The role is posted only
- No other active recruiting resources allocated
- Opportunistic hires only
- May be activated as bandwidth allows

---

## How to View Your Role Priorities

1. Navigate to **ATS > Jobs** in Gem
2. Check the **"Only show my jobs"** box
3. Review the **Headcount** and **Priority** columns for the latest information

---

## Trade-off Guidelines

When resources are constrained:

| If you have... | Do this first... |
|----------------|------------------|
| P0 and P1 conflicts | P0 wins |
| Multiple P0s | Escalate to leadership |
| P2 waiting | Focus on P0/P1 first |
| P3 candidate | Only if zero effort required |

---

## Questions?
Reach out to your Recruiting Lead or Josh Gill (Talent Systems & Ops).
`,
    status: "published" as const,
  },

  // ===== COMPLETE.SO GUIDE =====
  {
    title: "Using Complete.so for Interactive Offers",
    description: "Step-by-step guide for creating and managing interactive offers through Complete.so.",
    type: "document" as const,
    category: "Tools",
    tags: ["complete.so", "offers", "closing", "tools"],
    body: `# Using Complete.so for Interactive Offers

## Overview
Complete.so is our platform for creating interactive, visual offers that help candidates understand and compare their total compensation package.

---

## Step-by-Step Guide

### Step 1: Get the Candidate ID from Gem
- Open the candidate's profile in Gem
- Copy the \`application_id\` from the URL
- Example: \`gem.com/applications/abc123\` → copy \`abc123\`

### Step 2: Search in Complete.so
- Go to Complete.so
- Navigate to **Search ATS**
- Paste the application ID and search
- Select the correct candidate

### Step 3: Create the Offer
- Click **Create Offer**
- This imports the candidate's data from Gem
- Review all pre-populated fields

### Step 4: Review & Edit Details
- Verify all compensation details:
  - Base salary
  - Equity (options or RSUs)
  - Sign-on bonus
  - Start date
  - Title and level

⚠️ **Important:** Ensure **"Enable Signing Page"** is toggled ON

### Step 5: Request Team Messages
- Generate the unique team message link
- Share in the candidate's Slack channel
- Team members can add personal notes/messages
- These appear in the candidate's offer page

### Step 6: Add Competing Offers (Optional)
- If the candidate has other offers
- Input details for visual comparison
- Helps candidate see Luma's competitiveness

### Step 7: Save & Publish
- Review all information one final time
- Click **Save** to save your draft
- Click **Publish** to send the offer live
- The candidate receives the offer link

---

## Tips for Success

- **Double-check equity numbers** — Candidates scrutinize these
- **Set realistic start dates** — Account for background check time
- **Add team messages** — Personal touches increase acceptance rates
- **Monitor engagement** — Complete.so shows when candidates view the offer

---

## Troubleshooting

**Candidate not found in search?**
- Verify the application ID is correct
- Ensure the candidate has been moved to "Offer" stage in Gem

**Offer not sending?**
- Check that "Enable Signing Page" is ON
- Verify candidate email is correct in Gem
`,
    status: "published" as const,
  },

  // ===== NEW HIRE ONBOARDING =====
  {
    title: "New Hire Onboarding Plan Template",
    description: "The 5-day structured onboarding template for new team members.",
    type: "checklist" as const,
    category: "Onboarding",
    tags: ["onboarding", "new-hire", "template", "checklist"],
    body: `# New Hire Onboarding Plan

## Overview
This template provides a structured 5-day onboarding plan for new team members at Luma. Customize as needed for specific roles.

---

## Pre-Start (Before Day 1)

- [ ] Laptop ordered and configured
- [ ] Accounts created (Google, Slack, Notion, Gem)
- [ ] Calendar invites sent for onboarding sessions
- [ ] Welcome email sent with first-day logistics
- [ ] Desk/workspace prepared (if applicable)
- [ ] Buddy assigned and notified

---

## Day 1: Welcome & Orientation

### Morning
- [ ] Welcome meeting with manager
- [ ] IT setup and equipment distribution
- [ ] Security and access credentials
- [ ] Workspace tour (virtual or in-person)

### Afternoon
- [ ] HR paperwork and benefits overview
- [ ] Company overview presentation
- [ ] Introduction to team Slack channels
- [ ] Meet your buddy

### End of Day
- [ ] Debrief with manager
- [ ] Questions and concerns addressed
- [ ] Preview of Day 2

---

## Day 2: Culture & Values

### Morning
- [ ] Deep dive: Our North Star (Mission & Values)
- [ ] Team structure and org chart review
- [ ] Communication norms and tools

### Afternoon
- [ ] Meet key stakeholders (1:1s)
- [ ] Shadow a team meeting
- [ ] Review team goals and OKRs

### End of Day
- [ ] Buddy check-in
- [ ] Reflection: Questions for manager

---

## Day 3: Role Deep-Dive

### Morning
- [ ] Role-specific training begins
- [ ] Review job description and expectations
- [ ] Introduction to key tools and systems

### Afternoon
- [ ] Hands-on practice with core tools
- [ ] Review documentation and knowledge base
- [ ] First small task assignment

### End of Day
- [ ] Progress check with manager
- [ ] Adjust onboarding plan if needed

---

## Day 4: Cross-Functional Exposure

### Morning
- [ ] Meet with cross-functional partners
- [ ] Understand how your role intersects with other teams
- [ ] Review collaboration processes

### Afternoon
- [ ] Continue role-specific training
- [ ] Work on assigned tasks
- [ ] Ask questions freely

### End of Day
- [ ] Buddy sync
- [ ] Document learnings and questions

---

## Day 5: Integration & Feedback

### Morning
- [ ] Complete any outstanding training modules
- [ ] Review first week accomplishments
- [ ] Set 30/60/90 day goals with manager

### Afternoon
- [ ] Team welcome lunch or coffee chat
- [ ] Submit onboarding feedback
- [ ] Finalize tool access and permissions

### End of Day
- [ ] Week 1 retro with manager
- [ ] Celebrate completing onboarding! 🎉
- [ ] Preview of Week 2 and beyond

---

## Post-Onboarding Check-ins

- **Week 2:** Daily standups continue, buddy support
- **Week 4:** 30-day check-in with manager
- **Week 8:** 60-day review
- **Week 12:** 90-day formal review
`,
    status: "published" as const,
  },

  // ===== IMMIGRATION & VISA =====
  {
    title: "Immigration & Visa Process Guide",
    description: "Overview of visa types and immigration processes for international hires.",
    type: "document" as const,
    category: "Immigration",
    tags: ["immigration", "visa", "h1b", "international"],
    body: `# Immigration & Visa Process Guide

## Overview
This guide provides an overview of the visa types we commonly sponsor and the high-level process for each.

---

## Visa Types We Sponsor

### H-1B (Specialty Occupation)
**For:** Roles requiring specialized knowledge and at least a bachelor's degree

**Timeline:**
- Annual lottery (April)
- If selected: ~3-6 months to approval
- Cap-exempt transfers: ~2-4 months

**Key Points:**
- Subject to annual cap (unless cap-exempt)
- Employer-sponsored
- Valid for 3 years, renewable once

### TN (NAFTA Professionals)
**For:** Canadian and Mexican citizens in specific professions

**Timeline:** ~2-4 weeks

**Key Points:**
- No annual cap
- Specific profession list
- Renewable indefinitely

### O-1 (Extraordinary Ability)
**For:** Individuals with extraordinary ability or achievement

**Timeline:** ~3-6 months

**Key Points:**
- No annual cap
- Requires extensive documentation
- High bar for qualification

### L-1 (Intracompany Transfer)
**For:** Transferring employees from related foreign entity

**Timeline:** ~2-4 months

**Key Points:**
- Requires 1 year of employment abroad
- L-1A (managers) or L-1B (specialized knowledge)
- Valid for initial 3 years

---

## General Process Flow

### 1. Identification
- Recruiter identifies visa requirement during screening
- Document visa status in Gem

### 2. Assessment
- Determine appropriate visa category
- Consult with immigration counsel if needed

### 3. Approval
- Obtain internal approvals for sponsorship
- Factor visa timeline into offer and start date

### 4. Filing
- Work with external immigration counsel
- Gather required documentation
- Submit petition

### 5. Monitoring
- Track case status
- Communicate updates to candidate
- Plan for any premium processing needs

---

## Tips for Recruiters

- **Ask early:** Determine work authorization status during recruiter screen
- **Document in Gem:** Note current status and any visa requirements
- **Factor into timeline:** Visa processing can add weeks/months to start date
- **Consult when unsure:** Reach out to People Ops for immigration questions

---

## Resources

- Immigration Counsel: [Contact Info]
- People Ops: [Contact Info]
- USCIS Case Status: [Link]
`,
    status: "published" as const,
  },

  // ===== JOB LEVELING =====
  {
    title: "Job Leveling at Luma AI",
    description: "Understanding our career levels and what's expected at each stage.",
    type: "document" as const,
    category: "Compensation",
    tags: ["leveling", "career", "compensation", "growth"],
    body: `# Job Leveling at Luma AI

## Overview
Our leveling framework provides clarity on expectations, scope, and growth at each career stage.

---

## Individual Contributor Track

### S1 - Support / Entry Level
**Scope:** Learning and executing defined tasks
**Expectations:**
- Complete assigned work with guidance
- Build foundational skills
- Ask questions and seek feedback

### P2 - Professional
**Scope:** Independent contributor on well-defined problems
**Expectations:**
- Complete projects independently
- Deliver quality work consistently
- Begin mentoring newer team members

### P3 - Senior Professional
**Scope:** Owns significant projects or domains
**Expectations:**
- Drive projects end-to-end
- Influence team direction
- Mentor multiple team members
- Demonstrate technical/domain expertise

### P4 - Staff
**Scope:** Cross-team impact, sets standards
**Expectations:**
- Lead complex, multi-team initiatives
- Define best practices
- Significant influence on technical/domain strategy
- Develop talent across teams

### P5 - Principal
**Scope:** Org-wide impact
**Expectations:**
- Shape company-wide strategy
- Industry-recognized expertise
- Solve the hardest problems
- Attract and develop top talent

### P6 - Distinguished
**Scope:** Industry-defining impact
**Expectations:**
- Pioneer new approaches
- External thought leadership
- Shape the field beyond Luma

### P7 - Fellow
**Scope:** Rare, reserved for truly exceptional impact
**Expectations:**
- Generational talent
- Transforms entire domains
- Legendary contributions

---

## Management Track

### M5 - Manager
**Scope:** Manages a team of ICs
**Expectations:**
- Develop and support team members
- Deliver results through the team
- Handle performance management
- Hire and build the team

### M6 - Senior Manager
**Scope:** Manages managers or larger team
**Expectations:**
- Set team strategy
- Develop managers
- Cross-functional leadership
- Significant org impact

### M7 - Director
**Scope:** Leads a function or large org
**Expectations:**
- Drive functional strategy
- Build organizational capability
- Executive-level influence
- Major company impact

### M8 - VP / Executive
**Scope:** Company-wide leadership
**Expectations:**
- Set company direction
- Build and lead executive team
- External representation
- Accountable for major outcomes

---

## Leveling in Recruiting

When assessing candidates:
1. Review the target level in the RAD
2. Evaluate scope of past work
3. Assess independence and influence
4. Consider growth trajectory
5. Calibrate with Hiring Manager

**Remember:** Level = Scope + Impact + Independence
`,
    status: "published" as const,
  },

  // ===== TECH STACK OVERVIEW =====
  {
    title: "Recruiting Tech Stack Overview",
    description: "Our core tools for sourcing, interviewing, and hiring.",
    type: "document" as const,
    category: "Tools",
    tags: ["tools", "tech-stack", "gem", "sourcing"],
    body: `# Recruiting Tech Stack Overview

## Core ATS & CRM: Gem
**What it is:** Our all-in-one recruiting platform for sourcing, CRM, ATS, and analytics.

**Key Uses:**
- Candidate tracking and pipeline management
- Email sequencing and outreach
- Scheduling and calendar management
- Reporting and analytics
- Interview feedback and scorecards

---

## Sourcing Tools

### LinkedIn Recruiter
- Primary sourcing platform
- InMail outreach
- Talent pool building

### Juicebox
- AI-powered sourcing
- Automated candidate discovery
- Integration with Gem

### SeekOut
- Diverse candidate sourcing
- Technical talent discovery
- Deep profile insights

### Gem AI Sourcing
- Built into Gem platform
- AI-powered recommendations
- Sequence automation

---

## Assessment Tools

### CodeSignal
- Technical assessments for engineering
- Standardized coding tests
- Custom PyTorch assessments (Research)

### Metaview
- Interview recording and transcription
- AI-powered interview intelligence
- Scorecard integration

---

## Offer Management

### Complete.so
- Interactive offer letters
- Compensation visualization
- Team messages and personalization
- Competing offer comparison

---

## Collaboration & Communication

### Slack
- Real-time team communication
- Candidate-specific channels
- Integration notifications

### Notion
- Documentation and wikis
- RADs and process docs
- Training materials

### Google Workspace
- Email and calendar
- Document collaboration
- Video interviews (Meet)

---

## Automation

### Zapier
- Workflow automation
- System integrations
- Notification triggers

---

## People Operations

### Rippling
- HRIS and payroll
- Onboarding workflows
- Benefits administration
`,
    status: "published" as const,
  },

  // ===== RAD OVERVIEW =====
  {
    title: "The Recruiter Alignment Document (RAD)",
    description: "What is a RAD and how to use it effectively.",
    type: "document" as const,
    category: "Process",
    tags: ["rad", "intake", "alignment", "hiring-manager"],
    body: `# The Recruiter Alignment Document (RAD)

## What is a RAD?
The Recruiter Alignment Document is our single source of truth for each open role. It captures everything the recruiting team needs to source, screen, and hire the right candidate.

---

## Why We Use RADs

1. **Alignment:** Ensures Recruiter and Hiring Manager are on the same page
2. **Efficiency:** Reduces back-and-forth during the search
3. **Quality:** Consistent evaluation criteria
4. **Speed:** Faster decision-making with clear parameters

---

## RAD Components

### Page 1: Role Definition & Strategy
- Role title and level
- Team and reporting structure
- Priority level (P0-P3)
- Hiring timeline
- Core responsibilities
- Success metrics

### Page 2: Screening & Interviewing
- Must-have qualifications
- Nice-to-have qualifications
- Screening questions
- Interview plan and stages
- Interviewer assignments

### Page 3: Decision & Closing
- Compensation range
- Competing priorities
- Selling points
- Potential objections
- Decision criteria

### Page 4: Sourcing Intelligence
- Target companies
- Target profiles
- Boolean search strings
- Sourcing channels
- Market intelligence

### Page 5: AI Sourcing Optimization
- AI tool recommendations
- Automated outreach sequences
- Personalization guidelines

### Page 6: Engagement & Outreach
- Messaging templates
- Key selling points
- Objection handling
- Follow-up cadence

### Page 7: Appendix
- Related documents
- Interview question bank
- Scorecard templates
- Historical data

---

## RAD Lifecycle

1. **Creation:** Recruiter drafts after intake meeting
2. **Review:** HM reviews and provides feedback
3. **Approval:** HM signs off on final version
4. **Active Use:** Guides all recruiting activities
5. **Updates:** Revised as needed based on learnings
6. **Archive:** Stored for future reference after hire

---

## Tips for Effective RADs

- **Be specific:** Vague requirements = vague candidates
- **Prioritize ruthlessly:** Not everything can be a "must-have"
- **Include examples:** "Like [person] at [company]"
- **Update regularly:** Market feedback should refine criteria
- **Reference often:** Don't let it gather dust

---

## Where to Find RADs
All RADs are stored in Notion under:
\`Process & Candidate Management > Recruiting Alignment Docs - RAD\`
`,
    status: "published" as const,
  },
];

// Learning paths based on Luma's training structure
const seedLearningPaths = [
  {
    title: "New Recruiter Onboarding",
    description: "Essential training for new recruiting team members at Luma.",
    isOnboarding: true,
    order: 1,
    contentTitles: [
      "Our North Star: Luma's Mission & Values",
      "The Recruiting Process Playbook",
      "SLAs & Communication Standards",
      "Recruiting Tech Stack Overview",
      "The Recruiter Alignment Document (RAD)",
    ],
  },
  {
    title: "Interviewer Certification Path",
    description: "Complete this path to become a certified interviewer at Luma.",
    isOnboarding: false,
    order: 2,
    contentTitles: [
      "Interviewer Training 101",
      "Our North Star: Luma's Mission & Values",
    ],
  },
  {
    title: "Closing & Offers Mastery",
    description: "Master the art of extending and closing offers.",
    isOnboarding: false,
    order: 3,
    contentTitles: [
      "The Offer Playbook",
      "Using Complete.so for Interactive Offers",
    ],
  },
  {
    title: "Hiring Manager Essentials",
    description: "Key training for hiring managers working with the recruiting team.",
    isOnboarding: false,
    order: 4,
    contentTitles: [
      "Our North Star: Luma's Mission & Values",
      "Understanding Luma's Hiring Priorities",
      "The Recruiter Alignment Document (RAD)",
      "Job Leveling at Luma AI",
    ],
  },
  {
    title: "Scheduling & Coordination",
    description: "Training for coordinators and scheduling operations.",
    isOnboarding: false,
    order: 5,
    contentTitles: [
      "Scheduling Operations Guide",
      "SLAs & Communication Standards",
      "Recruiting Tech Stack Overview",
    ],
  },
];

export async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Create a system user for authored content
    const [systemUser] = await db
      .insert(users)
      .values({
        email: "system@lumalabs.ai",
        name: "Luma Recruiting",
        role: "admin",
        points: 0,
      })
      .onConflictDoNothing()
      .returning();

    const authorId = systemUser?.id;

    console.log("📝 Seeding content...");

    // Insert all content
    const insertedContent = await Promise.all(
      seedContent.map(async (item) => {
        const [inserted] = await db
          .insert(content)
          .values({
            ...item,
            authorId,
            publishedAt: new Date(),
          })
          .onConflictDoNothing()
          .returning();
        return inserted;
      })
    );

    console.log(`✅ Inserted ${insertedContent.filter(Boolean).length} content items`);

    // Create content title to ID map
    const contentMap = new Map(
      insertedContent
        .filter(Boolean)
        .map((c) => [c.title, c.id])
    );

    console.log("📚 Seeding learning paths...");

    // Insert learning paths
    for (const path of seedLearningPaths) {
      const { contentTitles, ...pathData } = path;

      const [insertedPath] = await db
        .insert(learningPaths)
        .values(pathData)
        .onConflictDoNothing()
        .returning();

      if (insertedPath) {
        // Insert learning path items
        for (let i = 0; i < contentTitles.length; i++) {
          const contentId = contentMap.get(contentTitles[i]);
          if (contentId) {
            await db
              .insert(learningPathItems)
              .values({
                pathId: insertedPath.id,
                contentId,
                order: i + 1,
              })
              .onConflictDoNothing();
          }
        }
      }
    }

    console.log(`✅ Inserted ${seedLearningPaths.length} learning paths`);
    console.log("🎉 Seed completed successfully!");

  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
seed().catch(console.error);
