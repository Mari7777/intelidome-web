import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Vygenerováno `payload migrate:create`; ručně doplněn jen datový přenos
   `search.meta_*` → `search_locales` (cs) před DROP, aby index hledání
   nepřišel o titulky a popisy do prvního Reindexu (A17, A22). */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_locales" ADD COLUMN "prelozeno" boolean DEFAULT false;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_prelozeno" boolean DEFAULT false;
  ALTER TABLE "posts_locales" ADD COLUMN "prelozeno" boolean DEFAULT false;
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version_prelozeno" boolean DEFAULT false;
  ALTER TABLE "search_locales" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "search_locales" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "search_locales" ADD COLUMN "prelozeno" boolean;
  UPDATE "search_locales" sl
    SET "meta_title" = s."meta_title",
        "meta_description" = s."meta_description",
        "prelozeno" = true
    FROM "search" s
    WHERE sl."_parent_id" = s."id" AND sl."_locale" = 'cs';
  ALTER TABLE "search" DROP COLUMN "meta_title";
  ALTER TABLE "search" DROP COLUMN "meta_description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "search" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "search" ADD COLUMN "meta_description" varchar;
  UPDATE "search" s
    SET "meta_title" = sl."meta_title",
        "meta_description" = sl."meta_description"
    FROM "search_locales" sl
    WHERE sl."_parent_id" = s."id" AND sl."_locale" = 'cs';
  ALTER TABLE "pages_locales" DROP COLUMN "prelozeno";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_prelozeno";
  ALTER TABLE "posts_locales" DROP COLUMN "prelozeno";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_prelozeno";
  ALTER TABLE "search_locales" DROP COLUMN "meta_title";
  ALTER TABLE "search_locales" DROP COLUMN "meta_description";
  ALTER TABLE "search_locales" DROP COLUMN "prelozeno";`)
}
