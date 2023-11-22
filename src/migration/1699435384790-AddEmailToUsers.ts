import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailToUsers1699435384790 implements MigrationInterface {
    name = 'AddEmailToUsers1699435384790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`email\` varchar(320) NOT NULL`);
        await queryRunner.query(`UPDATE \`users\` SET \`email\` = \`name\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`name\` varchar(320) NOT NULL`);
        await queryRunner.query(`UPDATE \`users\` SET \`name\` = \`email\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`name\` varchar(255) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NOT NULL`);
        await queryRunner.query(`UPDATE \`users\` SET \`name\` = \`email\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`email\``);
    }

}
