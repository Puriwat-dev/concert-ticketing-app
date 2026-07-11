import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntity1783772692860 implements MigrationInterface {
    name = 'UpdateUserEntity1783772692860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "fullName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullName"`);
    }

}
