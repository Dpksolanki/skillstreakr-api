CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"email_verified_at" timestamp with time zone,
	"password_hash" text,
	"name" text,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"daily_goal_minutes" integer DEFAULT 60 NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_length" CHECK (char_length("users"."email") <= 254),
	CONSTRAINT "users_name_length" CHECK (char_length("users"."name") BETWEEN 1 AND 100),
	CONSTRAINT "users_daily_goal_range" CHECK ("users"."daily_goal_minutes" BETWEEN 1 AND 1440),
	CONSTRAINT "users_role_valid" CHECK ("users"."role" IN ('user', 'admin')),
	CONSTRAINT "users_plan_valid" CHECK ("users"."plan" IN ('free', 'pro'))
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"template" text DEFAULT 'general' NOT NULL,
	"color" text,
	"daily_goal_minutes" integer,
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_name_length" CHECK (char_length("skills"."name") BETWEEN 1 AND 60),
	CONSTRAINT "skills_template_valid" CHECK ("skills"."template" IN ('general', 'practice', 'language', 'course', 'project')),
	CONSTRAINT "skills_color_hex" CHECK ("skills"."color" ~ '^#[0-9a-fA-F]{6}$'),
	CONSTRAINT "skills_daily_goal_range" CHECK ("skills"."daily_goal_minutes" BETWEEN 1 AND 1440)
);
--> statement-breakpoint
CREATE TABLE "daily_logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"log_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "log_entries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"daily_log_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"minutes" integer NOT NULL,
	"kind" text DEFAULT 'study' NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "log_entries_minutes_range" CHECK ("log_entries"."minutes" BETWEEN 1 AND 1440),
	CONSTRAINT "log_entries_kind_valid" CHECK ("log_entries"."kind" IN ('study', 'practice', 'revision', 'writing', 'speaking', 'build')),
	CONSTRAINT "log_entries_note_length" CHECK (char_length("log_entries"."note") <= 2000)
);
--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_entries" ADD CONSTRAINT "log_entries_daily_log_id_daily_logs_id_fk" FOREIGN KEY ("daily_log_id") REFERENCES "public"."daily_logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_entries" ADD CONSTRAINT "log_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_entries" ADD CONSTRAINT "log_entries_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_lower_unique" ON "users" USING btree (lower("email"));--> statement-breakpoint
CREATE INDEX "skills_user_id_idx" ON "skills" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "skills_user_name_active_unique" ON "skills" USING btree ("user_id",lower("name")) WHERE "skills"."archived_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "daily_logs_user_date_unique" ON "daily_logs" USING btree ("user_id","log_date");--> statement-breakpoint
CREATE INDEX "log_entries_daily_log_id_idx" ON "log_entries" USING btree ("daily_log_id");--> statement-breakpoint
CREATE INDEX "log_entries_user_id_idx" ON "log_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "log_entries_skill_id_idx" ON "log_entries" USING btree ("skill_id");