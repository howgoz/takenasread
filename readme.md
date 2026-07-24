Taken as Read Photography

## Development

```
npm install
npm run dev    # watch mode, rebuilds css/styles.css
npm run build  # one-off minified build
```

Open `index.html` directly, or serve the folder with any static file server.

## Deploy (Cloudflare Pages, free)

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: Workers & Pages → Create → Pages → Connect to Git → select this repo.
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `/`
4. Deploy. Cloudflare builds `css/styles.css` and serves the static files on its global CDN with a free `*.pages.dev` URL (custom domains supported free too).
