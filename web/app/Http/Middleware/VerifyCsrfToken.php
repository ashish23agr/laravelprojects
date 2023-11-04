<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'api/graphql',
        'api/webhooks',
		'api/add-design',
		'api/settings',
		'api/viewdesign/*',
        'api/editdesign/*',
		'api/remove-design/*',
		'api/remove-print/*',
		'api/getdmsettings',
    ];
}
