import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1658910111727 implements MigrationInterface {
    name = 'CreateUsers1658910111727';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "password" character varying NOT NULL,
                "username" character varying(200) NOT NULL,
                "email" character varying(200) NOT NULL,
                "phoneNumber" character varying(20),
                "isLocked" int,
                "createdAt" TIMESTAMP DEFAULT now(),
                "updatedAt" TIMESTAMP DEFAULT now(),
                CONSTRAINT "username" UNIQUE ("username"),
                CONSTRAINT "email" UNIQUE ("email"),
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
            )`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
