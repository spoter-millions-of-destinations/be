import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatAttraction1721927702041 implements MigrationInterface {
    name = 'CreatAttraction1721927702041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "attractions" (
                "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "name" character varying,
                "description" character varying,
                "rate" numeric,
                "placeName" character varying,
                "address" character varying,
                "ward" character varying,
                "district" character varying,
                "city" character varying,
                "country" character varying,
                "latitude" numeric,
                "longitude" numeric,
                constraint "PK_attraction_id" primary key ("id")
            );
        `);
        await queryRunner.query(`
            ALTER TABLE "posts" ADD COLUMN "attractionId" integer;
            ALTER TABLE "posts" ADD CONSTRAINT "FK_post_attraction_id" FOREIGN KEY ("attractionId") REFERENCES "attractions" ("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts" DROP COLUMN "attractionId";
        `);
        await queryRunner.query(`
            DROP TABLE "attractions";
        `);
    }

}
