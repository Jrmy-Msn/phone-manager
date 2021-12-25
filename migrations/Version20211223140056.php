<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211223140056 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE connector (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, head_band_id INTEGER NOT NULL, number INTEGER NOT NULL)');
        $this->addSql('CREATE INDEX IDX_148C456E13638C06 ON connector (head_band_id)');
        $this->addSql('CREATE TABLE distribution_room (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, label VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE TABLE head_band (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, distribution_room_id INTEGER NOT NULL, label VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE INDEX IDX_F4C5B63DB4A63E21 ON head_band (distribution_room_id)');
        $this->addSql('CREATE TABLE phone (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, distribution_id INTEGER DEFAULT NULL, connector_id INTEGER DEFAULT NULL, assigned_to VARCHAR(255) DEFAULT NULL, number INTEGER NOT NULL, reserved BOOLEAN DEFAULT NULL, cluster INTEGER DEFAULT NULL, cluster_channel INTEGER DEFAULT NULL, cluster_card INTEGER DEFAULT NULL, distribution_card INTEGER DEFAULT NULL, distribution_channel INTEGER DEFAULT NULL, type VARCHAR(255) DEFAULT NULL, location VARCHAR(255) DEFAULT NULL, socket VARCHAR(255) DEFAULT NULL)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_444F97DD96901F54 ON phone (number)');
        $this->addSql('CREATE INDEX IDX_444F97DD6EB6DDB5 ON phone (distribution_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_444F97DD4D085745 ON phone (connector_id)');
        $this->addSql('CREATE TABLE "user" (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, username VARCHAR(180) NOT NULL, roles CLOB NOT NULL --(DC2Type:json)
        , password VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649F85E0677 ON "user" (username)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE connector');
        $this->addSql('DROP TABLE distribution_room');
        $this->addSql('DROP TABLE head_band');
        $this->addSql('DROP TABLE phone');
        $this->addSql('DROP TABLE "user"');
    }
}
