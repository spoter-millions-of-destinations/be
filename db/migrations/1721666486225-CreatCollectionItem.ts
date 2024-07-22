import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatCollectionItem1721666486225 implements MigrationInterface {
    name = 'CreatCollectionItem1721666486225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "collection_items" (
                "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "updatedAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "collectionId" integer,
                "postId" integer,
                CONSTRAINT "PK_collection_item_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_collection_item_collection_id" FOREIGN KEY ("collectionId") REFERENCES "collections"("id"),
                CONSTRAINT "FK_collection_item_post_id" FOREIGN KEY ("postId") REFERENCES "posts"("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "collection_items"`);
    }

}
