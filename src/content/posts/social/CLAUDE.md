# Social content conventions for blog posts

This folder stores platform-ready social copy for blog posts published on the portfolio.

## Folder structure

- `src/content/posts/social/<post-slug>/linkedin.md`
- `src/content/posts/social/<post-slug>/x.md`

Each blog post should get its own folder so the social copy stays tied to the blog slug.

## Source material

Every social post should be grounded in the actual assets that already exist for the blog:

1. the blog post in `src/content/posts/<slug>.mdx`
2. the related Remotion promo video in `src/remotion/blogs/<slug>/`
3. the real demo components used in the article

Do not invent new angles that are not supported by the blog, video, or demos.

## Writing goals

- Optimize for clarity and quality, not hype
- Explain the core idea in simple language
- Keep the copy aligned with the actual article structure and examples
- Point readers to the portfolio post for the full explanation and interactive demos
- Assume the Remotion promo video will be attached when posting

## LinkedIn guidance

* **The Hook:** Lead with a "Negative vs. Positive" technical hook. (e.g., "Why $X$ feels slow vs. how $Y$ makes it performant"). Address a common pain point engineers face.
* **The "Why" over the "What":** Don't just list features. Explain the underlying engineering reason (e.g., "Rendering pipelines," "B-Trees," "Event loops"). 
* **High-Signal Skimmability:** * Use 3-4 bullet points to summarize the "Aha!" moments.
    * Use bolding for technical terms to catch the eye of senior peers.
* **The "Interactive" Factor:** Always highlight the interactive demos or real-world examples. This is your unique selling point.
* **CTA (Call to Action):** Use a clear "👉" emoji followed by the canonical URL.
* **The "P.S." Strategy:** Mention the attached Remotion video in a post-script or a final sentence to connect the copy to the media.
* **Tone:** Authoritative yet helpful. Avoid "low-effort" hype (e.g., "Game changer! 🚀"). Use "Senior Engineer" vocabulary (e.g., "Architecture," "Optimization," "Internals").

## X guidance (Pro Tier - 25,000 Chars)

* **Single post format:** No threads. Write one self-contained post: Hook → Value → CTA.
* **The Hook:** Lead with a bold technical claim or a relatable pain point. (e.g., "Animating layout properties like width/height is a performance trap.")
* **The Value:** 2-4 sentences summarizing what the post covers and why it matters. Mention key concepts, interactive demos, or unique angles. Keep it punchy — a long-form post is not an essay.
* **CTA:** End with the canonical portfolio URL so readers can dive into the full breakdown.
* **Remotion Video:** Always attach the promo video to maximize the "Stop the scroll" effect.
* **Tone:** Direct and technical. No hashtag spam — skip hashtags on X entirely.

## Recommended checklist

Before saving new social copy, confirm it:

- reflects the real blog content
- matches the Remotion promo that's being attached
- references the real demos or examples from the post
- includes the canonical portfolio URL
- is ready to copy-paste without rewriting
