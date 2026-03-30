<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{

    // ================= LOGIN =================
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ], [
            'email.required' => 'Email obligatoire',
            'email.email' => 'Email invalide',
            'password.required' => 'Mot de passe obligatoire'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'service' => $user->service
            ]
        ]);
    }


    // ================= FORGOT PASSWORD =================
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ], [
            'email.required' => 'Email obligatoire',
            'email.email' => 'Email invalide'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email non trouvé'
            ], 404);
        }

        // ⚠️ هنا دير غير simulation حيث ماعندكش email config
        return response()->json([
            'message' => 'Lien envoyé (simulation)',
            'user_id' => $user->id
        ]);
    }


    // ================= CHECK EMAIL =================
    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ], [
            'email.required' => 'Email obligatoire',
            'email.email' => 'Email invalide'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email non trouvé'
            ], 404);
        }

        return response()->json([
            'message' => 'Email OK',
            'user_id' => $user->id
        ]);
    }


    // ================= RESET PASSWORD =================
    public function resetPassword(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|min:6|confirmed'
        ], [
            'password.required' => 'Le mot de passe est obligatoire',
            'password.min' => 'Le mot de passe doit contenir au moins 6 caractères',
            'password.confirmed' => 'Les mots de passe ne correspondent pas'
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        try {
            $user->password = Hash::make($request->password);
            $user->save();

            return response()->json([
                'message' => 'Mot de passe changé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du changement'
            ], 500);
        }
    }
}