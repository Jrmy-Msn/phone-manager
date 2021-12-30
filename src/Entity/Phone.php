<?php

namespace App\Entity;

use App\Repository\PhoneRepository;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use phpDocumentor\Reflection\Types\Integer;

/**
 * @ORM\Entity(repositoryClass=PhoneRepository::class)
 */
class Phone
{

  public const DISTRIBUTION_LENGTH = 8;
  /**
   * @ORM\Id
   * @ORM\GeneratedValue
   * @ORM\Column(type="integer")
   */
  private $id;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $assignedTo;

  /**
   * @ORM\Column(type="integer", unique=true)
   */
  private $number;

  /**
   * @ORM\Column(type="boolean", nullable=true)
   */
  private $reserved;

  /**
   * @ORM\Column(type="integer", nullable=true)
   */
  private $cluster;

  /**
   * @ORM\Column(type="integer", nullable=true)
   */
  private $clusterChannel;

  /**
   * @ORM\Column(type="integer", nullable=true)
   */
  private $clusterCard;

  /**
   * @ORM\ManyToOne(targetEntity="App\Entity\DistributionRoom")
   * @ORM\JoinColumn(name="distribution_id", referencedColumnName="id", nullable="true")
   */
  private $distribution;

  /**
   * @ORM\Column(type="integer", nullable=true)
   */
  private $distributionCard;

  /**
   * @ORM\Column(type="integer", nullable=true)
   */
  private $distributionChannel;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $type;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $location;

  /**
   * @ORM\OneToOne(targetEntity=Connector::class, inversedBy="phone", cascade={"persist", "remove"})
   */
  private $connector;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $socket;

  public function __construct(?int $num = null)
  {
    if (intval($num)) $this->number = $num;
  }

  public function __toString(): string
  {
    return 'N° ' . $this->number;
  }

  public function getId(): ?int
  {
    return $this->id;
  }

  public function getAssignedTo(): ?string
  {
    return $this->assignedTo;
  }

  public function setAssignedTo(?string $assignedTo): self
  {
    $this->assignedTo = $assignedTo;

    return $this;
  }

  public function getNumber(): ?int
  {
    return $this->number;
  }

  public function setNumber(int $number): self
  {
    $this->number = $number;

    return $this;
  }

  public function getReserved(): ?bool
  {
    return $this->reserved;
  }

  public function setReserved(?bool $reserved): self
  {
    $this->reserved = $reserved;

    return $this;
  }

  public function getCluster(): ?int
  {
    return $this->cluster;
  }

  public function setCluster(?int $cluster): self
  {
    $this->cluster = $cluster;

    return $this;
  }

  public function getClusterChannel(): ?int
  {
    return $this->clusterChannel;
  }

  public function setClusterChannel(?int $clusterChannel): self
  {
    $this->clusterChannel = $clusterChannel;

    return $this;
  }

  public function getClusterCard(): ?int
  {
    return $this->clusterCard;
  }

  public function setClusterCard(?int $clusterCard): self
  {
    $this->clusterCard = $clusterCard;

    return $this;
  }

  public function getDistribution(): ?DistributionRoom
  {
    return $this->distribution;
  }

  public function setDistribution(?DistributionRoom $distribution): self
  {
    $this->distribution = $distribution;

    return $this;
  }

  public function getDistributionCard(): ?int
  {
    return $this->distributionCard;
  }

  public function setDistributionCard(?int $distributionCard): self
  {
    $this->distributionCard = $distributionCard;

    return $this;
  }

  public function getDistributionChannel(): ?int
  {
    return $this->distributionChannel;
  }

  public function setDistributionChannel(?int $distributionChannel): self
  {
    $this->distributionChannel = $distributionChannel;

    return $this;
  }

  public function getType(): ?string
  {
    return $this->type;
  }

  public function setType(?string $type): self
  {
    $this->type = $type;

    return $this;
  }

  public function getLocation(): ?string
  {
    return $this->location;
  }

  public function setLocation(?string $location): self
  {
    $this->location = $location;

    return $this;
  }

  public function getConnector(): ?Connector
  {
    return $this->connector;
  }

  public function setConnector(?Connector $connector): self
  {
    $this->connector = $connector;

    return $this;
  }

  public function getSocket(): ?string
  {
    return $this->socket;
  }

  public function setSocket(?string $socket): self
  {
    $this->socket = $socket;

    return $this;
  }

  public function clusterFactory(int $cluster, int $card, int $channel)
  {
    $this->cluster = $cluster;
    $this->clusterCard = $card;
    $this->clusterChannel = $channel;
  }

  public function distributionFactory(DistributionRoom $distribution, HeadBand $headBand, int $connectorNumber)
  {
    // calcul du numéro de port en additionnant dans l'ordre tous les bandeaux d'un redistributeur
    $port = 0;
    for ($i = 1; $i < $headBand->getPosition(); $i++) {
      $port += ($distribution->getHeadBands()[$i - 1])->getLength();
    }
    $port += $connectorNumber;

    $this->distribution = $distribution;
    $this->distributionCard =
      floor($port / self::DISTRIBUTION_LENGTH)
      + ($port % self::DISTRIBUTION_LENGTH > 0 ? 1 : 0);
    $this->distributionChannel = ($port % self::DISTRIBUTION_LENGTH === 0)
      ? self::DISTRIBUTION_LENGTH
      : $port % self::DISTRIBUTION_LENGTH;
  }

  public function connectorFactory(HeadBand $headBand, int $number)
  {
    $connector = $headBand->getConnector($number);
    $this->setConnector($connector);
  }

  public function connectorFactoryReverse(DistributionRoom $distribution, $distributionCard, int $distributionChannel) :Connector
  {
    // calcul du numéro de port en additionnant dans l'ordre tous les bandeaux d'un redistributeur
    $headBand = null;
    $length = 0;
    $port = (($distributionCard - 1) * Phone::DISTRIBUTION_LENGTH) + $distributionChannel;
    for ($i = 0; $i < count($distribution->getHeadBands()); $i++) {
      $headBand = $distribution->getHeadBands()->get($i);

      if ($port <= $length + $headBand->getLength()) {
        $port -= $length;
        break;
      }
      $length += $headBand->getLength();
    }

    return $headBand->getConnector($port);
  }

  public function asArray(?bool $deep = true)
  {
    return [
      'id' => $this->id,
      'assignedTo' => $this->assignedTo,
      'number' => $this->number,
      'reserved' => $this->reserved,
      'cluster' => $this->cluster,
      'clusterCard' => $this->clusterCard,
      'clusterChannel' => $this->clusterChannel,
      'distribution' => $this->distribution ? $this->distribution->asArray(false) : null,
      'distributionCard' => $this->distributionCard,
      'distributionChannel' => $this->distributionChannel,
      'type' => $this->type,
      'location' => $this->location,
      'connector' => $this->connector ? $this->connector->asArray(false) : null,
      'socket' => $this->getSocket(),
    ];
  }
}
