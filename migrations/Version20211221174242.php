<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211221174242 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX IDX_148C456E13638C06');
        $this->addSql('CREATE TEMPORARY TABLE __temp__connector AS SELECT id, head_band_id, number FROM connector');
        $this->addSql('DROP TABLE connector');
        $this->addSql('CREATE TABLE connector (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, head_band_id INTEGER NOT NULL, number INTEGER NOT NULL, CONSTRAINT FK_148C456E13638C06 FOREIGN KEY (head_band_id) REFERENCES head_band (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO connector (id, head_band_id, number) SELECT id, head_band_id, number FROM __temp__connector');
        $this->addSql('DROP TABLE __temp__connector');
        $this->addSql('CREATE INDEX IDX_148C456E13638C06 ON connector (head_band_id)');
        $this->addSql('DROP INDEX IDX_F4C5B63DB4A63E21');
        $this->addSql('CREATE TEMPORARY TABLE __temp__head_band AS SELECT id, distribution_room_id, label FROM head_band');
        $this->addSql('DROP TABLE head_band');
        $this->addSql('CREATE TABLE head_band (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, distribution_room_id INTEGER NOT NULL, label VARCHAR(255) NOT NULL COLLATE BINARY, CONSTRAINT FK_F4C5B63DB4A63E21 FOREIGN KEY (distribution_room_id) REFERENCES distribution_room (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO head_band (id, distribution_room_id, label) SELECT id, distribution_room_id, label FROM __temp__head_band');
        $this->addSql('DROP TABLE __temp__head_band');
        $this->addSql('CREATE INDEX IDX_F4C5B63DB4A63E21 ON head_band (distribution_room_id)');
        $this->addSql('DROP INDEX UNIQ_444F97DD4D085745');
        $this->addSql('CREATE TEMPORARY TABLE __temp__phone AS SELECT id, connector_id, assigned_to, number, reserved, cluster, cluster_channel, cluster_card, distribution, distribution_card, distribution_channel, type, location, socket FROM phone');
        $this->addSql('DROP TABLE phone');
        $this->addSql('CREATE TABLE phone (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, connector_id INTEGER DEFAULT NULL, assigned_to VARCHAR(255) DEFAULT NULL COLLATE BINARY, number INTEGER NOT NULL, reserved BOOLEAN DEFAULT NULL, cluster INTEGER DEFAULT NULL, cluster_channel INTEGER DEFAULT NULL, cluster_card INTEGER DEFAULT NULL, distribution VARCHAR(255) DEFAULT NULL COLLATE BINARY, distribution_card INTEGER DEFAULT NULL, distribution_channel INTEGER DEFAULT NULL, type VARCHAR(255) DEFAULT NULL COLLATE BINARY, location VARCHAR(255) DEFAULT NULL COLLATE BINARY, socket VARCHAR(255) DEFAULT NULL COLLATE BINARY, CONSTRAINT FK_444F97DD4D085745 FOREIGN KEY (connector_id) REFERENCES connector (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO phone (id, connector_id, assigned_to, number, reserved, cluster, cluster_channel, cluster_card, distribution, distribution_card, distribution_channel, type, location, socket) SELECT id, connector_id, assigned_to, number, reserved, cluster, cluster_channel, cluster_card, distribution, distribution_card, distribution_channel, type, location, socket FROM __temp__phone');
        $this->addSql('DROP TABLE __temp__phone');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_444F97DD4D085745 ON phone (connector_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_444F97DD96901F54 ON phone (number)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX IDX_148C456E13638C06');
        $this->addSql('CREATE TEMPORARY TABLE __temp__connector AS SELECT id, head_band_id, number FROM connector');
        $this->addSql('DROP TABLE connector');
        $this->addSql('CREATE TABLE connector (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, head_band_id INTEGER NOT NULL, number INTEGER NOT NULL)');
        $this->addSql('INSERT INTO connector (id, head_band_id, number) SELECT id, head_band_id, number FROM __temp__connector');
        $this->addSql('DROP TABLE __temp__connector');
        $this->addSql('CREATE INDEX IDX_148C456E13638C06 ON connector (head_band_id)');
        $this->addSql('DROP INDEX IDX_F4C5B63DB4A63E21');
        $this->addSql('CREATE TEMPORARY TABLE __temp__head_band AS SELECT id, distribution_room_id, label FROM head_band');
        $this->addSql('DROP TABLE head_band');
        $this->addSql('CREATE TABLE head_band (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, distribution_room_id INTEGER NOT NULL, label VARCHAR(255) NOT NULL)');
        $this->addSql('INSERT INTO head_band (id, distribution_room_id, label) SELECT id, distribution_room_id, label FROM __temp__head_band');
        $this->addSql('DROP TABLE __temp__head_band');
        $this->addSql('CREATE INDEX IDX_F4C5B63DB4A63E21 ON head_band (distribution_room_id)');
        $this->addSql('DROP INDEX UNIQ_444F97DD96901F54');
        $this->addSql('DROP INDEX UNIQ_444F97DD4D085745');
        $this->addSql('CREATE TEMPORARY TABLE __temp__phone AS SELECT id, connector_id, assigned_to, number, reserved, cluster, cluster_channel, cluster_card, distribution, distribution_card, distribution_channel, type, location, socket FROM phone');
        $this->addSql('DROP TABLE phone');
        $this->addSql('CREATE TABLE phone (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, connector_id INTEGER DEFAULT NULL, assigned_to VARCHAR(255) DEFAULT NULL, number INTEGER NOT NULL, reserved BOOLEAN DEFAULT NULL, cluster INTEGER DEFAULT NULL, cluster_channel INTEGER DEFAULT NULL, cluster_card INTEGER DEFAULT NULL, distribution VARCHAR(255) DEFAULT NULL, distribution_card INTEGER DEFAULT NULL, distribution_channel INTEGER DEFAULT NULL, type VARCHAR(255) DEFAULT NULL, location VARCHAR(255) DEFAULT NULL, socket VARCHAR(255) DEFAULT NULL)');
        $this->addSql('INSERT INTO phone (id, connector_id, assigned_to, number, reserved, cluster, cluster_channel, cluster_card, distribution, distribution_card, distribution_channel, type, location, socket) SELECT id, connector_id, assigned_to, number, reserved, cluster, cluster_channel, cluster_card, distribution, distribution_card, distribution_channel, type, location, socket FROM __temp__phone');
        $this->addSql('DROP TABLE __temp__phone');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_444F97DD4D085745 ON phone (connector_id)');
    }
}
