Digital Asset Links for the Android app (Trusted Web Activity).

Drop the assetlinks.json produced by PWABuilder or Bubblewrap into this
folder, next to this file, so it is served at:

    https://www.simeonatanasov.com/.well-known/assetlinks.json

It must contain the package name and the SHA-256 fingerprint of the key the
.aab is signed with. If you let Google Play sign the app, take the
fingerprint from Play Console under Setup > App integrity > App signing key
certificate, not from the local keystore, or the app will open with a
browser address bar showing.

Check it after deploying:
    https://developers.google.com/digital-asset-links/tools/generator

The .nojekyll file in the repo root is what makes GitHub Pages serve this
dot-folder at all. Do not delete it.
