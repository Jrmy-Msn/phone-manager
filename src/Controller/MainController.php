<?php

namespace App\Controller;

use App\Entity\Connector;
use App\Entity\DistributionRoom;
use App\Entity\Phone;
use App\Form\PhoneType;
use App\Form\ConnectorType;
use App\Repository\PhoneRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
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
use Symfony\Component\Validator\ConstraintViolation;
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
      return new JsonResponse($distributionsAsArray);
    } catch (Exception $exception) {
      return new JsonResponse([
        'Erreur lors de la récupération de la liste des salles de répartiteur',
        $this->translator->trans($exception->getMessage())
      ], 400);
    }
  }

  /**
   * @Route("/timone/phone/list", name="app_timone_phone_list")
   * @IsGranted("IS_AUTHENTICATED_FULLY")
   */
  public function timonePhoneList(EntityManagerInterface $om): JsonResponse
  {
    try {
      $repo = $om->getRepository(Phone::class);
      $phones = $repo->findAll();

      $phonesAsArray = [];
      foreach ($phones as $phone) {
        $phonesAsArray[] = $phone->asArray();
      }
      return new JsonResponse($phonesAsArray);
    } catch (Exception $exception) {
      return new JsonResponse([
        'Erreur lors de la récupération de la liste des postes',
        $this->translator->trans($exception->getMessage())
      ], 400);
    }
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
        $connector = null;
        $otherPhone = null;

        if ($phone->getDistribution() && $phone->getDistributionCard() && $phone->getDistributionChannel()) {
          $connector = $phone->connectorFactoryReverse(
            $phone->getDistribution(),
            $phone->getDistributionCard(),
            $phone->getDistributionChannel(),
          );
        } else if ($phone->getDistribution() || $phone->getDistributionCard() || $phone->getDistributionChannel()) {
          
        }

        if ($connector) {
          $otherPhone = $connector->getPhone();
          if ($otherPhone) {
            $otherPhone->setConnector(null);
            $otherPhone->setDistribution(null);
            $otherPhone->setDistributionCard(null);
            $otherPhone->setDistributionChannel(null);
            $om->persist($otherPhone);
            $om->flush();
          }

          $phone->setConnector($connector);
        } else if ($phone->getDistribution() || $phone->getDistributionCard() || $phone->getDistributionChannel()) {
          throw new Exception('Les données "distributionCard" et/ou "distributionChannel" n\'existe pas pour le redistributeur ' . $phone->getDistribution()->getLabel());
        }

        $om->persist($phone);
        $om->flush();
      } catch (Exception $exception) {
        return new JsonResponse([
          'Erreur lors de la mise à jour du poste ' . $phone,
          $this->translator->trans($exception->getMessage())
        ], 400);
      }

      return new JsonResponse([
        'phone' => $phone->asArray(),
        'otherPhone' => $otherPhone ? $otherPhone->asArray() : null
      ]);
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
      $phone->setDistribution(null);
      $phone->setDistributionCard(null);
      $phone->setDistributionChannel(null);
      $om->persist($phone);
      $om->flush();
      return new JsonResponse([
        'phone' => $phone->asArray(),
        'connector' => $connector ? $connector->asArray() : null,
      ]);
    } catch (Exception $exception) {
      return new JsonResponse([
        'Erreur lors du débranchement du poste ' .
          $phone,
        $this->translator->trans($exception->getMessage())
      ], 400);
    }
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
        $phone = $connector->getPhone();
        $phone->distributionFactory(
          $connector->getHeadBand()->getDistributionRoom(),
          $connector->getHeadBand(),
          $connector->getNumber()
        );
        $om->persist($connector);
        $om->flush();
        return new JsonResponse([
          'phone' => $phone->asArray(),
          'connector' => $connector->asArray(),
        ]);
      } catch (Exception $exception) {
        return new JsonResponse([
          'Erreur lors de la mise à jour du connecteur ' .
            $connector,
          $this->translator->trans($exception->getMessage())
        ], 400);
      }
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
        foreach ($this->getErrorMessages($child) as $msg) {
          $errors[] = 'Champs "' . $child->getName() . '" : ' . $msg;
        }
      }
    }

    return $errors;
  }
}
