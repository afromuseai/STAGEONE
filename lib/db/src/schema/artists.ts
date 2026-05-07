import { pgTable, uuid, text, jsonb, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./auth";

export const artists = pgTable("artists", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).unique(),
  email: text("email"),
  artistName: text("artist_name"),
  genre: text("genre"),
  secondaryGenre: text("secondary_genre"),
  styleTags: jsonb("style_tags").$type<string[]>().default([]),
  audienceProfile: text("audience_profile"),
  preferences: jsonb("preferences").$type<Record<string, unknown>>().default({}),
  onboardingComplete: boolean("onboarding_complete").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const artistDna = pgTable("artist_dna", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  artistId: uuid("artist_id").references(() => artists.id, { onDelete: "cascade" }),
  tone: text("tone"),
  visualStyle: text("visual_style"),
  hookStyle: text("hook_style"),
  audienceType: text("audience_type"),
  identitySummary: text("identity_summary"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rollouts = pgTable("rollouts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  artistId: uuid("artist_id").references(() => artists.id, { onDelete: "cascade" }),
  songTitle: text("song_title"),
  genre: text("genre"),
  mood: text("mood"),
  rolloutTimeline: jsonb("rollout_timeline"),
  hooks: jsonb("hooks"),
  visualDirection: jsonb("visual_direction"),
  audienceStrategy: jsonb("audience_strategy"),
  launchScore: jsonb("launch_score"),
  strategicInsight: text("strategic_insight"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const campaignShares = pgTable("campaign_shares", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  rolloutId: uuid("rollout_id").references(() => rollouts.id, { onDelete: "cascade" }),
  platform: text("platform"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = typeof artists.$inferInsert;
export type ArtistDna = typeof artistDna.$inferSelect;
export type InsertArtistDna = typeof artistDna.$inferInsert;
export type Rollout = typeof rollouts.$inferSelect;
export type InsertRollout = typeof rollouts.$inferInsert;
