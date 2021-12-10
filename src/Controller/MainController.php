<?php

namespace App\Controller;

use App\Entity\Connector;
use App\Entity\DistributionRoom;
use App\Entity\Phone;
use App\Form\PhoneType;
use App\Form\ConnectorType;
use App\Repository\PhoneRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;

class MainController extends AbstractController
{

  private $translator;

  public function __construct(TranslatorInterface $translator)
  {
    $this->translator = $translator;
  }

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
   * @Route("/timone/phone", name="app_timone_phone")
   * @Route("/timone/distribution", name="app_timone_distribution")
   * @IsGranted("IS_AUTHENTICATED_FULLY")
   * @Template
   */
  public function timone(EntityManagerInterface $om): array
  {
    return [];
  }

  /**
   * @Route("/timone/distribution/list", name="app_timone_distribution_list")
   * @IsGranted("IS_AUTHENTICATED_FULLY")
   */
  public function timoneDistributionList(EntityManagerInterface $om): JsonResponse
  {
    try {
      $repo = $om->getRepository(DistributionRoom::class);
      $distributions = $repo->findAll();

      $distributionsAsArray = [];
      foreach ($distributions as $distrib) {
        $distributionsAsArray[] = $distrib->asArray();
      }
    } catch (Exception $exception) {
      return new JsonResponse([
        'message' => 'Erreur lors de la récupération de la liste des salles de répartiteur'
      ], 400);
    }

    return new JsonResponse($distributionsAsArray);
  }

  /**
   * @Route("/timone/phone/list", name="app_timone_phone_list")
   * @IsGranted("IS_AUTHENTICATED_FULLY")
   */
  public function timoneList(EntityManagerInterface $om): JsonResponse
  {
    try {
      $repo = $om->getRepository(Phone::class);
      $phones = $repo->findAll();

      $phonesAsArray = [];
      foreach ($phones as $phone) {
        $phonesAsArray[] = $phone->asArray();
      }
    } catch (Exception $exception) {
      return new JsonResponse([
        'message' => 'Erreur lors de la récupération de la liste des postes'
      ], 400);
    }

    return new JsonResponse($phonesAsArray);
  }

  /**
   * @Route("/timone/phone/update/{id}", 
   *    methods={"POST"}, 
   *    name="app_timone_phone_update",
   *    requirements={"id"="\d+"})
   * @IsGranted("IS_AUTHENTICATED_FULLY")
   */
  public function timonePhoneUpdate(Phone $phone, Request $request, EntityManagerInterface $om): ?Response
  {
    $form = $this->createForm(PhoneType::class, $phone);

    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
      try {
        $om->persist($phone);
        $om->flush();
      } catch (Exception $exception) {
        return new JsonResponse([
          'message' => 'Erreur lors de la mise à jour du poste ' . $phone
        ], 400);
      }
      return new JsonResponse($phone->asArray());
    }

    $errors = $this->getErrorMessages(($form));
    return new JsonResponse($errors, 400);
  }

  /**
   * @Route("/timone/phone/unplug/{id}", 
   *    methods={"POST"}, 
   *    name="app_timone_phone_unplug",
   *    requirements={"id"="\d+"})
   * @IsGranted("IS_AUTHENTICATED_FULLY")
   */
  public function timonePhoneUnplug(Phone $phone, Request $request, EntityManagerInterface $om): ?Response
  {
    try {
      $connector = $phone->getConnector();
      $phone->setConnector(null);
      $om->persist($phone);
      $om->flush();
    } catch (Exception $exception) {
      return new JsonResponse([
        'message' => 'Erreur lors du débranchement du poste ' . $phone
      ], 400);
    }
    return new JsonResponse($connector->asArray());
  }

  /**
   * @Route("/timone/connector/update/{id}", 
   *    methods={"POST"}, 
   *    name="app_timone_connector_update",
   *    requirements={"id"="\d+"})
   * @IsGranted("IS_AUTHENTICATED_FULLY")
   */
  public function timoneConnectorUpdate(Connector $connector, Request $request, EntityManagerInterface $om): ?Response
  {
    $form = $this->createForm(ConnectorType::class, $connector);

    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
      try {
        $om->persist($connector);
        $om->flush();
      } catch (Exception $exception) {
        return new JsonResponse([
          'message' => 'Erreur lors de la mise à jour du connecteur ' . $connector
        ], 400);
      }
      return new JsonResponse($connector->asArray());
    }

    $errors = $this->getErrorMessages(($form));
    return new JsonResponse($errors, 400);
  }

  /**
   * Récupère les messages d'erreur liés au formulaire "PhoneType"
   * Les messages sont fournis sous forme de JSON
   */
  public function getErrorMessages(Form $form): array
  {
    $errors = [];

    foreach ($form->getErrors() as $key => $error) {
      $errors[] = $this->translator->trans($error->getMessage());
    }

    foreach ($form->all() as $child) {
      if (!$child->isValid()) {
        $errors[$child->getName()] = $this->getErrorMessages($child);
      }
    }

    return $errors;
  }
}
