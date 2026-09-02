<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;

/**
 * Base for all v1 controllers. Controllers stay thin: validate via Form
 * Requests, delegate to a module Service, and shape output with an API
 * Resource plus App\Support\Http\ApiResponse.
 */
abstract class ApiController extends Controller {}
