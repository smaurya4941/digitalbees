<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $heading ?? 'TeamBees' }}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f2;font-family:Inter,Arial,Helvetica,sans-serif;color:#1b1b1b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
                    <tr>
                        <td style="background:#0b1f3a;padding:20px 32px;border-bottom:3px solid #c6963a;">
                            <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:.02em;">TeamBees</span>
                            <span style="color:#e9d9ae;font-size:12px;letter-spacing:.14em;text-transform:uppercase;margin-left:8px;">Building on trust</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;font-size:16px;line-height:1.6;">
                            @yield('content')
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 32px;background:#f4f4f2;font-size:13px;color:#4a4a4a;line-height:1.5;">
                            You are receiving this because you submitted a form on teambeescorp.com.
                            We only use your details to respond to your request.
                            Questions? Reply to this email or write to
                            <a href="mailto:{{ config('mail.from.address') }}" style="color:#0b1f3a;">{{ config('mail.from.address') }}</a>.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
