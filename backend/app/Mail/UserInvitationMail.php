<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UserInvitationMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(public readonly User $user) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'You have been invited to the TeamBees back office');
    }

    public function content(): Content
    {
        $base = rtrim((string) (config('frontend.urls')[0] ?? 'http://localhost:3000'), '/');

        return new Content(
            htmlString: view()->exists('mail.user-invitation')
                ? view('mail.user-invitation', ['user' => $this->user, 'url' => $this->acceptUrl($base)])->render()
                : sprintf(
                    '<p>Hi %s,</p><p>An administrator has invited you to the TeamBees back office. '
                    .'Set your password to get started:</p><p><a href="%s">%s</a></p>'
                    .'<p>This link expires in 7 days.</p>',
                    e($this->user->name),
                    e($this->acceptUrl($base)),
                    e($this->acceptUrl($base)),
                ),
        );
    }

    private function acceptUrl(string $base): string
    {
        return $base.'/admin/accept-invite?token='.$this->user->invitation_token;
    }
}
