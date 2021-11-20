<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211119183009 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__phone AS SELECT id, assigned_to, number, reserved, cluster, cluster_channel, cluster_index, distribution, distribution_card, distribution_channel, type, location, room, socket FROM phone');
        $this->addSql('DROP TABLE phone');
        $this->addSql('CREATE TABLE phone (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, assigned_to VARCHAR(255) DEFAULT NULL COLLATE BINARY, number INTEGER NOT NULL, reserved BOOLEAN DEFAULT NULL, cluster INTEGER DEFAULT NULL, cluster_channel INTEGER DEFAULT NULL, cluster_index INTEGER DEFAULT NULL, distribution VARCHAR(255) DEFAULT NULL COLLATE BINARY, distribution_card INTEGER DEFAULT NULL, distribution_channel INTEGER DEFAULT NULL, type VARCHAR(255) DEFAULT NULL COLLATE BINARY, location VARCHAR(255) DEFAULT NULL COLLATE BINARY, room VARCHAR(255) DEFAULT NULL COLLATE BINARY, socket VARCHAR(255) DEFAULT NULL COLLATE BINARY, switch VARCHAR(255) DEFAULT NULL, core VARCHAR(255) DEFAULT NULL)');
        $this->addSql('INSERT INTO phone (id, assigned_to, number, reserved, cluster, cluster_channel, cluster_index, distribution, distribution_card, distribution_channel, type, location, room, socket) SELECT id, assigned_to, number, reserved, cluster, cluster_channel, cluster_index, distribution, distribution_card, distribution_channel, type, location, room, socket FROM __temp__phone');
        $this->addSql('DROP TABLE __temp__phone');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__phone AS SELECT id, assigned_to, number, reserved, cluster, cluster_channel, cluster_index, distribution, distribution_card, distribution_channel, type, location, room, socket FROM phone');
        $this->addSql('DROP TABLE phone');
        $this->addSql('CREATE TABLE phone (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, assigned_to VARCHAR(255) DEFAULT NULL, number INTEGER NOT NULL, reserved BOOLEAN DEFAULT NULL, cluster INTEGER DEFAULT NULL, cluster_channel INTEGER DEFAULT NULL, cluster_index INTEGER DEFAULT NULL, distribution VARCHAR(255) DEFAULT NULL, distribution_card INTEGER DEFAULT NULL, distribution_channel INTEGER DEFAULT NULL, type VARCHAR(255) DEFAULT NULL, location VARCHAR(255) DEFAULT NULL, room VARCHAR(255) DEFAULT NULL, socket VARCHAR(255) DEFAULT NULL, room_switch VARCHAR(255) DEFAULT NULL COLLATE BINARY, switch_core VARCHAR(255) DEFAULT NULL COLLATE BINARY)');
        $this->addSql('INSERT INTO phone (id, assigned_to, number, reserved, cluster, cluster_channel, cluster_index, distribution, distribution_card, distribution_channel, type, location, room, socket) SELECT id, assigned_to, number, reserved, cluster, cluster_channel, cluster_index, distribution, distribution_card, distribution_channel, type, location, room, socket FROM __temp__phone');
        $this->addSql('DROP TABLE __temp__phone');
    }
}
