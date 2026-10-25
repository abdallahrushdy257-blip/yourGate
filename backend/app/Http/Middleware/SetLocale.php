<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Supported locales.
     */
    protected array $supportedLocales = ['ar', 'en'];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->header('X-Locale') 
            ?? $request->getPreferredLanguage($this->supportedLocales) 
            ?? config('app.locale', 'ar');

        if (in_array($locale, $this->supportedLocales, true)) {
            app()->setLocale($locale);
        } else {
            app()->setLocale('ar');
        }

        return $next($request);
    }
}
