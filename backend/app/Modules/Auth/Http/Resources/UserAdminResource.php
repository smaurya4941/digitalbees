<?php

namespace App\Modules\Auth\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserAdminResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'role' => $this->roles->first()?->name,
            'last_login_at' => $this->last_login_at,
            'invitation_sent_at' => $this->invitation_sent_at,
            'created_at' => $this->created_at,
        ];
    }
}
