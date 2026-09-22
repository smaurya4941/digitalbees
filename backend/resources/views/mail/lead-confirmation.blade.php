@extends('mail.layout')

@section('content')
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#0b1f3a;">{{ $heading }}</h1>
    <p style="margin:0 0 16px;">Hi {{ $name }},</p>
    <p style="margin:0 0 16px;">
        Thanks for getting in touch{{ $practice ? ' about '.$practice : '' }}. Your request has been routed to the accountable team.
    </p>
    <p style="margin:0 0 24px;padding:14px 16px;background:#fbf1dc;border-left:4px solid #c6963a;border-radius:4px;color:#1b1b1b;">
        <strong>What to expect:</strong> {{ $commitment }}.
    </p>
    <p style="margin:0;">If you need to add anything in the meantime, just reply to this email.</p>
@endsection
