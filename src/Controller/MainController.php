<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;


class MainController extends AbstractController
{
    /**
     * @Route("/", name="main_index")
     * @Template
     */
    public function index(): Array
    {
        return [];
    }
}
