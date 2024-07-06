import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsers1719857115832 implements MigrationInterface {
    name = 'UpdateUsers1719857115832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "roles" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
    }

}
