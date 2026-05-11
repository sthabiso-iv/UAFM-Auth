# auth.apply.org.za

Web-based Google OAuth relay for the **UniApplyForMe** mobile app (Flutter/FlutterFlow).

## What this service does

Google Sign-In via the native Android SDK requires SHA-1 keystore credentials that differ across debug and release builds, and become a source of breakage when FlutterFlow rebuilds the app or keystore details change. By routing all Google auth through this web service, the mobile app avoids native OAuth entirely.

**Flow:**

1. The app opens `https://auth.apply.org.za/login` in a browser tab or in-app browser.
2. The user taps "Continue with Google" and completes the OAuth flow hosted by Google/Supabase.
3. Supabase redirects back to `https://auth.apply.org.za/auth/callback` with a short-lived `code`.
4. The route handler exchanges the code for a session server-side, then immediately redirects the browser to `https://app.apply.org.za/auth/callback?access_token=…&refresh_token=…`.
5. Android App Links (verified via `assetlinks.json`) intercept that HTTPS URL and open the app directly — no browser chooser dialog.
6. The Flutter app reads the tokens from the incoming URL and calls `Supabase.instance.client.auth.setSession(…)`.

The service has no database, no session storage, no user-facing dashboard. It is a pure relay.

---

## Deployment

Deploy to **Vercel** or any Node.js-compatible host.

> **Before building**, delete the scaffolding stub that must not exist alongside `page.tsx`:
> ```bash
> rm app/auth/callback/route.ts
> ```
> Next.js does not allow `route.ts` and `page.tsx` in the same route segment. The `/auth/callback`
> route is handled entirely by `page.tsx` (a Server Component). The `route.ts` file in that
> directory is a leftover stub and must be deleted before running `next build`.

```bash
rm app/auth/callback/route.ts   # required — see note above
npm install
npm run build
```

Set the following environment variables on the host:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL, e.g. `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

The `next.config.ts` sets `output: 'standalone'` for easy containerised deployment.

---

## Supabase configuration

In the Supabase dashboard, go to **Authentication → URL Configuration** and add the following to the **Redirect URLs** allow-list:

```
https://auth.apply.org.za/auth/callback
```

---

## Google Cloud Console configuration

In the [Google Cloud Console](https://console.cloud.google.com), open the **Web** OAuth 2.0 client (not the Android client — no Android client is needed). Under **Authorised redirect URIs**, add:

```
https://auth.apply.org.za/auth/callback
```

The Web client handles all platforms. No Android OAuth client configuration is required.

---

## Android App Links: assetlinks.json

`public/.well-known/assetlinks.json` in this repo is a **reference copy only**.

Because `app.apply.org.za` is a **Cloudflare Worker**, the file cannot be served as a static asset — it must be returned directly from the worker script. Add the following route handler **before any other routing logic** in the `app.apply.org.za` worker:

```js
if (url.pathname === '/.well-known/assetlinks.json') {
  return new Response(JSON.stringify([{
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "za.org.apply.mobile",
      "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
    }
  }]), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}
```

### Getting your SHA-256 fingerprint

- **FlutterFlow:** Settings → Mobile Deployment → Android → SHA-256
- **Raw Flutter / keytool:**
  ```bash
  keytool -list -v -keystore your-key.jks
  ```
  Copy the **SHA-256** value (not SHA-1). Format: `AB:CD:EF:…` (colon-separated uppercase hex).

Replace `YOUR_SHA256_FINGERPRINT_HERE` with that value.

---

## AndroidManifest.xml

In FlutterFlow (or raw Flutter), add the following `<intent-filter>` inside the `<activity>` tag:

```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="app.apply.org.za" />
</intent-filter>
```

`android:autoVerify="true"` tells Android to verify domain ownership via `assetlinks.json`. Once verified, the deep link opens directly in the app without a browser chooser dialog.

---

## Migrating away from FlutterFlow

This auth service is framework-agnostic. When migrating to raw Flutter, nothing changes on the `auth.apply.org.za` side. On the Flutter side:

1. Add the [`app_links`](https://pub.dev/packages/app_links) package to intercept the incoming HTTPS deep link.
2. Parse the `access_token` and `refresh_token` query parameters from the URL.
3. Restore the Supabase session:

```dart
await Supabase.instance.client.auth.setSession(
  accessToken: accessToken,
  refreshToken: refreshToken,
);
```

---

## Security notes

- The `/login` page validates the `redirect_to` query parameter and only allows URLs beginning with `https://app.apply.org.za/` or `https://apply.org.za/`, preventing open redirect attacks.
- Tokens are never logged or stored server-side — they exist only in the redirect URL for the duration of the HTTP 302 response.
- `next.config.ts` sets `X-Frame-Options: DENY` and a strict `Content-Security-Policy` to prevent clickjacking.
- `robots.txt` is set to `noindex, nofollow`; this service should not appear in search results.

---

## Local development

```bash
cp .env.local .env.local   # fill in your Supabase credentials
npm install
npm run dev
```

The app will be available at `http://localhost:3000`. For end-to-end testing of the deep link redirect, you will need a real device with the app installed and the `app.apply.org.za` Cloudflare Worker serving the correct `assetlinks.json`.
