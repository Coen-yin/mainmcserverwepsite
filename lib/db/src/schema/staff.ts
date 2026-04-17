import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const staffApplicationsTable = pgTable("staff_applications", {
  id: serial("id").primaryKey(),
  applicantName: text("applicant_name").notNull(),
  position: text("position").notNull(),
  age: integer("age").notNull(),
  experience: text("experience").notNull(),
  whyJoin: text("why_join").notNull(),
  availability: text("availability"),
  status: text("status").notNull().default("pending"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertStaffApplicationSchema = createInsertSchema(staffApplicationsTable).omit({ id: true });
export type InsertStaffApplication = z.infer<typeof insertStaffApplicationSchema>;
export type StaffApplication = typeof staffApplicationsTable.$inferSelect;
