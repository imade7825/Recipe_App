import { MigrationInterface, QueryRunner } from "typeorm";

export class InitRecipeModel1767715058971 implements MigrationInterface {
    name = 'InitRecipeModel1767715058971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ingredients" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a955029b22ff66ae9fef2e161f" ON "ingredients" ("name") `);
        await queryRunner.query(`CREATE TABLE "recipe_ingredients" ("id" SERIAL NOT NULL, "recipe_id" integer NOT NULL, "ingredient_id" integer NOT NULL, "quantity" character varying(50), "unit" character varying(50), CONSTRAINT "UQ_90484480b3b2978068565ae2a2f" UNIQUE ("recipe_id", "ingredient_id"), CONSTRAINT "PK_8f15a314e55970414fc92ffb532" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8b0be371d28245da6e4f4b6187" ON "categories" ("name") `);
        await queryRunner.query(`CREATE TABLE "recipes" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" text, "instructions" text NOT NULL, "durationMinutes" integer NOT NULL, "imageUrl" character varying(2084), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8f09680a51bf3669c1598a21682" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe_categories" ("recipe_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_884e99b8acb3b0cbcdb4c584b92" PRIMARY KEY ("recipe_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bc02c647e75da3c57a2d22903d" ON "recipe_categories" ("recipe_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0849dba2a4b41b34c64fbc5df5" ON "recipe_categories" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "FK_f240137e0e13bed80bdf64fed53" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "FK_133545365243061dc2c55dc1373" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_categories" ADD CONSTRAINT "FK_bc02c647e75da3c57a2d22903db" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "recipe_categories" ADD CONSTRAINT "FK_0849dba2a4b41b34c64fbc5df5e" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe_categories" DROP CONSTRAINT "FK_0849dba2a4b41b34c64fbc5df5e"`);
        await queryRunner.query(`ALTER TABLE "recipe_categories" DROP CONSTRAINT "FK_bc02c647e75da3c57a2d22903db"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "FK_133545365243061dc2c55dc1373"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "FK_f240137e0e13bed80bdf64fed53"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0849dba2a4b41b34c64fbc5df5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc02c647e75da3c57a2d22903d"`);
        await queryRunner.query(`DROP TABLE "recipe_categories"`);
        await queryRunner.query(`DROP TABLE "recipes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b0be371d28245da6e4f4b6187"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "recipe_ingredients"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a955029b22ff66ae9fef2e161f"`);
        await queryRunner.query(`DROP TABLE "ingredients"`);
    }

}
