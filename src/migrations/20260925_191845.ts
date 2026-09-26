import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."_locales" ADD VALUE 'hu';
  ALTER TYPE "public"."_locales" ADD VALUE 'pl';
  ALTER TYPE "public"."_locales" ADD VALUE 'es';
  ALTER TYPE "public"."_locales" ADD VALUE 'it';
  ALTER TYPE "public"."enum__pages_v_published_locale" ADD VALUE 'hu';
  ALTER TYPE "public"."enum__pages_v_published_locale" ADD VALUE 'pl';
  ALTER TYPE "public"."enum__pages_v_published_locale" ADD VALUE 'es';
  ALTER TYPE "public"."enum__pages_v_published_locale" ADD VALUE 'it';
  ALTER TYPE "public"."enum__posts_v_published_locale" ADD VALUE 'hu';
  ALTER TYPE "public"."enum__posts_v_published_locale" ADD VALUE 'pl';
  ALTER TYPE "public"."enum__posts_v_published_locale" ADD VALUE 'es';
  ALTER TYPE "public"."enum__posts_v_published_locale" ADD VALUE 'it';
  ALTER TABLE "media" ADD COLUMN "portrait_id" integer;
  ALTER TABLE "media" ADD COLUMN "focal_portrait_x" numeric;
  ALTER TABLE "media" ADD COLUMN "focal_portrait_y" numeric;
  ALTER TABLE "media" ADD CONSTRAINT "media_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_portrait_idx" ON "media" USING btree ("portrait_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP CONSTRAINT "media_portrait_id_media_id_fk";

  ALTER TABLE "pages_hero_links_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_content" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_form_block" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "pages_rels" ALTER COLUMN "locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_version_hero_links_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_content" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_form_block" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_rels" ALTER COLUMN "locale" SET DATA TYPE text;
  ALTER TABLE "posts_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_posts_v_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "media_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "categories_breadcrumbs" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "categories_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "forms_blocks_checkbox_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "forms_blocks_country_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "forms_blocks_email_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "forms_blocks_message_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "forms_blocks_number_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "forms_blocks_select_options_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "forms_blocks_select_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "forms_blocks_state_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "forms_blocks_text_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "forms_blocks_textarea_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "forms_emails_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "forms_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "search_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "header_nav_items_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "footer_nav_items_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  DROP TYPE "public"."_locales";
  CREATE TYPE "public"."_locales" AS ENUM('cs', 'en', 'de');
  ALTER TABLE "pages_hero_links_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_content" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_media_block" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_blocks_form_block" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "pages_rels" ALTER COLUMN "locale" SET DATA TYPE "public"."_locales" USING "locale"::"public"."_locales";
  ALTER TABLE "_pages_v_version_hero_links_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_content" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_media_block" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_blocks_form_block" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v_rels" ALTER COLUMN "locale" SET DATA TYPE "public"."_locales" USING "locale"::"public"."_locales";
  ALTER TABLE "posts_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_posts_v_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "media_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "categories_breadcrumbs" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "categories_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "forms_blocks_checkbox_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "forms_blocks_country_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "forms_blocks_email_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "forms_blocks_message_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "forms_blocks_number_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "forms_blocks_select_options_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "forms_blocks_select_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "forms_blocks_state_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "forms_blocks_text_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "forms_blocks_textarea_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "forms_emails_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "forms_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "search_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "header_nav_items_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "footer_nav_items_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_pages_v" ALTER COLUMN "published_locale" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_published_locale";
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('cs', 'en', 'de');
  ALTER TABLE "_pages_v" ALTER COLUMN "published_locale" SET DATA TYPE "public"."enum__pages_v_published_locale" USING "published_locale"::"public"."enum__pages_v_published_locale";
  ALTER TABLE "_posts_v" ALTER COLUMN "published_locale" SET DATA TYPE text;
  DROP TYPE "public"."enum__posts_v_published_locale";
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('cs', 'en', 'de');
  ALTER TABLE "_posts_v" ALTER COLUMN "published_locale" SET DATA TYPE "public"."enum__posts_v_published_locale" USING "published_locale"::"public"."enum__posts_v_published_locale";
  DROP INDEX "media_portrait_idx";
  ALTER TABLE "media" DROP COLUMN "portrait_id";
  ALTER TABLE "media" DROP COLUMN "focal_portrait_x";
  ALTER TABLE "media" DROP COLUMN "focal_portrait_y";`)
}
