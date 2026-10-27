# ZG HighLevel Devs portfolio (redesign)

Upload this whole folder to your host (Netlify, Vercel, cPanel, GitHub Pages). Keep the folder structure as is.

index.html
assets/css/styles.css   all styles (colour and type tokens at the top)
assets/js/main.js       menu, live pipeline, form, copy email, lazy Calendly
assets/img/             WebP images (about 330 KB in total, previously 2.7 MB)

## Contact form
Open assets/js/main.js and set CONFIG.FORM_ENDPOINT to a GoHighLevel inbound
webhook or a Formspree URL. Until you do, the form opens the visitor's email
app with the message filled in.

## Videos
The .mov review videos now load as .mp4 from Cloudinary, which converts them
automatically, so they play in Chrome and Firefox as well as Safari.
