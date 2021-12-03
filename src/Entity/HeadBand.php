<?php

namespace App\Entity;

use App\Repository\HeadBandRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=HeadBandRepository::class)
 */
class HeadBand
{
  /**
   * @ORM\Id
   * @ORM\GeneratedValue
   * @ORM\Column(type="integer")
   */
  private $id;

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $label;

  /**
   * @ORM\OneToMany(targetEntity=Connector::class, mappedBy="headBand", orphanRemoval=true, cascade={"persist", "remove"})
   */
  private $connectors;

  /**
   * @ORM\ManyToOne(targetEntity=DistributionRoom::class, inversedBy="headBands")
   * @ORM\JoinColumn(nullable=false)
   */
  private $distributionRoom;

  public function __construct(string $label, int $numberOfConnectors)
  {
    $this->label = $label;
    $this->connectors = new ArrayCollection();
    for ($i = 0; $i < $numberOfConnectors; $i++) {
      $this->connector($i);
    }
  }

  public function getId(): ?int
  {
    return $this->id;
  }

  public function getLabel(): ?string
  {
    return $this->label;
  }

  public function setLabel(string $label): self
  {
    $this->label = $label;

    return $this;
  }

  /**
   * @return Collection|Connector[]
   */
  public function getConnectors(): Collection
  {
    return $this->connectors;
  }

  /**
   * @return Connector
   */
  public function getConnector(int $number): Connector
  {
    return $this->connectors[$number];
  }

  public function addConnector(Connector $connector): self
  {
    if (!$this->connectors->contains($connector)) {
      $this->connectors[] = $connector;
      $connector->setHeadBand($this);
    }

    return $this;
  }

  public function removeConnector(Connector $connector): self
  {
    if ($this->connectors->removeElement($connector)) {
      // set the owning side to null (unless already changed)
      if ($connector->getHeadBand() === $this) {
        $connector->setHeadBand(null);
      }
    }

    return $this;
  }

  public function getDistributionRoom(): ?DistributionRoom
  {
    return $this->distributionRoom;
  }

  public function setDistributionRoom(?DistributionRoom $distributionRoom): self
  {
    $this->distributionRoom = $distributionRoom;

    return $this;
  }

  public function connector(int $number)
  {
    $connector = new Connector($number);
    $connector->setHeadBand($this);
    $this->connectors->add($connector);
  }

  public function asArray()
  {
    $connectorsAsArray = [];
    foreach ($this->connectors as $connector) {
      $connectorsAsArray[] = $connector->asArray();
    }

    $array = [
      'id' => $this->getId(),
      'label' => $this->getLabel(),
      'connectors' => $connectorsAsArray
    ];

    return $array;
  }
}
