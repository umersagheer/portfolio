# LinkedIn post copy

Attach the Git Internals Remotion promo video (or the screen-capture teaser of a demo) to this post.

## Ready to post

A rebase goes sideways. A branch "disappears." You paste the error into Claude, it hands you a command, it works — and you still have no idea what just happened.

That's the trap: AI is great at handing you the *command*, but it quietly lets you skip the *mental model*. So I stopped collecting commands and went into `.git/` to see what Git actually keeps on disk.

It turns out to be two things: an **object store**, and a handful of **pointers** into it. That's the whole machine.

I just published an interactive deep dive into how Git really works — built from the ground up, meant to be played with.

What's inside:

**Content-addressable storage:** Git names things by a hash of their content, not a filename. Same bytes ⇒ same hash ⇒ stored once. I show the exact bytes it hashes (`blob <size>\0<content>`) and why a one-character change scrambles the whole hash.

**Three objects, stacked:** A **blob** is your file's raw bytes. A **tree** names blobs (the directory listing). A **commit** points at a tree and adds history — author, message, parent. Change one file → new blob → new tree → new commit. That cascade is why history is tamper-evident.

**Snapshots, not diffs:** Every commit is a full snapshot, but unchanged files reuse the exact same blob — so it costs almost nothing. Diffs aren't stored; Git computes them on demand by comparing two snapshots.

**Branches & HEAD are just pointers:** A branch is a ~41-byte file holding one commit hash. `HEAD` is a pointer to a pointer — it holds the *name of a branch*. "Moving" a branch is one line of text being rewritten. That's it.

I didn't just write about it — I built interactive demos so you can hash content live, watch `.git/objects` fill up as you stage and commit, step through snapshots vs diffs, and drive a real commit graph — commit, branch, checkout, merge — while watching the actual `refs/` files change underneath.

Once you can see the objects and the pointers, every "scary" command becomes obvious: it's just *write an object* and *move a pointer*.

Read the full breakdown and play with the demos here:
👉 https://umersagheer.dev/posts/git-internals

(P.S. The attached clip is one of the interactive demos from the post — the full article has several more you can poke at.)

#Git #VersionControl #SoftwareEngineering #WebDevelopment #DeveloperTools
