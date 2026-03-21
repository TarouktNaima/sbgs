<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stagiaire;
use App\Models\Document; // 👈 مهم

class StagiaireController extends Controller
{

    // afficher tous les stagiaires
    public function index()
    {
        return Stagiaire::all();
    }

    // ajouter stagiaire + upload files
    public function store(Request $request)
    {
        // ✅ validation
        $request->validate([
            'nom' => 'required',
            'prenom' => 'required',
            'email' => 'required|email',
        ]);

        // 📁 upload files
        $cv = null;
        $convention = null;
        $rapport = null;

        if ($request->hasFile('cv')) {
            $cv = $request->file('cv')->store('documents', 'public');
        }

        if ($request->hasFile('convention')) {
            $convention = $request->file('convention')->store('documents', 'public');
        }

        if ($request->hasFile('rapport')) {
            $rapport = $request->file('rapport')->store('documents', 'public');
        }

        // 💾 create stagiaire
        $stagiaire = Stagiaire::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'adresse' => $request->adresse, // 👈 زدناها
            'service' => $request->service,
            'encadrant' => $request->encadrant, // 👈 زدناها
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'statut' => $request->statut
        ]);

        // 📄 save documents
        if ($cv) {
            Document::create([
                'stagiaire_id' => $stagiaire->id,
                'type_document' => 'CV',
                'nom_fichier' => $cv,
            ]);
        }

        if ($convention) {
            Document::create([
                'stagiaire_id' => $stagiaire->id,
                'type_document' => 'Convention',
                'nom_fichier' => $convention,
            ]);
        }

        if ($rapport) {
            Document::create([
                'stagiaire_id' => $stagiaire->id,
                'type_document' => 'Rapport',
                'nom_fichier' => $rapport,
            ]);
        }

        return response()->json([
            "message" => "Stagiaire + documents ajoutés ✔️",
            "stagiaire" => $stagiaire
        ]);
    }

    // afficher un stagiaire
    public function show($id)
    {
        return Stagiaire::find($id);
    }

    // modifier stagiaire
    public function update(Request $request, $id)
    {
        $stagiaire = Stagiaire::find($id);

        $stagiaire->update($request->all());

        return response()->json($stagiaire);
    }

    // supprimer stagiaire
    public function destroy($id)
    {
        $stagiaire = Stagiaire::find($id);

        $stagiaire->delete();

        return response()->json("stagiaire supprimé");
    }
}