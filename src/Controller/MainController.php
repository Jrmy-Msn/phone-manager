<?php

namespace App\Controller;

use App\Entity\Phone;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class MainController extends AbstractController
{
  /**
   * @Route("/", name="app_home")
   * @Template
   */
  public function index(): array
  {
    return [];
  }

  /**
   * @Route("/timone", name="app_timone")
   * @IsGranted("IS_AUTHENTICATED_FULLY")
   * @Template
   */
  public function timone(EntityManagerInterface $om): array
  {
    $repo = $om->getRepository(Phone::class);
    $phones = $repo->findAll();

    return [
      'phones' => $phones
    ];
  }
}
