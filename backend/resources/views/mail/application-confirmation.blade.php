@extends('mail.layout')

@section('content')
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#0b1f3a;">Application received</h1>
    <p style="margin:0 0 16px;">Hi {{ $name }},</p>
    <p style="margin:0 0 16px;">
        Thank you for applying for <strong>{{ $jobTitle }}</strong>. Our talent team typically responds within 5 business days.
    </p>
    <p style="margin:0 0 8px;"><strong>What happens next</strong></p>
    <ol style="margin:0 0 16px;padding-left:20px;">
        <li>We review your background against the role.</li>
        <li>If it looks like a fit, a recruiter will contact you to arrange a conversation.</li>
        <li>Whatever the outcome, you will hear from us.</li>
    </ol>
    <p style="margin:0;">Need to update something? Reply to this email.</p>
@endsection
