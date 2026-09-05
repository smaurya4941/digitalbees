<?php

namespace App\Modules\Lead\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeadAdminResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'source_page_id' => $this->source_page_id,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'company' => $this->company,
            'message' => $this->message,
            'form_type' => $this->form_type,
            'utm' => $this->utm,
            'score' => $this->score,
            'status' => $this->status,
            'crm_reference_id' => $this->crm_reference_id,
            'ip_address' => $this->ip_address,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
