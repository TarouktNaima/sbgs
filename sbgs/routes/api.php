<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\StagiaireController;
use Illuminate\Support\Facades\Route;

/* LOGIN */
Route::post('/login',[AuthController::class,'login']);

/* STAGIAIRES CRUD */
Route::apiResource('stagiaires', StagiaireController::class);

/* DOCUMENTS */
Route::post('/documents/upload',[DocumentController::class,'upload']);
Route::get('/stagiaires/{id}/documents',[DocumentController::class,'getByStagiaire']);
Route::delete('/documents/{id}',[DocumentController::class,'destroy']);

/* DASHBOARD */
Route::get('/dashboard/stats',[DashboardController::class,'stats']);
Route::get('/documents', [DocumentController::class, 'index']);


Route::post('/stagiaires', [StagiaireController::class, 'store']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/check-email', [AuthController::class, 'checkEmail']);
Route::post('/reset-password/{id}', [AuthController::class, 'resetPassword']);