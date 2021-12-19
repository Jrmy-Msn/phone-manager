<?php

namespace App\Entity;

use App\Repository\DistributionRoomRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=DistributionRoomRepository::class)
 */
class DistributionRoom
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
   * @ORM\OneToMany(targetEntity=HeadBand::class, mappedBy="distributionRoom", orphanRemoval=true, cascade={"persist", "remove"})
   */
  private $headBands;

  public function __construct(string $label, ?ArrayCollection $headBands)
  {
    $this->label = $label;
    $this->headBands = new ArrayCollection();
    if ($headBands) {
      foreach ($headBands as $headBand) {
        $this->headBand($headBand);
      }
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
   * @return Collection|HeadBand[]
   */
  public function getHeadBands(): Collection
  {
    return $this->headBands;
  }

  public function addHeadBand(HeadBand $headBand): self
  {
    if (!$this->headBands->contains($headBand)) {
      $this->headBands[] = $headBand;
      $headBand->setDistributionRoom($this);
    }

    return $this;
  }

  public function removeHeadBand(HeadBand $headBand): self
  {
    if ($this->headBands->removeElement($headBand)) {
      // set the owning side to null (unless already changed)
      if ($headBand->getDistributionRoom() === $this) {
        $headBand->setDistributionRoom(null);
      }
    }

    return $this;
  }

  public function headBand(HeadBand $headBand)
  {
    $headBand->setDistributionRoom($this);
    $this->headBands->add($headBand);
  }

  public function asArray(?bool $deep = true)
  {
    $headBandsAsArray = [];
    foreach ($this->headBands as $headBand) {
      $headBandsAsArray[] = $headBand->asArray($deep);
    }

    return [
      'id' => $this->id,
      'label' => $this->label,
      'headBands' => $headBandsAsArray
    ];
  }
}
