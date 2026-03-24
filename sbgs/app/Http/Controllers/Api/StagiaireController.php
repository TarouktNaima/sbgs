<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stagiaire;
use App\Models\Document;

class StagiaireController extends Controller
{
    // afficher tous
    public function index()
    {
        return Stagiaire::with('documents')->get();
    }

    // ajouter stagiaire (public)
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required',
            'prenom' => 'required',
            'email' => 'required|email|unique:stagiaires,email',
        ]);

        // 📁 upload
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
            'service' => $request->service,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'statut' => $request->statut ?? 'Actif'
        ]);

        // 📄 save documents
        if ($cv) {
            Document::create([
                'stagiaire_id' => $stagiaire->id_stagiaire, // ✅ التصحيح المهم
                'type_document' => 'CV',
                'nom_fichier' => $cv,
            ]);
        }

        if ($convention) {
            Document::create([
                'stagiaire_id' => $stagiaire->id_stagiaire,
                'type_document' => 'Convention',
                'nom_fichier' => $convention,
            ]);
        }

        if ($rapport) {
            Document::create([
                'stagiaire_id' => $stagiaire->id_stagiaire,
                'type_document' => 'Rapport',
                'nom_fichier' => $rapport,
            ]);
        }

        return response()->json([
            "message" => "Stagiaire ajouté ✔️",
            "data" => $stagiaire
        ]);
    }

    public function show($id)
    {
        return Stagiaire::with('documents')->find($id);
    }

    public function update(Request $request, $id)
    {
        $stagiaire = Stagiaire::find($id);
        $stagiaire->update($request->all());

        return response()->json($stagiaire);
    }

    public function destroy($id)
    {
        $stagiaire = Stagiaire::find($id);
        $stagiaire->delete();

        return response()->json("deleted");
    }
}