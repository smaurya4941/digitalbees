<?php

namespace App\Mail;

use App\Modules\Career\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Confirmation for a submitted job application. The "5 business days" line
 * mirrors the on-screen success state in JobApplicationForm.tsx (blueprint §33.3).
 */
class JobApplicationConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    public function __construct(public readonly JobApplication $application)
    {
        $this->afterCommit();
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'We received your application — '.$this->jobTitle());
    }

    public function content(): Content
    {
        $first = explode(' ', trim($this->application->full_name))[0];

        return new Content(
            view: 'mail.application-confirmation',
            text: 'mail.application-confirmation-text',
            with: [
                'name' => $first !== '' ? $first : 'there',
                'jobTitle' => $this->jobTitle(),
            ],
        );
    }

    private function jobTitle(): string
    {
        return $this->application->job?->title ?? 'your application';
    }
}
