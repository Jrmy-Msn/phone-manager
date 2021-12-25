<?php

namespace App\Entity;

use App\Repository\ConnectorRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ConnectorRepository::class)
 */
class Connector
{
  /**
   * @ORM\Id
   * @ORM\GeneratedValue
   * @ORM\Column(type="integer")
   */
  private $id;

  /**
   * @ORM\Column(type="integer")
   */
  private $number;

  /**
   * @ORM\ManyToOne(targetEntity=HeadBand::class, inversedBy="connectors")
   * @ORM\JoinColumn(nullable=false)
   */
  private $headBand;

  /**
   * @ORM\OneToOne(targetEntity=Phone::class, mappedBy="connector", cascade={"persist", "remove"})
   */
  private $phone;

  public function __construct(int $number)
  {
    $this->number = $number;
  }

  public function __toString(): string
  {
    return $this->headBand->getDistributionRoom()->getLabel() . ' - ' . $this->headBand->getLabel()
      . ' : port ' . $this->number . '<==>' . $this->phone->getNumber();
  }

  public function getId(): ?int
  {
    return $this->id;
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

  public function getHeadBand(): ?HeadBand
  {
    return $this->headBand;
  }

  public function setHeadBand(?HeadBand $headBand): self
  {
    $this->headBand = $headBand;

    return $this;
  }

  public function getPhone(): ?Phone
  {
    return $this->phone;
  }

  public function setPhone(?Phone $phone): self
  {
    // unset the owning side of the relation if necessary
    if ($phone === null && $this->phone !== null) {
      $this->phone->setConnector(null);
    }

    // set the owning side of the relation if necessary
    if ($phone !== null && $phone->getConnector() !== $this) {
      $phone->setConnector($this);
    }

    $this->phone = $phone;

    return $this;
  }

  public function asArray(?bool $deep = true)
  {
    $array = [
      'id' => $this->id,
      'number' => $this->number,
    ];

    if ($deep) {
      // if ($this->phone) $array['phone'] = $this->phone->asArray(false);
      $array['headBand'] = $this->headBand->asArray(false);
    }

    return $array;
  }
}
