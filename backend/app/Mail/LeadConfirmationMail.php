<?php

namespace App\Mail;

use App\Modules\Lead\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Transactional confirmation sent when a lead is captured (blueprint §28.3:
 * mirrors the on-screen confirmation copy, so the commitments below and
 * `getSlaMessage()` in ContactFormPanel.tsx must stay in step).
 */
class LeadConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    /** persona => [heading, response commitment] */
    private const COMMITMENTS = [
        'hire' => ['Talent Bench Request Received', 'Shortlist overview delivered within 1 business day'],
        'delivery' => ['Consultation Request Received', 'Practice Director outreach within 4 business hours'],
        'partner' => ['Partnership Inquiry Received', 'Turnaround within 2 business hours'],
        'press' => ['Media Inquiry Received', 'Communications Desk response within 2 business hours'],
    ];

    public function __construct(
        public readonly Lead $lead,
        public readonly ?string $persona = null,
    ) {
        $this->afterCommit();
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->heading().' — TeamBees');
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.lead-confirmation',
            text: 'mail.lead-confirmation-text',
            with: [
                'name' => $this->firstName(),
                'heading' => $this->heading(),
                'commitment' => $this->commitment(),
                'practice' => $this->lead->practice?->name,
            ],
        );
    }

    public function heading(): string
    {
        return $this->resolved()[0];
    }

    public function commitment(): string
    {
        return $this->resolved()[1];
    }

    /** @return array{0: string, 1: string} */
    private function resolved(): array
    {
        return self::COMMITMENTS[$this->persona ?? ''] ?? match ($this->lead->form_type) {
            'demo_request' => ['Consultation Request Received', 'A specialist will respond within 1 business day'],
            default => ['Message Received', 'We typically respond within 1–2 business days'],
        };
    }

    private function firstName(): string
    {
        $first = explode(' ', trim($this->lead->full_name))[0];

        return $first !== '' ? $first : 'there';
    }
}
