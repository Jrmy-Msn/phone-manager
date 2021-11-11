<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
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
      ->addArgument('username', InputArgument::OPTIONAL, 'prenom.nom');
  }

  protected function execute(InputInterface $input, OutputInterface $output): int
  {
    $io = new SymfonyStyle($input, $output);
    $helper = $this->getHelper('question');
    $user = null;
    $userRepository = $this->om->getRepository(User::class);

    $username = $input->getArgument('username');

    // Demande du nom utilisateur si non fournit en paramètre de la commande
    if (!$username) {
      $users = $userRepository->findAll();
      $names = [];
      foreach ($users as $u) {
        $names[] = $u->getUsername();
      }
      $question = new ChoiceQuestion(
        sprintf('Nom utilisateur à supprimer : '),
        $names
      );

      $username = $helper->ask($input, $output, $question);
    }

    // Vérification que l'utilisateur saisi existe
    try {
      $user = $userRepository->findOneByUsername($username);
      if (!$user) {
        throw new \RuntimeException(
          sprintf('L\'utilisateur %s n\'existe pas', $username)
        );
      }
    } catch (\RuntimeException $execption) {
      return Command::FAILURE;
    }

    $io->note(sprintf('Utilisateur a supprimé : %s', $username));

    // Demande de confirmation de la suppression
    $question = new ConfirmationQuestion('Confirmer la suppression ? (yes/no) [no] ', false, '/(y|yes|n|no)/i');
    $confirm = $helper->ask($input, $output, $question);
    if (!$confirm) {
      $io->error(sprintf('Abandon de la suppression de l\'utilisateur : %s', $username));
      return Command::FAILURE;
    }

    $this->om->remove($user);
    $this->om->flush();

    $io->success(sprintf('Utilisateur supprimé avec succès : %s', $username));

    return Command::SUCCESS;
  }
}
