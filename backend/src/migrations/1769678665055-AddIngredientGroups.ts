import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIngredientGroups1769678665055 implements MigrationInterface {
    name = 'AddIngredientGroups1769678665055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ingredient_groups" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_282ce6ef65c31729329bfb8b438" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1fb7a94f1d74e06adc24697650" ON "ingredient_groups" ("name") `);
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "group_id" integer`);
        await queryRunner.query(`ALTER TABLE "ingredients" ADD CONSTRAINT "FK_08e66d7ea489f5019268efd8c47" FOREIGN KEY ("group_id") REFERENCES "ingredient_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" DROP CONSTRAINT "FK_08e66d7ea489f5019268efd8c47"`);
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "group_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1fb7a94f1d74e06adc24697650"`);
        await queryRunner.query(`DROP TABLE "ingredient_groups"`);
    }

}
