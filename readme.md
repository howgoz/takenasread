Taken as Read Photography

## Adding or updating photos

No code editing required — just add image files and push.

1. Find the right folder for the photo:
   - `images/source/hero/` — background photos that rotate/crossfade on the homepage
   - `images/source/commercial/` — Commercial Work gallery
   - `images/source/artistic/` — Artistic Work gallery
2. Drag your photo file into that folder (any normal filename is fine — `.jpg`, `.jpeg`, or `.png`).
3. Commit and push to GitHub (see below if you're doing this through the GitHub website).
4. That's it. The site rebuilds itself automatically within a minute or two and the new photo appears — resized, thumbnailed, and added to the gallery/slideshow.

**To remove a photo:** delete its file from the same `images/source/...` folder, commit, push.

**To update a photo** (replace with a new version): delete the old file and add the new one (or just overwrite the file with the same name), commit, push.

### Doing this without using git/command line

You can do all of the above directly on github.com:
1. Go to the repo on GitHub and open the relevant `images/source/...` folder.
2. Click **Add file → Upload files**, drag your photo in, and click **Commit changes**.
3. To delete a photo, open the file, click the trash-can icon, and commit.

## Local development (optional, only if you want to preview changes on your own computer first)

```
npm install
npm run dev    # watch mode, rebuilds images + css/styles.css as you edit
npm run build  # one-off build (images + minified css)
```

Run `npm run build` at least once, then open `index.html` directly in a browser, or serve the folder with any static file server.

---

## Hosting on Cloudflare Pages (free) — step by step

This only needs to be done once. After it's set up, every push to GitHub (including just adding a photo) automatically redeploys the live site within a minute or two.

1. **Create a free Cloudflare account** at [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) if you don't have one already.
2. Log in to the Cloudflare dashboard.
3. In the left sidebar, click **Workers & Pages**.
4. Click **Create** → the **Pages** tab → **Connect to Git**.
5. Authorize Cloudflare to access your GitHub account if prompted, then select this repository.
6. On the build settings screen:
   - **Production branch**: `main` (or whichever branch you want live)
   - **Build command**: `npm run build`
   - **Build output directory**: `/`
7. Click **Save and Deploy**. The first build takes a minute or two — Cloudflare installs dependencies, resizes every photo, and builds the site.
8. When it finishes, you'll get a free working URL like `https://taken-as-read.pages.dev` — click it to see the live site.

From now on, any push to GitHub automatically triggers a new deploy. Adding a photo the "no code" way above is enough to update the live site.

## Adding your own domain (e.g. bought on Porkbun)

Once the site is live on a `*.pages.dev` URL, here's how to put your own domain (like `takenasread.com`) in front of it, for free.

1. **Buy the domain** on [Porkbun](https://porkbun.com) if you haven't already.
2. **Add the domain to Cloudflare** (this moves DNS management to Cloudflare, not the domain registration itself — you still own it through Porkbun):
   - In the Cloudflare dashboard, click **Add a domain** (or **Websites → Add a site**).
   - Enter your domain name and choose the **Free** plan.
   - Cloudflare will scan your existing DNS records (there likely aren't any important ones yet) and show you two **nameservers** (they look like `xxx.ns.cloudflare.com` and `yyy.ns.cloudflare.com`).
3. **Point your domain at those nameservers on Porkbun:**
   - Log in to Porkbun, go to your domain's management page.
   - Find the **Nameservers** (NS) section (Porkbun calls it "Authoritative Nameservers" or similar).
   - Replace Porkbun's default nameservers with the two Cloudflare gave you.
   - Save.
4. **Wait for it to activate.** This can take anywhere from a few minutes to a few hours (rarely up to 24-48h). Cloudflare will email you once the domain is active, and the dashboard will show a green "Active" status next to the domain.
5. **Connect the domain to your Pages site:**
   - Go back to **Workers & Pages** → your Pages project → the **Custom domains** tab.
   - Click **Set up a custom domain**, type your domain (e.g. `takenasread.com`), and confirm.
   - Repeat for `www.takenasread.com` if you want both the bare domain and the `www` version to work.
   - Cloudflare automatically creates the required DNS records and issues a free SSL certificate — no manual DNS editing needed at this step since the domain now lives on Cloudflare.
6. Within a few minutes, your domain will serve the live site with HTTPS automatically enabled.

That's the whole process — no ongoing cost for hosting or SSL, only the yearly domain renewal fee through Porkbun.
