<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserCreateCommand extends Command
{
  protected static $defaultName = 'app:user:create';
  protected static $defaultDescription = 'Création d\'un utilisateur';

  public function __construct(EntityManagerInterface $om, UserPasswordHasherInterface $passwordHasher)
  {
    $this->om = $om;
    $this->passwordHasher = $passwordHasher;
    parent::__construct();
  }

  protected function configure(): void
  {
    $this
      ->addArgument('username', InputArgument::OPTIONAL, 'prenom.nom')
      ->addArgument('password', InputArgument::OPTIONAL, 'mot de passe')
      ->addOption('admin', 'a', InputOption::VALUE_NONE, 'rôle administrateur');
  }

  protected function execute(InputInterface $input, OutputInterface $output): int
  {
    $io = new SymfonyStyle($input, $output);
    $helper = $this->getHelper('question');

    $username = $input->getArgument('username');
    $password = $input->getArgument('password');
    $is_admin = $input->getOption('admin');

    // Demande du nom utilisateur si non fournit en paramètre de la commande
    if (!$username) {
      $question = new Question(
        sprintf('Nom utilisateur (prenom.nom) : ')
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

    // Demande du mot de passe utilisateur si non fournit en paramètre de la commande
    if (!$password) {
      $question = new Question(
        sprintf('Mot de passe pour %s : ', $username)
      );
      $question->setHidden(true);
      $question->setHiddenFallback(false);
      $question->setValidator(function ($answer) {
        if (strlen($answer) < 5) {
          throw new \RuntimeException(
            'Mot de passe trop court (min 5 caractères)'
          );
        }
        return $answer;
      });
      $password = $helper->ask($input, $output, $question);

      $question = new Question(
        sprintf('Confirmer le mot de passe pour %s : ', $username)
      );
      $question->setValidator(function ($answer) use ($password) {
        if ($password !== $answer) {
          throw new \RuntimeException(
            'Les mots de passe ne correspondent pas'
          );
        }
        return $answer;
      });
    }

    $io->note(sprintf('Mot de passe pour %s confirmé : %s', $username, str_repeat('*', strlen($password))));

    // Définition du rôle en fonction de l'option fournit en paramètre de la commande
    $role = $is_admin ? 'ROLE_ADMIN' : 'ROLE_USER';

    // Création de l'utilisateur en base de donnée
    $user = new User();

    // Hash du mot de passe
    $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
    $io->note(sprintf('Mot de passe hashé : %s', $hashedPassword));

    // Affectation des valeurs au nouvel utilisateur
    $user->setUsername($username);
    $user->setPassword($hashedPassword);
    $user->setRoles([$role]);
    $this->om->persist($user);
    $this->om->flush();

    $io->success(sprintf('Utilisateur créé avec succès : %s (%s).', $username, $role));

    return Command::SUCCESS;
  }
}
