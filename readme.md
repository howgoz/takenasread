Taken as Read Photography

## Adding photos (no code changes needed)

Drop a new photo into one of these folders:

- `images/source/hero/` — rotates through the homepage background
- `images/source/commercial/` — Commercial Work gallery
- `images/source/artistic/` — Artistic Work gallery

Commit and push. The next build resizes it, generates thumbnails, and adds
it to the site automatically — nothing else to edit. To remove a photo,
delete its file from the matching `images/source/...` folder.

## Development

```
npm install
npm run dev    # watch mode, rebuilds images + css/styles.css
npm run build  # one-off build (images + minified css)
```

Run `npm run build` at least once, then open `index.html` directly, or serve
the folder with any static file server.

## Deploy (Cloudflare Pages, free)

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: Workers & Pages → Create → Pages → Connect to Git → select this repo.
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `/`
4. Deploy. Cloudflare installs dependencies, resizes all photos, builds
   `css/styles.css`, and serves the static files on its global CDN with a
   free `*.pages.dev` URL (custom domains supported free too). Every future
   push (including just adding a photo) redeploys automatically.
