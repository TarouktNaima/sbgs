<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id('id_document');

            $table->unsignedBigInteger('stagiaire_id');

            $table->enum('type_document', ['CV', 'Convention', 'Rapport']);

            $table->string('nom_fichier');

            $table->timestamp('date_upload')->useCurrent();

            $table->timestamps();

            $table->foreign('stagiaire_id')
                ->references('id_stagiaire')
                ->on('stagiaires')
                ->onDelete('cascade');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
