<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stagiaire extends Model
{
    protected $primaryKey = 'id_stagiaire';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'service',
        'date_debut',
        'date_fin',
        'statut'
    ];

    public function documents()
    {
        return $this->hasMany(Document::class, 'stagiaire_id', 'id_stagiaire'); // ✅ تصحيح relation
    }
}