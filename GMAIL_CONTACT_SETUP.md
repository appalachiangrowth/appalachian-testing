# Gmail Contact Form Setup

The contact form sends submissions through Gmail SMTP to `appalachiangrowth@gmail.com`.

Set these server-side environment variables wherever the app is deployed:

```env
SMTP_USER="appalachiangrowth@gmail.com"
SMTP_PASS="your-16-character-gmail-app-password"
CONTACT_EMAIL="appalachiangrowth@gmail.com"
```

`SMTP_PASS` must be a Gmail App Password, not the regular Gmail account password. The value must remain server-side; do not add it to frontend code, commit it to Git, or expose it as a `NEXT_PUBLIC_*` variable.

When a visitor submits the form, the server validates the required fields, sends the formatted notification email, and replies to the visitor's address when you select Reply in Gmail. Database persistence is attempted when `DATABASE_URL` is available, but email delivery remains functional in a local or preview environment without a database.

The local development configuration is stored in the ignored `.env.local` file. If this app is deployed to another host, copy the variables above into that host's private environment-variable settings and restart the application.
