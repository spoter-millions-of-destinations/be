import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExtension1720794135032 implements MigrationInterface {
    name = 'AddExtension1720794135032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP EXTENSION postgis;`);
    }

}
