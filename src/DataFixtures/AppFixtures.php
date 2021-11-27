<?php

namespace App\DataFixtures;

use App\Entity\DistributionRoom;
use App\Entity\HeadBand;
use App\Entity\Phone;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Collections\ArrayCollection;
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
    // USER
    $user = new User();
    $user->setUsername('admin');
    $user->setPassword($this->passwordHasher->hashPassword($user, 'admin'));
    $user->setRoles(['ROLE_ADMIN']);
    $manager->persist($user);

    // DISTRIBUTION ROOM
    $headband1 = new HeadBand('A', 24);
    $headband2 = new HeadBand('B', 12);
    $room = new DistributionRoom('SR-1', new ArrayCollection([$headband1, $headband2]));
    $manager->persist($room);

    // PHONE
    $phone = new Phone(6000);
    $phone->setReserved(true);
    $phone->setLocation('LOGT');
    $phone->setAssignedTo('EM REGIONAL');
    $phone->clusterFactory(4, 1, 8);
    $phone->distributionFactory('A7', 5, 7);
    $phone->connectorFactory($headband1, 1);
    $phone->setType('ANALOGIQUE');
    $manager->persist($phone);

    $manager->flush();
  }
}
