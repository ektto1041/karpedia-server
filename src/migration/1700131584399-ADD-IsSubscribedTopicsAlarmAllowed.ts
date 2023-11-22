import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDIsSubscribedTopicsAlarmAllowed1700131584399 implements MigrationInterface {
    name = 'ADDIsSubscribedTopicsAlarmAllowed1700131584399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isSubscribedTopicsAlarmAllowed\` tinyint NOT NULL`);
        await queryRunner.query(`UPDATE \`users\` SET \`isSubscribedTopicsAlarmAllowed\` = 0`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isSubscribedTopicsAlarmAllowed\``);
    }

}
