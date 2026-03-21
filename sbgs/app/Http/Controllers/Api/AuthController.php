<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function login(Request $request)
    {

        $user = User::where('email',$request->email)->first();

        if(!$user || !Hash::check($request->password,$user->password))
        {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect'
            ],401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }
    
    

}