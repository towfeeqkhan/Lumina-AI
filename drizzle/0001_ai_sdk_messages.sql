ALTER TABLE "chats" ALTER COLUMN "title" SET DEFAULT 'New Chat';--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "parts" jsonb;--> statement-breakpoint
UPDATE "messages" SET "parts" = jsonb_build_array(jsonb_build_object('type', 'text', 'text', "content"));--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "parts" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
CREATE INDEX "chats_user_id_idx" ON "chats" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "messages_chat_id_idx" ON "messages" USING btree ("chat_id");--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "content";