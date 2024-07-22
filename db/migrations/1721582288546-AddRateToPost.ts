import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRateToPost1721582288546 implements MigrationInterface {
    name = 'AddRateToPost1721582288546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "rate" integer DEFAULT '5'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "rate"`);
    }

}
