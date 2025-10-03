import { relations } from "drizzle-orm";
import { boolean, index, integer, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

// --- Enums ---
export const userRole = pgEnum("user_role", ["user", "admin"]);
export const plan = pgEnum("plan", ["free", "pro"]);
export const exchange = pgEnum("exchange", [
    "binance", "binanceus", "bybit", "okx", "kraken", "coinbase"
]);
export const status = pgEnum("status", ["active", "paused"]);


export const UserTable = pgTable("user", {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkId: text("clerk_id").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),

    email: text("email").notNull().unique(),
    name: text("name").notNull(),

    numberOfInstances: integer("number_of_instances").default(0),
    role: userRole("role").default("user").notNull(),
    plan: plan("plan").default("free").notNull(),
    notifyEmail: text("notify_email"),

    timezone: text("timezone").default("UTC").notNull(),

    status: status("status").default("active").notNull(),
});

export const InstanceTable = pgTable("instance", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => UserTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),

    name: text("name").notNull(),
    numberOfTrades: integer("number_of_trades").default(0),
    exchange: exchange("exchange").notNull(),
    instrument: text("instrument").notNull(),
    strategy: text("strategy").notNull(),

    status: status("status").default("active").notNull(),
},

    (table) => ({
        userIdIndex: index("user_id_index").on(table.userId),
        strategyAndInstrumentIndex: index("strategy_and_instrument_index").on(table.strategy, table.instrument),
    }));


// Join table
export const userInstances = pgTable(
    "user_instances",
    {
        userId: uuid("user_id").notNull().references(() => UserTable.id, { onDelete: "cascade" }),
        instanceId: uuid("instance_id").notNull().references(() => InstanceTable.id, { onDelete: "cascade" }),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.userId, t.instanceId] }), // or a separate id + unique index
    })
);


// Users -> join rows
export const usersRelations = relations(UserTable, ({ many }) => ({
    userInstances: many(userInstances),
}));

// Instances -> join rows
export const instancesRelations = relations(InstanceTable, ({ many }) => ({
    userInstances: many(userInstances),
}));

// Join row -> both parents
export const userInstancesRelations = relations(userInstances, ({ one }) => ({
    user: one(UserTable, { fields: [userInstances.userId], references: [UserTable.id] }),
    instance: one(InstanceTable, { fields: [userInstances.instanceId], references: [InstanceTable.id] }),
}));


export const userCredentials = pgTable("user_credentials", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => UserTable.id, { onDelete: "cascade" }),

    exchange: exchange("exchange").notNull(),

    encKey: text("enc_key").notNull(),       // ciphertext for API key
    encSecret: text("enc_secret").notNull(), // ciphertext for API secret
    encPassphrase: text("enc_passphrase"),   // some exchanges need it
    encMeta: text("enc_meta"),               // JSON: { iv, tag, kdf, ver }


    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const usersCredentialsRelations = relations(UserTable, ({ many }) => ({
    credentials: many(userCredentials),
}));