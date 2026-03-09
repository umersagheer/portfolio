# LinkedIn post copy

Attach the Layout Animations Remotion promo video to this post.

## Ready to post

Most explanations of layout animations start at the API surface.

I wanted to start one layer lower: what is the browser actually doing when a box changes `width` or `height`, and why does that feel heavier than animating `transform`?

In this new post, I break layout animations down from browser internals to Framer Motion:

- why `width`, `height`, `top`, and `left` trigger layout work
- why `transform` and `opacity` are the safe, composited properties
- how the FLIP technique bridges real layout changes with smooth motion
- where `layout`, `layoutId`, `AnimatePresence`, and spring physics fit in

I also built interactive demos for each concept: transform vs layout, a FLIP explainer, shared `layoutId` transitions, `AnimatePresence`, spring tuning, and a morphing dialog example from this portfolio.

And I turned the article into a short Remotion promo video so the core idea is easier to scan before diving deeper.

If you want the full breakdown, the article and demos are live here:
https://umersagheer.dev/posts/layout-animations
