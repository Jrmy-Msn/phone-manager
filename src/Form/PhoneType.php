<?php

namespace App\Form;

use App\Entity\DistributionRoom;
use App\Entity\Phone;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PhoneType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('assignedTo', TextType::class)
            // ->add('number')
            ->add('reserved', CheckboxType::class)
            ->add('cluster', IntegerType::class)
            ->add('clusterChannel', IntegerType::class)
            ->add('clusterCard', IntegerType::class)
            ->add('distribution', EntityType::class, [
              'class' => DistributionRoom::class,
              'choice_label' => 'distribution',
            ])
            ->add('distributionCard', IntegerType::class)
            ->add('distributionChannel', IntegerType::class)
            ->add('type', ChoiceType::class, [
              'choices'  => [
                  'ANALOGIQUE' => 'ANALOGIQUE',
                  'NUMERIQUE' => 'NUMERIQUE'
              ]
            ])
            ->add('location', TextType::class)
            ->add('socket', TextType::class)
            // ->add('connector')
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Phone::class,
            'csrf_protection' => false
        ]);
    }
}
