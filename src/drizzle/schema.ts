import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

// --- Enums ---
export const userRole = pgEnum("user_role", ["user", "admin"]);
export const plan = pgEnum("plan", ["free", "pro"]);
export const exchange = pgEnum("exchange", [
    "binance",
    "binanceus",
    "bybit",
    "okx",
    "kraken",
    "coinbase",
]);
export const status = pgEnum("status", ["active", "paused"]);
export const billingStatus = pgEnum("billing_status", [
    "none", // no Stripe linkage yet
    "trialing", // in free trial window
    "active", // paying and current
    "past_due", // payment failed / grace
    "canceled", // canceled sub
]);

export const UserTable = pgTable(
    "user",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        // Clerk linkage
        clerkId: text("clerk_id").notNull().unique(),

        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),

        // Identity
        email: text("email").notNull().unique(),
        name: text("name").notNull(),

        // Ops / analytics
        numberOfInstances: integer("number_of_instances").default(0),

        // App entitlements
        plan: plan("plan").default("free").notNull(), // feature tier
        billingStatus: billingStatus("billing_status")
            .default("trialing")
            .notNull(), // billing state
        trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }), // set on create: createdAt + 6 months

        // Stripe linkage (later)
        subscriptionId: text("subscription_id"), // Stripe subscription id (nullable until they pay)

        // Misc prefs
        notifyEmail: text("notify_email"), // you chose text
        timezone: text("timezone").default("UTC").notNull(),

        // Account state inside app
        status: status("status").default("active").notNull(),
    },
    (t) => ({
        // helpful indexes
        byClerk: index("user_by_clerk_idx").on(t.clerkId),
        byTrialEnd: index("user_trial_end_idx").on(t.trialEndsAt),
        byBillingStatus: index("user_billing_status_idx").on(t.billingStatus),
    })
);

export const InstanceTable = pgTable(
    "instance",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => UserTable.id),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),

        name: text("name").notNull(),
        numberOfTrades: integer("number_of_trades").default(0),
        exchange: exchange("exchange").notNull(),
        instrument: text("instrument").notNull(),
        strategy: text("strategy").notNull(),

        status: status("status").default("active").notNull(),
    },

    (table) => ({
        userIdIndex: index("user_id_index").on(table.userId),
        strategyAndInstrumentIndex: index("strategy_and_instrument_index").on(
            table.strategy,
            table.instrument
        ),
    })
);

export const userRelations = relations(UserTable, ({ many }) => ({
    instances: many(InstanceTable),
}));

export const instanceRelations = relations(InstanceTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [InstanceTable.userId],
        references: [UserTable.id],
    }),
}));

export const userCredentials = pgTable("user_credentials", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => UserTable.id, { onDelete: "cascade" }),

    exchange: exchange("exchange").notNull(),

    encKey: text("enc_key").notNull(), // ciphertext for API key
    encSecret: text("enc_secret").notNull(), // ciphertext for API secret
    encPassphrase: text("enc_passphrase"), // some exchanges need it
    encMeta: text("enc_meta"), // JSON: { iv, tag, kdf, ver }

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const usersCredentialsRelations = relations(UserTable, ({ many }) => ({
    credentials: many(userCredentials),
}));

interface UserNotificationSettings {
    userId: string; // FK to users table
    telegramChatId?: string;
    telegramUsername?: string;
    enabled: boolean;
    preferences: {
        instrument1: boolean;
        instrument2: boolean;
        instrument3: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}

export const UserTelegramNotificationSettingsTable = pgTable(
    "user_telegram_notification_settings",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => UserTable.id, { onDelete: "cascade" }),
        telegramChatId: text("telegram_chat_id"),
        telegramUsername: text("telegram_username"),
        instrument: text("instrument"),
        strategy: text("strategy"),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        userIdIndex: index("telegram_notifications_user_id_idx").on(
            table.userId
        ),
        instrumentIndex: index("telegram_notifications_instrument_idx").on(
            table.instrument
        ),
        strategyIndex: index("telegram_notifications_strategy_idx").on(
            table.strategy
        ),
    })
);
