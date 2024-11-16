import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  uuid,
  pgEnum,
  varchar,
  json,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm/relations";
export type Votes = { [key: string]: { round: number; vote: 0 } }
export const gameStatusEnum = pgEnum("gamestatus", [
  "pending",
  "ongoing",
  "ended"
]);

export const playerStatusEnum = pgEnum("playerstatus", [
  "active",
  "idle",
  "winner"
]);

export const rooms = pgTable("rooms", {
  id: varchar("id")
    .$default(() => nanoid(6))
    .primaryKey(),
  gameStatus: gameStatusEnum("game_status").notNull().default("pending"),
  currentRound: integer("current_round").notNull().default(1),
  winnerId: text("winner_id"),
  prizePool: integer("prize_pool").notNull().default(0),
  currentCapitalHolderId: text("current_capital_holder_id"),
  createdAt: timestamp("created_at").defaultNow(),
  votes: json("votes").$type<Votes>().default({}),

  updatedAt: timestamp("updated_at").defaultNow(),
});

export const players = pgTable("players", {
  id: text("id").primaryKey(),
  roomId: varchar("room_id").references(() => rooms.id),
  name: text("name").notNull(),
  playerStatus: playerStatusEnum("player_status").notNull().default("idle"),
  hasCapital: boolean("has_capital").default(false),
  walletAddress: text("wallet_address"),
  eliminatedInRound: integer("eliminated_in_round"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rounds = pgTable("rounds", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: varchar("room_id").references(() => rooms.id),
  roundNumber: integer("round_number").notNull(),
  capitalHolderId: text("capital_holder_id").references(() => players.id),
  eliminatedPlayerId: text("eliminated_player_id").references(() => players.id),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const roomsRelations = relations(rooms, ({ many, one }) => ({
  players: many(players),
  rounds: many(rounds),
  winner: one(players, {
    fields: [rooms.winnerId],
    references: [players.id],
  }),
  currentCapitalHolder: one(players, {
    fields: [rooms.currentCapitalHolderId],
    references: [players.id],
  }),
}));

export const playersRelations = relations(players, ({ one }) => ({
  room: one(rooms, {
    fields: [players.roomId],
    references: [rooms.id],
  }),
}));

export const roundsRelations = relations(rounds, ({ one }) => ({
  room: one(rooms, {
    fields: [rounds.roomId],
    references: [rooms.id],
  }),
  capitalHolder: one(players, {
    fields: [rounds.capitalHolderId],
    references: [players.id],
  }),
  eliminatedPlayer: one(players, {
    fields: [rounds.eliminatedPlayerId],
    references: [players.id],
  }),
}));
