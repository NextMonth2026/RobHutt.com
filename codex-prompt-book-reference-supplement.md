# Codex Prompt — Book reference supplement (applies across multiple prompts)

This is a small supplement that applies to several existing Codex prompts:
- `codex-prompt-flashbuzz.md` (Flashbuzz repo, Studio launch)
- `codex-prompt-hutt-studio-migration.md` (Flashbuzz repo, Projects migration)
- `codex-prompt-meetnorman.md` + `codex-prompt-meetnorman-supplement.md` (icemaker repo, MeetNorman rebuild)
- `codex-prompt-nextmonth-tighten.md` (icemaker repo, NextMonth.io funnel tightening)

Apply alongside whichever prompt is being run. Each integration is a small addition, not a structural change.

## Canonical book details

Use these values consistently. Store them in a constants file or design-tokens module so they can be updated in one place if Amazon URL or pricing changes:

- **Title:** Character X: How Transformation Actually Works
- **Author (on book):** Rob Daniel Hutt
- **Author (on websites and outreach):** Rob Hutt (casual form, used everywhere except book bibliographic data)
- **Format:** Paperback
- **Pages:** 230
- **Publication date:** 4 May 2026
- **Publisher:** NextMonth
- **ISBN-13:** 979-8195595715
- **ASIN (Amazon UK):** B0GZSKRXKV
- **Price (Amazon UK, list):** £12.99
- **Amazon UK URL:** https://www.amazon.co.uk/dp/B0GZSKRXKV
- **Cover image:** Use the Cloudinary-hosted asset Rob has supplied, not the Amazon-hosted thumbnail (Amazon's image URLs are not stable and are subject to their CDN rules). If no Cloudinary URL is yet available, the Codex agent should leave a `TODO` placeholder and flag it in the PR.

## Canonical book blurb (use verbatim where space permits)

> "You are mid-arc. So is everyone you serve.
>
> Every customer who walks into your business is in the middle of becoming someone. Every candidate you interview. Every audience you address. The transaction is incidental. The transformation is the point — and most businesses, careers, and creative practices fail because they cannot see it.
>
> *Character X* is a methodology for the people responsible for someone else's transformation, and for the people quietly in the middle of their own."

For shorter contexts, use just the first line: *"You are mid-arc. So is everyone you serve."*

## Where to add book references in each surface

### MeetNorman.io rebuild

- **About Rob section** (Section 7 in the original prompt). The "small linked logos" mentioned should include the book cover thumbnail linking to `https://www.amazon.co.uk/dp/B0GZSKRXKV`. The label under the cover reads "Character X — the methodology behind Norman."
- **No book mention in the hero or role grid.** The book is a credibility anchor, not the offer.
- **Footer.** Add the book to the footer link list: "Character X (book) — Amazon"

### NextMonth.io (funnel tightening)

- **CharacterX section** (existing on the page). The current "Learn about CharacterX" CTA should now link to `https://www.amazon.co.uk/dp/B0GZSKRXKV` rather than to an internal page.
- **Add a small "Read the book" callout** below the CharacterX explanation paragraph. Keep it understated:
  > "The methodology is documented in *Character X: How Transformation Actually Works* — paperback, £12.99 on Amazon."
- **Footer.** Add to the link list.

### Flashbuzz.co.uk

- **About / Bio area** (wherever Rob's biographical paragraph lives, e.g. on the home page or about page). Update the bio to mention the book as a credential alongside filmmaker work and FlashBuzz founder. One sentence is enough: *"Author of Character X: How Transformation Actually Works (NextMonth, 2026)."*
- **Hutt Studio Projects migration:** the Projects intro paragraph (which already mentions Rob's consulting background) can include a line: *"The methodology underlying both this work and Rob's wider thinking is documented in his book Character X (2026)."* Link to the Amazon page.
- **Studio tools pages:** no book reference needed. Studio is a product, not a thought-leadership surface.

### Caroline outreach campaign

- **Email body:** when Caroline introduces Rob, she should reference the book by title:
  > "I'm working with author and award-winning filmmaker Rob Hutt, who recently published *Character X: How Transformation Actually Works*..."
- **Email signature:** include a small link to the book in Caroline's footer, alongside the Norman cohort link. Format:
  > "Character X (book) | MeetNorman.io"
- **Reply emails (when Rob himself takes over the conversation):** Rob's signature can include the book as a credential line — same as Caroline's signature pattern.

## What NOT to do

- Do not promote the book as a primary call to action anywhere. The book is *credibility*, not *the offer*. The offer is hire Norman / use Studio / become a founding tenant.
- Do not link the book in places where the surface is product-focused (Studio tool pages, MeetNorman role cards, etc.). The book belongs in About / Methodology / Bio sections, not next to pricing.
- Do not duplicate the book blurb across multiple surfaces verbatim. Use it where it fits (MeetNorman About section, NextMonth CharacterX section); use shorter excerpts elsewhere.
- Do not change the author name on the book itself. The book uses "Rob Daniel Hutt" as a deliberate authorial choice. Websites use "Rob Hutt".
- Do not hardcode the Amazon URL across multiple components. Centralise in a constants file or config.
