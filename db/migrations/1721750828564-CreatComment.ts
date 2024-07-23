import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatComment1721750828564 implements MigrationInterface {
    name = 'CreatComment1721750828564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "comments" (
                "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "content" character varying NOT NULL,
                "postId" integer,
                "userId" integer,
                CONSTRAINT "PK_comment_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_comment_post_id" FOREIGN KEY ("postId") REFERENCES "posts"("id"),
                CONSTRAINT "FK_comment_user_id" FOREIGN KEY ("userId") REFERENCES "users"("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "comments"`);
    }
}
