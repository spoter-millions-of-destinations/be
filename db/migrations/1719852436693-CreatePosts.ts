import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePosts1719852436693 implements MigrationInterface {
    name = 'CreatePosts1719852436693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "posts"
            (
                "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "id"          SERIAL            NOT NULL,
                "description" character varying NOT NULL,
                "images"      text array                 DEFAULT '{}',
                "longitude"   integer,
                "latitude"    integer,
                "userId"      integer,
                CONSTRAINT "PK_post_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_post_user_id" FOREIGN KEY ("userId") REFERENCES "users"("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "posts"`);
    }

}
