<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $primaryKey = 'id_document';

    protected $fillable = [
        'stagiaire_id',
        'type_document',
        'nom_fichier'
    ];

    public function stagiaire()
    {
        return $this->belongsTo(Stagiaire::class, 'stagiaire_id', 'id_stagiaire'); // ✅ زيدنا id_stagiaire
    }
    
}