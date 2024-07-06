import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFavorites1720001853624 implements MigrationInterface {
    name = 'CreateFavorites1720001853624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "favorites"
            (
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "id"        SERIAL    NOT NULL,
                "userId"    integer   NOT NULL,
                "postId"    integer   NOT NULL,
                CONSTRAINT "PK_favorite_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_favorite_user_id" FOREIGN KEY ("userId") REFERENCES "users" ("id"),
                CONSTRAINT "FK_favorite_post_id" FOREIGN KEY ("postId") REFERENCES "posts" ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "favorites"`);
    }

}
