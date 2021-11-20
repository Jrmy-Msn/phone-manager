<?php

namespace App\Controller;

use App\Entity\Phone;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;

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
   return [];
  }

  /**
   * @Route("/timone/list", name="app_timone_list")
   * @IsGranted("IS_AUTHENTICATED_FULLY")
   */
  public function timoneList(EntityManagerInterface $om): JsonResponse
  {
    $repo = $om->getRepository(Phone::class);
    $phones = $repo->findAll();

    $phonesAsArray = [];
    foreach ($phones as $phone) {
      $phonesAsArray[] = $phone->asArray();
    }

    return new JsonResponse($phonesAsArray);
  }


}
