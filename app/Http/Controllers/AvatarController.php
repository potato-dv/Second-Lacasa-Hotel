<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AvatarController extends Controller
{
    public function proxy(Request $request)
    {
        try {
            $url = $request->query('url');
            
            if (!$url) {
                Log::error('Avatar proxy: Missing URL parameter');
                return response()->json(['error' => 'URL parameter is required'], 400);
            }

            // Validate that the URL is a Google profile picture
            if (!str_contains($url, 'googleusercontent.com')) {
                Log::error('Avatar proxy: Invalid URL', ['url' => $url]);
                return response()->json(['error' => 'Invalid avatar URL'], 400);
            }

            Log::info('Avatar proxy: Attempting to fetch', ['url' => $url]);

            // Make the request with proper headers
            $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept' => 'image/*',
                'Accept-Language' => 'en-US,en;q=0.9',
                'Referer' => 'https://accounts.google.com/',
            ])->timeout(5)->get($url);
            
            if ($response->successful()) {
                Log::info('Avatar proxy: Successfully fetched image', [
                    'url' => $url,
                    'status' => $response->status(),
                    'contentType' => $response->header('Content-Type')
                ]);

                return response($response->body())
                    ->header('Content-Type', $response->header('Content-Type', 'image/jpeg'))
                    ->header('Cache-Control', 'public, max-age=3600');
            }

            Log::error('Avatar proxy: Failed to fetch image', [
                'url' => $url,
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            // Try to get the default Google profile picture
            $defaultUrl = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';
            
            Log::info('Avatar proxy: Attempting to fetch default image', ['url' => $defaultUrl]);
            
            $defaultResponse = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept' => 'image/*',
            ])->timeout(5)->get($defaultUrl);

            if ($defaultResponse->successful()) {
                Log::info('Avatar proxy: Successfully fetched default image', [
                    'url' => $defaultUrl,
                    'status' => $defaultResponse->status(),
                    'contentType' => $defaultResponse->header('Content-Type')
                ]);

                return response($defaultResponse->body())
                    ->header('Content-Type', $defaultResponse->header('Content-Type', 'image/jpeg'))
                    ->header('Cache-Control', 'public, max-age=3600');
            }

            Log::error('Avatar proxy: Failed to fetch default image', [
                'url' => $defaultUrl,
                'status' => $defaultResponse->status(),
                'body' => $defaultResponse->body()
            ]);

            return response()->json([
                'error' => 'Failed to fetch avatar',
                'details' => [
                    'original_status' => $response->status(),
                    'default_status' => $defaultResponse->status()
                ]
            ], 500);
        } catch (\Exception $e) {
            Log::error('Avatar proxy: Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Failed to fetch avatar',
                'details' => $e->getMessage()
            ], 500);
        }
    }
} 