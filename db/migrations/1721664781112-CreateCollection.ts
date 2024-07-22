import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCollection1721664781112 implements MigrationInterface {
    name = 'CreateCollection1721664781112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "collections" (
                "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "image" character varying,
                "description" character varying,
                "userId" integer,
                CONSTRAINT "PK_collection_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_collection_user_id" FOREIGN KEY ("userId") REFERENCES "users"("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "collections"`);
    }

}
