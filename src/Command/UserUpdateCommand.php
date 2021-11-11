<?php

namespace App\Command;

use App\Entity\User;
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
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


class UserUpdateCommand extends Command
{
  protected static $defaultName = 'app:user:update';
  protected static $defaultDescription = 'Modifier un utilisateur';

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

    $user = null;
    $userRepository = $this->om->getRepository(User::class);

    // Demande du nom utilisateur si non fournit en paramètre de la commande
    if (!$username) {
      $users = $userRepository->findAll();
      $names = [];
      foreach ($users as $u) {
        $names[] = $u->getUsername();
      }
      $question = new ChoiceQuestion(
        sprintf('Nom utilisateur à modifier : '),
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

    $io->note(sprintf('Utilisateur a modifier : %s', $username));

    // Demande du mot de passe utilisateur si non fournit en paramètre de la commande
    if (!$password) {
      $question = new Question(
        sprintf('Mot de passe pour %s : [mot de passe actuel]', $username)
      );
      $question->setHidden(true);
      $question->setHiddenFallback(false);
      $question->setValidator(function ($answer) {
        if ($answer && strlen($answer) < 5) {
          throw new \RuntimeException(
            'Mot de passe trop court (min 5 caractères)'
          );
        }
        return $answer;
      });
      $password = $helper->ask($input, $output, $question);

      if ($password) {
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

        $io->note(sprintf('Mot de passe pour %s modifié : %s', $username, str_repeat('*', strlen($password))));
      } else {
        $io->note(sprintf('Mot de passe pour %s inchangé', $username));
      }
    }

    // Demande du rôle ADMIN si non fournit en paramètre de la commande
    if (!$is_admin) {
      $question = new ConfirmationQuestion('Rôle administrateur ? (oui/non) [non] ', false, '/(y|yes|oui|o|n|non|no)/i');
      $is_admin = $helper->ask($input, $output, $question);
    }

    // Définition du rôle en fonction de l'option fournit en paramètre de la commande
    $role = $is_admin ? 'ROLE_ADMIN' : 'ROLE_USER';

    // Hash du mot de passe
    if ($password) {
      $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
      $io->note(sprintf('Mot de passe hashé : %s', $hashedPassword));
      $user->setPassword($hashedPassword);
    }

    // Affectation des valeurs au nouvel utilisateur
    $user->setRoles([$role]);
    $this->om->persist($user);
    $this->om->flush();

    $io->success(sprintf('Utilisateur modifié avec succès : %s (%s).', $username, $role));

    return Command::SUCCESS;
  }
}
