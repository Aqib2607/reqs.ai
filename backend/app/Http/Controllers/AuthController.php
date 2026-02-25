<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'company' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'company' => $validated['company'] ?? null,
            'role' => $validated['role'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'plan' => 'free',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($validated)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function redirectToProvider($provider)
    {
        /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
        $driver = Socialite::driver($provider);
        return $driver->stateless()->redirect();
    }

    public function handleProviderCallback($provider)
    {
        try {
            /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
            $driver = Socialite::driver($provider);
            $socialUser = $driver->stateless()->user();
        } catch (\Exception $e) {
            return redirect(config('app.frontend_url', 'http://localhost:5173') . '/login?error=social_auth_failed');
        }

        $user = User::where($provider . '_id', $socialUser->getId())
            ->orWhere('email', $socialUser->getEmail())
            ->first();

        if ($user) {
            $user->update([
                $provider . '_id' => $socialUser->getId(),
                'avatar' => $socialUser->getAvatar(),
            ]);
        } else {
            $user = User::create([
                'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'Social User',
                'email' => $socialUser->getEmail(),
                'google_id' => $provider === 'google' ? $socialUser->getId() : null,
                'github_id' => $provider === 'github' ? $socialUser->getId() : null,
                'avatar' => $socialUser->getAvatar(),
                'plan' => 'free',
                'email_verified_at' => now(),
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');

        // Redirect to a frontend route that will handle the token
        return redirect($frontendUrl . '/social-callback?token=' . $token . '&user=' . urlencode(json_encode($user)));
    }
}
