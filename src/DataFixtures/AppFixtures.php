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
    $headbands = [];
    $headbands[] = new HeadBand('A', 24);
    $headbands[] = new HeadBand('B', 24);
    $headbands[] = new HeadBand('A', 24);
    $headbands[] = new HeadBand('B', 24);
    $headbands[] = new HeadBand('A', 24);
    $room1 = new DistributionRoom('SR-1', new ArrayCollection([$headbands[0], $headbands[1]]));
    $room2 = new DistributionRoom('SR-2', new ArrayCollection([$headbands[2], $headbands[3]]));
    $room3 = new DistributionRoom('SR-3', new ArrayCollection([$headbands[4]]));
    $manager->persist($room1);
    $manager->persist($room2);
    $manager->persist($room3);

    $manager->flush();

    // PHONE
    function generateRandomString($length = 1)
    {
      $characters = 'ABCD';
      $number = random_int(1, 8);
      $charactersLength = strlen($characters);
      $randomString = '';
      for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
      }
      return $randomString . $number;
    }

    $randReserved = (bool)random_int(0, 1);
    $randLocation = (bool)random_int(0, 1) ? 'LOGT' : 'BUR';
    $randType = (bool)random_int(0, 1) ? 'ANAMOGIQUE' : 'NUMERIQUE';
    $randAssignedTo = (bool)random_int(0, 1) ? 'EM REGIONAL' : 'AUTRE';
    $randCluster = random_int(1, 4);
    $randClusterCard = random_int(1, 4);
    $randClusterChannel = random_int(1, 30);
    $randDistribution = generateRandomString();
    $randDistributionCard = random_int(1, 4);
    $randDistributionChannel = random_int(1, 30);
    $randHeadBand = random_int(0, 4);
    $randHeadBand = $headbands[$randHeadBand];

    for ($i = 0; $i < 10; $i++) {
      $phone = new Phone(random_int(6000, 6200));
      $phone->setReserved($randReserved);
      $phone->setLocation($randLocation);
      $phone->setAssignedTo($randAssignedTo);
      $phone->clusterFactory($randCluster, $randClusterCard, $randClusterChannel);
      $phone->distributionFactory($randDistribution, $randDistributionCard, $randDistributionChannel);
      $phone->connectorFactory($randHeadBand, $i);
      $phone->setType($randType);
      $manager->persist($phone);
    }

    $manager->flush();
  }
}
