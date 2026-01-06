import { relations } from "drizzle-orm";
import {
    boolean,
    decimal,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    unique,
    uuid,
} from "drizzle-orm/pg-core";

// --- Enums ---
export const exchange = pgEnum("exchange", [
    "binance",
    "binanceus",
    "bybit",
    "okx",
    "kraken",
    "coinbase",
]);
export const status = pgEnum("status", ["active", "paused"]);

export const subscriptionStatus = pgEnum("subscription_status", [
    "trialing", // Trial
    "active", // Paying subscription
    "past_due", // Payment failed
    "canceled", // Canceled subscription
    "unpaid", // Payment failed
]);

export const notificationProvider = pgEnum("notification_provider", [
    "telegram",
]);

export const positionStatus = pgEnum("position_status", [
    "filled",
    "failed",
]);

export const signalType = pgEnum("signal_type", ["buy", "sell", "none"]);

export const instanceHealthStatus = pgEnum("instance_health_status", [
    "CHECKING",
    "CONNECTED",
    "NEEDS_ACTION",
    "ERROR",
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

        country: text("country"), // optional country code

        // Stripe linkage
        stripeCustomerId: text("stripe_customer_id").unique(),
        stripeSubscriptionId: text("stripe_subscription_id").unique(),

        billingStatus: subscriptionStatus("subscription_status")
            .default("trialing")
            .notNull(), // billing state
        subscriptionEndsAt: timestamp("subscription_ends_at", {
            withTimezone: true,
        }).notNull(), // Either trial end or billing period end

        // Did they cancel but still have access until period end?
        cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
    },
    (t) => ({
        // helpful indexes
        byClerk: index("user_by_clerk_idx").on(t.clerkId),
        byTrialEnd: index("user_trial_end_idx").on(t.subscriptionEndsAt),
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
        positionSizeUSDT: text("position_size_usdt").notNull(),
        
        isTestnet: boolean("is_testnet").default(false).notNull(),

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

export const UserTelegramNotificationSettingsTable = pgTable(
    "user_telegram_notification_settings",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .unique() // One Telegram account per user
            .references(() => UserTable.id, { onDelete: "cascade" }),
        telegramChatId: text("telegram_chat_id").notNull(),
        telegramUsername: text("telegram_username"),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    }
);

export const NotificationPreferencesTable = pgTable(
    "notification_preferences",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id")
            .references(() => UserTable.id, { onDelete: "cascade" })
            .notNull(),
        providerId: uuid("provider_id").references(
            () => UserTelegramNotificationSettingsTable.id,
            { onDelete: "cascade" }
        ),
        provider: notificationProvider("provider").notNull(),
        instrument: text("instrument").notNull(),
        strategy: text("strategy").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        userIdIdx: index("notification_prefs_user_id_idx").on(table.userId),
        providerIdIdx: index("notification_prefs_provider_id_idx").on(
            table.providerId
        ),

        // Prevent duplicate notifications for same instrument+strategy+provider
        uniqueNotification: unique().on(
            table.userId,
            table.provider,
            table.instrument,
            table.strategy
        ),
    })
);

export const PositionHistoryTable = pgTable(
    "position_history",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        instanceId: uuid("instance_id")
            .notNull()
            .references(() => InstanceTable.id, { onDelete: "cascade" }),
        userId: uuid("user_id")
            .notNull()
            .references(() => UserTable.id, { onDelete: "cascade" }),
        exchange: exchange("exchange").notNull(),
        instrument: text("instrument").notNull(),
        strategyName: text("strategy_name").notNull(),

        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),

        exchangeOrderId: text("exchange_order_id"),
        quantity: decimal("quantity", { precision: 30, scale: 10 }),
        entryPrice: decimal("entry_price", { precision: 30, scale: 10 }),
        exitPrice: decimal("exit_price", { precision: 30, scale: 10 }),
        realizedPnl: decimal("realized_pnl", { precision: 30, scale: 10 }),

        commission: decimal("commission", { precision: 20, scale: 8 }), // Trading fee amount
        commissionAsset: text("commission_asset"), // "BNB", "USDT", etc.

        signalTime: timestamp("signal_time", { withTimezone: true }).notNull(),
        orderPlacedAt: timestamp("order_placed_at", { withTimezone: true }),
        orderFilledAt: timestamp("order_filled_at", { withTimezone: true }),
        positionClosedAt: timestamp("position_closed_at", {
            withTimezone: true,
        }),

        status: positionStatus("status").notNull(),
        errorMessage: text("error_message"),
    },
    (table) => ({
        userIdIdx: index("position_history_user_id_idx").on(table.userId),
        instanceIdIdx: index("position_history_instance_id_idx").on(
            table.instanceId
        ),
        statusIdx: index("position_history_status_idx").on(table.status),
        instrumentIdx: index("position_history_instrument_idx").on(
            table.instrument
        ),
        signalTimeIdx: index("position_history_signal_time_idx").on(
            table.signalTime
        ),
    })
);

export const PositionTrackingTable = pgTable(
    "position_tracking",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => UserTable.id, { onDelete: "cascade" }),
        instanceId: uuid("instance_id")
            .notNull()
            .references(() => InstanceTable.id, { onDelete: "cascade" }),

        status: text("status").notNull(), // "open", "closed"

        // Buy side
        buyOrderId: text("buy_order_id"),
        buyPrice: decimal("buy_price", { precision: 30, scale: 10 }),
        buyQuantity: decimal("buy_quantity", { precision: 30, scale: 10 }),
        buyTime: timestamp("buy_time", { withTimezone: true }),

        // Sell side
        sellOrderId: text("sell_order_id"),
        sellPrice: decimal("sell_price", { precision: 30, scale: 10 }),
        sellTime: timestamp("sell_time", { withTimezone: true }),

        realizedPnl: decimal("realized_pnl", { precision: 30, scale: 10 }),

        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        instanceIdIdx: index("position_tracking_instance_id_idx").on(
            table.instanceId
        ),
        userIdIdx: index("position_tracking_user_id_idx").on(table.userId),
        statusIdx: index("position_tracking_status_idx").on(table.status),
        createdAtIdx: index("position_tracking_created_at_idx").on(
            table.createdAt
        ),
    })
);

export const SignalStateTable = pgTable(
    "signal_state",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        
        // Instrument identification
        instrument: text("instrument").notNull(),
        interval: text("interval").notNull(),
        strategy: text("strategy").notNull(),
        
        // Current signal state
        currentSignal: signalType("current_signal").notNull().default("none"),
        signalFiltered: boolean("signal_filtered").default(false).notNull(),
        filterReason: text("filter_reason"),
        
        // Price levels
        signalPrice: decimal("signal_price", { precision: 30, scale: 10 }),
        flipPrice: decimal("flip_price", { precision: 30, scale: 10 }),
        currentPrice: decimal("current_price", { precision: 30, scale: 10 }),
        supportLevel: decimal("support_level", { precision: 30, scale: 10 }),
        resistanceLevel: decimal("resistance_level", { precision: 30, scale: 10 }),
        
        // ML scores
        pBad: decimal("p_bad", { precision: 10, scale: 6 }),
        predRemaining: decimal("pred_remaining", { precision: 10, scale: 6 }),
        
        // Timestamps
        lastUpdated: timestamp("last_updated", { withTimezone: true })
            .defaultNow()
            .notNull(),
        lastSignalChange: timestamp("last_signal_change", { withTimezone: true }),
        
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        uniqueSignal: unique().on(table.instrument, table.interval, table.strategy),
        instrumentIdx: index("signal_state_instrument_idx").on(table.instrument),
        strategyIdx: index("signal_state_strategy_idx").on(table.strategy),
        signalTypeIdx: index("signal_state_signal_type_idx").on(table.currentSignal),
        lastUpdatedIdx: index("signal_state_last_updated_idx").on(table.lastUpdated),
    })
);

export const InstanceHealthTable = pgTable(
    "instance_health",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        instanceId: uuid("instance_id")
            .notNull()
            .unique()
            .references(() => InstanceTable.id, { onDelete: "cascade" }),

        status: instanceHealthStatus("status").notNull().default("CHECKING"),
        errorCode: text("error_code"),
        
        lastRequestedAt: timestamp("last_requested_at", { withTimezone: true }), // Set by server action
        lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }), // Set by worker when finished
        capabilities: jsonb("capabilities"), // JSON capabilities data

        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        instanceIdIdx: index("instance_health_instance_id_idx").on(table.instanceId),
        statusIdx: index("instance_health_status_idx").on(table.status),
        lastRequestedAtIdx: index("instance_health_last_requested_at_idx").on(
            table.lastRequestedAt
        ),
        lastCheckedAtIdx: index("instance_health_last_checked_at_idx").on(
            table.lastCheckedAt
        ),
    })
);

export const instanceHealthRelations = relations(InstanceHealthTable, ({ one }) => ({
    instance: one(InstanceTable, {
        fields: [InstanceHealthTable.instanceId],
        references: [InstanceTable.id],
    }),
}));
