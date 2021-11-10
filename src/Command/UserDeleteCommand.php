<?php

namespace App\Command;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Question\ChoiceQuestion;
use Symfony\Component\Console\Question\ConfirmationQuestion;

class UserDeleteCommand extends Command
{
  protected static $defaultName = 'app:user:delete';
  protected static $defaultDescription = 'Suppression d\'un utilisateur';

  public function __construct(EntityManagerInterface $om)
  {
    $this->om = $om;
    parent::__construct();
  }

  protected function configure(): void
  {
    $this
      ->addArgument('username', InputArgument::OPTIONAL, 'prenom.nom')
    ;
  }

  protected function execute(InputInterface $input, OutputInterface $output): int
  {
    $io = new SymfonyStyle($input, $output);
    $helper = $this->getHelper('question');

    $username = $input->getArgument('username');

    // Demande du nom utilisateur si non fournit en paramètre de la commande
    if (!$username) {
      $question = new ChoiceQuestion(
        sprintf('Nom utilisateur à supprimer :'),
        
      );
      $question->setValidator(function ($answer) {
        $regex = '/[a-z]+([-][a-z]+)?([-][a-z1-9]{1})?\.[a-z]+([-][a-z]+)?/';
        if (!preg_match($regex, $answer)) {
          throw new \RuntimeException(
            'Format du nom utilisateur incorrect : prenom.nom'
          );
        }
        return $answer;
      });
      $username = $helper->ask($input, $output, $question);
    }

    $io->note(sprintf('Utilisateur a créer : %s', $username));

    return Command::SUCCESS;
  }
}
