<?php

namespace App\Repository;

use App\Entity\DistributionRoom;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method DistributionRoom|null find($id, $lockMode = null, $lockVersion = null)
 * @method DistributionRoom|null findOneBy(array $criteria, array $orderBy = null)
 * @method DistributionRoom[]    findAll()
 * @method DistributionRoom[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DistributionRoomRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DistributionRoom::class);
    }

    // /**
    //  * @return DistributionRoom[] Returns an array of DistributionRoom objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('d.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?DistributionRoom
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
