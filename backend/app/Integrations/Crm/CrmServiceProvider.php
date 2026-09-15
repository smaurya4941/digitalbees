<?php

namespace App\Integrations\Crm;

use App\Integrations\Crm\Contracts\CrmClient;
use App\Integrations\Crm\Providers\HubSpotCrmProvider;
use App\Integrations\Crm\Providers\NullCrmProvider;
use Illuminate\Support\ServiceProvider;

class CrmServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CrmClient::class, function () {
            $config = config('services.crm');

            if ($config['driver'] === 'hubspot' && filled($config['api_key'])) {
                return new HubSpotCrmProvider($config['api_key'], $config['api_base_url']);
            }

            return new NullCrmProvider;
        });
    }
}
