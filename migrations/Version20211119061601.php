<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211119061601 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE phone (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, assigned_to VARCHAR(255) DEFAULT NULL, number INTEGER NOT NULL, reserved BOOLEAN DEFAULT NULL, cluster INTEGER DEFAULT NULL, cluster_channel INTEGER DEFAULT NULL, cluster_index INTEGER DEFAULT NULL, distribution VARCHAR(255) DEFAULT NULL, distribution_card INTEGER DEFAULT NULL, distribution_channel INTEGER DEFAULT NULL, type VARCHAR(255) DEFAULT NULL, location VARCHAR(255) DEFAULT NULL, room VARCHAR(255) DEFAULT NULL, room_switch VARCHAR(255) DEFAULT NULL, switch_core VARCHAR(255) DEFAULT NULL, socket VARCHAR(255) DEFAULT NULL)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE phone');
    }
}
