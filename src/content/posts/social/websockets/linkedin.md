# LinkedIn post copy

Attach the WebSockets Remotion promo video to this post.

## Ready to post

Silent connection drops. Vanishing messages at scale. "Ghost" clients that your server keeps talking to long after the laptop lid closed.

Most WebSocket pain comes from not understanding what's happening beneath the abstraction. I wanted to go past the Socket.IO docs and into the protocol itself.

I just published a deep dive into the engineering behind real-time: from the raw protocol to production-grade scaling patterns.

What's inside the guide:

**The HTTP Upgrade Handshake:** Every WebSocket connection starts as a plain HTTP request. I walk through the `Upgrade` header, the `101 Switching Protocols` response, and the SHA-1 key proof that prevents cross-protocol attacks.

**Frames, Opcodes & Ghost Connections:** Once the handshake completes, HTTP disappears and binary frames take over. I break down the wire format — FIN bits, opcodes (`0x1` text, `0x9` ping, `0xA` pong), client-side masking — and show how ping-pong heartbeats detect dead connections before they pile up.

**The Envelope Pattern:** Raw WebSocket gives you a pipe, not a protocol. The Envelope Pattern adds self-describing structure (type, id, payload, metadata) at ~120 bytes of overhead per message vs. ~800 bytes for an equivalent HTTP request.

**Pub/Sub Scaling with Redis:** A single server can't see every client. I show how a Redis broker lets multiple servers publish and subscribe so a message sent to Server 1 reaches a client on Server 2 — and when to reach for Kafka, NATS, or RabbitMQ instead.

I didn't just write about it — I built 7 interactive demos so you can step through the handshake, kill a client to watch ghost detection in action, toggle broadcast vs. unicast vs. multicast routing, and compare single-server vs. multi-server + Redis topologies.

Check out the full breakdown and play with the demos here:
👉 https://umersagheer.dev/posts/websockets

(P.S. The attached video walks through persistent tunnels, the envelope structure, the readyState lifecycle, and pub/sub architecture — all animated with Remotion!)

#WebSockets #WebDevelopment #SystemDesign #Backend #RealTime
