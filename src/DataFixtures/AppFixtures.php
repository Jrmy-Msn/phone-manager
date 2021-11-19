<?php

namespace App\DataFixtures;

use App\Entity\Phone;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture

{
  private $passwordHasher;

  public function __construct(UserPasswordHasherInterface $passwordHasher)
  {
    $this->passwordHasher = $passwordHasher;
  }

  public function load(ObjectManager $manager): void
  {
    // $product = new Product();
    // $manager->persist($product);

    // PHONE
    $phone = new Phone(6000);
    $phone->setReserved(true);
    $phone->setLocation('LOGT');
    $phone->setAssignedTo('EM REGIONAL');
    $phone->clusterFactory(4, 1, 8);
    $phone->distributionFactory('A7', 5, 7);
    $phone->roomFactory('SR-3', 'A', '7');
    $phone->setType('ANALOGIQUE');
    $manager->persist($phone);

    // USER
    $user = new User();
    $user->setUsername('admin');
    $user->setPassword($this->passwordHasher->hashPassword($user, 'admin'));
    $user->setRoles(['ROLE_ADMIN']);
    $manager->persist($user);

    $manager->flush();
  }
}
