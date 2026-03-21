<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Document;

class DocumentController extends Controller
{

    // ✅ GET ALL
    public function index()
    {
        return Document::with('stagiaire')->get();
    }

    // ✅ UPLOAD
    public function upload(Request $request)
    {
        $request->validate([
            'stagiaire_id' => 'required',
            'type_document' => 'required',
            'file' => 'required|file|mimes:pdf,doc,docx'
        ]);

        $path = $request->file('file')->store('documents', 'public');

        Document::create([
            'stagiaire_id' => $request->stagiaire_id,
            'type_document' => $request->type_document,
            'nom_fichier' => $path
        ]);

        return response()->json(['message' => 'uploaded']);
    }

    // ✅ DELETE
    public function destroy($id)
    {
        $doc = Document::find($id);

        if (!$doc) {
            return response()->json(['message' => 'not found'], 404);
        }

        $doc->delete();

        return response()->json(['message' => 'deleted']);
    }
}