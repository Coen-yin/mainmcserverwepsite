import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bansTable = pgTable("bans", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  reason: text("reason").notNull(),
  bannedBy: text("banned_by").notNull().default("Admin"),
  duration: text("duration"),
  expiresAt: timestamp("expires_at"),
  isPermanent: boolean("is_permanent").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const appealsTable = pgTable("appeals", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  reason: text("reason").notNull(),
  explanation: text("explanation").notNull(),
  status: text("status").notNull().default("pending"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBanSchema = createInsertSchema(bansTable).omit({ id: true });
export const insertAppealSchema = createInsertSchema(appealsTable).omit({ id: true });

export type InsertBan = z.infer<typeof insertBanSchema>;
export type Ban = typeof bansTable.$inferSelect;
export type InsertAppeal = z.infer<typeof insertAppealSchema>;
export type Appeal = typeof appealsTable.$inferSelect;
