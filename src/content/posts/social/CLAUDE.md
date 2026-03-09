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

## X guidance (Free Tier - 280 Chars)

* **The "Hook" Tweet (1/X):** * Must be under 280 characters. 
    * Lead with a bold claim or a technical "Why." (e.g., "Animating layout properties like width/height is a performance trap. 🪤")
    * End the first tweet with a "thread" emoji 🧵 to signal there is more value below.
* **The "Value" Middle (2-4/X):** * Break the technical explanation into 2-3 supporting tweets.
    * Focus on one concept per tweet (e.g., Tweet 2: The Problem, Tweet 3: The FLIP solution).
    * Use 2-3 hashtags max per thread (e.g., #webdev #frontend).
* **Character Conservation:** * Links take up exactly **23 characters** regardless of actual length. 
    * Emojis count as **2 characters** each. 
    * Media (images/Remotion video) does **NOT** count against the 280-character text limit.
* **The "Anchor" Conclusion:** * The final tweet must contain the CTA and the link to the full post.
    * Encourage a "Bookmark" 🔖—the 2026 algorithm prioritizes bookmarks over likes.
* **Remotion Video:** Always attach the promo video to the **first tweet** of the thread to maximize the "Stop the scroll" effect.

## Recommended checklist

Before saving new social copy, confirm it:

- reflects the real blog content
- matches the Remotion promo that's being attached
- references the real demos or examples from the post
- includes the canonical portfolio URL
- is ready to copy-paste without rewriting
