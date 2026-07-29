# X post copy

Attach the Git Internals Remotion promo video (or the screen-capture teaser of a demo) to this post.

## Ready to post

When Git breaks, you paste the error into Claude, get a command, and move on — still not knowing what happened. AI hands you the command but lets you skip the mental model. And underneath, Git is shockingly simple: an object store + a few pointers.

A branch isn't a heavy parallel copy — it's a ~41-byte file holding one commit hash. HEAD is a pointer to a pointer. A commit is just a tree hash + parent + author + message, all SHA-1'd. Once you see that, "scary" commands are just: write an object, move a pointer.

I wrote an interactive deep dive — hash content live, watch .git/objects fill up as you commit, snapshots vs diffs, and a real commit graph you can drive while the refs/ files change underneath:
https://umersagheer.dev/posts/git-internals
