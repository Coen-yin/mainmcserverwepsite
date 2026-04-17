import { pgTable, text, serial, boolean, integer, numeric, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryImagesTable = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  uploadedBy: text("uploaded_by").notNull().default("Admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const rulesTable = pgTable("rules", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull().default("moderate"),
  order: integer("order").notNull().default(0),
});

export const storeItemsTable = pgTable("store_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  category: text("category").notNull().default("rank"),
  featured: boolean("featured").notNull().default(false),
  imageUrl: text("image_url"),
  features: json("features").$type<string[]>().default([]),
});

export const changelogsTable = pgTable("changelogs", {
  id: serial("id").primaryKey(),
  version: text("version").notNull(),
  title: text("title").notNull(),
  changes: json("changes").$type<{ type: string; description: string }[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const voteSitesTable = pgTable("vote_sites", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  reward: text("reward").notNull(),
  cooldownHours: integer("cooldown_hours").notNull().default(24),
});

export const votesTable = pgTable("votes", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").notNull(),
  userId: integer("user_id").notNull(),
  votedAt: timestamp("voted_at").notNull().defaultNow(),
});

export const ticketsTable = pgTable("tickets", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  category: text("category").notNull().default("other"),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"),
  submitterName: text("submitter_name").notNull(),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const playerStatsTable = pgTable("player_stats", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull().unique(),
  kills: integer("kills").notNull().default(0),
  deaths: integer("deaths").notNull().default(0),
  playtime: integer("playtime").notNull().default(0),
  votes: integer("votes").notNull().default(0),
  money: integer("money").notNull().default(0),
});

export const insertGalleryImageSchema = createInsertSchema(galleryImagesTable).omit({ id: true });
export const insertRuleSchema = createInsertSchema(rulesTable).omit({ id: true });
export const insertStoreItemSchema = createInsertSchema(storeItemsTable).omit({ id: true });
export const insertChangelogSchema = createInsertSchema(changelogsTable).omit({ id: true });
export const insertVoteSiteSchema = createInsertSchema(voteSitesTable).omit({ id: true });
export const insertVoteSchema = createInsertSchema(votesTable).omit({ id: true });
export const insertTicketSchema = createInsertSchema(ticketsTable).omit({ id: true });
export const insertPlayerStatSchema = createInsertSchema(playerStatsTable).omit({ id: true });

export type GalleryImage = typeof galleryImagesTable.$inferSelect;
export type Rule = typeof rulesTable.$inferSelect;
export type StoreItem = typeof storeItemsTable.$inferSelect;
export type Changelog = typeof changelogsTable.$inferSelect;
export type VoteSite = typeof voteSitesTable.$inferSelect;
export type Vote = typeof votesTable.$inferSelect;
export type Ticket = typeof ticketsTable.$inferSelect;
export type PlayerStat = typeof playerStatsTable.$inferSelect;
