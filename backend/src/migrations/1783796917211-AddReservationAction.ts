import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReservationAction1783796917211 implements MigrationInterface {
    name = 'AddReservationAction1783796917211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."reservations_action_enum" AS ENUM('RESERVE', 'CANCEL')`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "action" "public"."reservations_action_enum" NOT NULL DEFAULT 'RESERVE'`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "action"`);
        await queryRunner.query(`DROP TYPE "public"."reservations_action_enum"`);
    }

}
