import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdvertisingPackage1722050938421 implements MigrationInterface {
    name = 'CreateAdvertisingPackage1722050938421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "advertising_packages" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "price" integer NOT NULL,
                "description" character varying,
                "image" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_advertising_package_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "attractions" ADD COLUMN "advertisingPackageId" integer
        `);

        await queryRunner.query(`
            ALTER TABLE "attractions" ADD CONSTRAINT "FK_attraction_advertising_package_id" FOREIGN KEY ("advertisingPackageId") REFERENCES "advertising_packages"("id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attractions" DROP CONSTRAINT "FK_attraction_advertising_package_id"`);
        await queryRunner.query(`ALTER TABLE "attractions" DROP COLUMN "advertisingPackageId"`);
        await queryRunner.query(`DROP TABLE "advertising_packages"`);
    }

}
