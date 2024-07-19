import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTypeOfLongitudeAndLatitude1721411801020 implements MigrationInterface {
    name = 'ChangeTypeOfLongitudeAndLatitude1721411801020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" 
            ALTER COLUMN "longitude" TYPE numeric,
            ALTER COLUMN "latitude"   TYPE numeric;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts"
            ALTER COLUMN "longitude" TYPE integer,
            ALTER COLUMN "latitude"  TYPE integer;`);
    }

}
