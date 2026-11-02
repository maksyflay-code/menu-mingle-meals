<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Orders are sent via WhatsApp click-to-chat links (no WhatsApp API, no database); restaurant config and menu live in src/lib/menu.ts. Why: client wants the simplest setup with zero per-message cost.
- Prerender both public routes and export only verified client HTML/assets with scripts/export-locaweb.mjs for Apache shared hosting; keep the TanStack Start Worker configuration for Lovable. Why: shared hosting cannot execute the server bundle, and delivery query parameters must remain browser-readable.
- External static exports materialize relative Lovable asset pointers at their original URL paths using the public Lovable deployment, validating media type and size. Why: external hosts do not provide Lovable's asset proxy, and source media must remain CDN pointers.
- Temporary generated menu photos use bundled imports; unused legacy CDN pointers stay in hosting/legacy-assets rather than src/assets. Why: static exports must include only active media without deleting assets needed by earlier deployments.
