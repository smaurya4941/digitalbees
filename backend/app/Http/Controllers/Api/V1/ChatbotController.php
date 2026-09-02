<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Lead module (app/Modules/Lead): chatbot_conversations, plus an AI provider integration.
 * "Bee Assistant": appends to the session transcript, returns the assistant
 * reply, and promotes the conversation to a lead when contact intent is detected.
 */
class ChatbotController extends ApiController
{
    public function message(Request $request): JsonResponse
    {
        $request->validate([
            'session_id' => ['required', 'string', 'max:100'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        return ApiResponse::notImplemented('ChatbotService::reply(session_id, message); POST /api/v1/chatbot/message');
    }
}
