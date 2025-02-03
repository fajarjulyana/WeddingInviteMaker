import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Invitations table schema
export const invitations = sqliteTable("invitations", {
  id: integer("id").primaryKey().autoincrement(),
  slug: text("slug").unique().notNull(),
  brideNames: text("bride_names").notNull(), // Ensure this column is defined
  groomNames: text("groom_names").notNull(),
  date: real("date").notNull(),
  venue: text("venue").notNull(),
  photos: text("photos", { mode: "json" }).notNull(),
  musicUrl: text("music_url"),
  templateId: text("template_id").notNull(),
  createdAt: real("created_at").default(Date.now).notNull(),
  updatedAt: real("updated_at").default(Date.now).notNull(),
});


// Guestbook table schema
export const guestbook = sqliteTable("guestbook", {
  id: integer("id").primaryKey().autoincrement(), // Auto-increment primary key
  invitationId: integer("invitation_id").references(() => invitations.id), // Reference to invitation
  name: text("name").notNull(), // Name of the guest
  message: text("message").notNull(), // Message from the guest
  createdAt: real("created_at").default(Date.now).notNull(), // Created timestamp
});

// Insert and select schemas for validation
export const insertInvitationSchema = createInsertSchema(invitations);
export const selectInvitationSchema = createSelectSchema(invitations);
export const insertGuestbookSchema = createInsertSchema(guestbook);
export const selectGuestbookSchema = createSelectSchema(guestbook);

// TypeScript types for insert and select operations
export type InsertInvitation = typeof invitations.$inferInsert;
export type SelectInvitation = typeof invitations.$inferSelect;
export type InsertGuestbook = typeof guestbook.$inferInsert;
export type SelectGuestbook = typeof guestbook.$inferSelect;

