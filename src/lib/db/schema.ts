import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  primaryKey,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  emailVerified: timestamp("email_verified"),
  role: text("role", { enum: ["admin", "user"] }).default("user").notNull(),
  bio: text("bio"),
  expertise: jsonb("expertise").$type<string[]>().default([]),
  points: integer("points").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Content items (training materials, docs, videos, etc.)
export const content = pgTable("content", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type", { enum: ["document", "video", "checklist", "wizard", "playbook"] }).notNull(),
  body: text("body"), // Markdown content
  videoUrl: text("video_url"), // For embedded videos
  tags: jsonb("tags").$type<string[]>().default([]),
  category: text("category"),
  status: text("status", { enum: ["draft", "pending", "published"] }).default("draft").notNull(),
  authorId: uuid("author_id").references(() => users.id),
  version: integer("version").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
});

// Learning paths
export const learningPaths = pgTable("learning_paths", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  isOnboarding: boolean("is_onboarding").default(false).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Learning path items (ordered content in a path)
export const learningPathItems = pgTable("learning_path_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  pathId: uuid("path_id").references(() => learningPaths.id).notNull(),
  contentId: uuid("content_id").references(() => content.id).notNull(),
  order: integer("order").default(0).notNull(),
});

// User progress on content
export const contentProgress = pgTable("content_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  contentId: uuid("content_id").references(() => content.id).notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  checklistState: jsonb("checklist_state").$type<Record<string, boolean>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Questions (Q&A system)
export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  resolved: boolean("resolved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Answers
export const answers = pgTable("answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id").references(() => questions.id).notNull(),
  body: text("body").notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  isAccepted: boolean("is_accepted").default(false).notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content requests
export const contentRequests = pgTable("content_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  requesterId: uuid("requester_id").references(() => users.id).notNull(),
  status: text("status", { enum: ["open", "in_progress", "completed", "declined"] }).default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Point transactions (for gamification audit trail)
export const pointTransactions = pgTable("point_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  referenceType: text("reference_type"), // "content", "question", "answer"
  referenceId: uuid("reference_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Kudos (peer recognition)
export const kudos = pgTable("kudos", {
  id: uuid("id").primaryKey().defaultRandom(),
  fromUserId: uuid("from_user_id").references(() => users.id).notNull(),
  toUserId: uuid("to_user_id").references(() => users.id).notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Recertification requirements
export const recertifications = pgTable("recertifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  contentId: uuid("content_id").references(() => content.id).notNull(),
  requiredBy: timestamp("required_by"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// NextAuth accounts
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

// NextAuth sessions
export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  expires: timestamp("expires").notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  content: many(content),
  progress: many(contentProgress),
  questions: many(questions),
  answers: many(answers),
  pointTransactions: many(pointTransactions),
  kudosGiven: many(kudos, { relationName: "kudosGiven" }),
  kudosReceived: many(kudos, { relationName: "kudosReceived" }),
}));

export const contentRelations = relations(content, ({ one, many }) => ({
  author: one(users, {
    fields: [content.authorId],
    references: [users.id],
  }),
  progress: many(contentProgress),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  author: one(users, {
    fields: [questions.authorId],
    references: [users.id],
  }),
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
  author: one(users, {
    fields: [answers.authorId],
    references: [users.id],
  }),
}));
