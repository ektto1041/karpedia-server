import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubscribeTopics1698912054535 implements MigrationInterface {
    name = 'AddSubscribeTopics1698912054535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users_subscribed_topics_topics\` (\`usersId\` int NOT NULL, \`topicsId\` int NOT NULL, INDEX \`IDX_ee8eeffd49044e6c92763b53bc\` (\`usersId\`), INDEX \`IDX_869a0024c2b44f76291924cc36\` (\`topicsId\`), PRIMARY KEY (\`usersId\`, \`topicsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users_subscribed_topics_topics\` ADD CONSTRAINT \`FK_ee8eeffd49044e6c92763b53bc1\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_subscribed_topics_topics\` ADD CONSTRAINT \`FK_869a0024c2b44f76291924cc369\` FOREIGN KEY (\`topicsId\`) REFERENCES \`topics\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_subscribed_topics_topics\` DROP FOREIGN KEY \`FK_869a0024c2b44f76291924cc369\``);
        await queryRunner.query(`ALTER TABLE \`users_subscribed_topics_topics\` DROP FOREIGN KEY \`FK_ee8eeffd49044e6c92763b53bc1\``);
        await queryRunner.query(`DROP INDEX \`IDX_869a0024c2b44f76291924cc36\` ON \`users_subscribed_topics_topics\``);
        await queryRunner.query(`DROP INDEX \`IDX_ee8eeffd49044e6c92763b53bc\` ON \`users_subscribed_topics_topics\``);
        await queryRunner.query(`DROP TABLE \`users_subscribed_topics_topics\``);
    }

}
