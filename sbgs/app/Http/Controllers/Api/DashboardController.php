<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stagiaire;

class DashboardController extends Controller
{
    public function stats()
    {

        // Total stagiaires
        $total = Stagiaire::count();

        // Actifs
        $actifs = Stagiaire::where('statut', 'Actif')->count();

        // Terminés
        $termines = Stagiaire::where('statut', 'Terminé')->count();

        // Stagiaires par service
        $services = Stagiaire::selectRaw('service, COUNT(*) as total')
            ->groupBy('service')
            ->pluck('total', 'service');

        // Derniers stagiaires
        $recent = Stagiaire::latest()
            ->take(5)
            ->get(['nom', 'service', 'statut']);

        return response()->json([
            'total' => $total,
            'actifs' => $actifs,
            'termines' => $termines,
            'services' => $services,
            'recent' => $recent
        ]);
    }
}