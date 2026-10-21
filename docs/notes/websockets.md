Introduction
Have you ever opened a YouTube video to learn real-time applications only to watch someone import a paid third-party
service, call it a day, and leave you with zero understanding of how websockets actually work? You know, the
exact thing that interviewers will grill you on. You know the vibe. They drag and drop a library, use a blackbox API, and
tell you it's magic. But then you walk into an interview and they ask you to explain the 101 handshake, ghost
connections, realtime message patterns, or head-ofline blocking, aka why streams
freeze, and suddenly that magic disappears. In 2026, anyone can pay for
a service or generate code with AI. But engineers, engineers build the service.
Hi there and welcome to the course that skips the as a service shortcut and
teaches you how to engineer realtime apps from the ground up. And here's my
promise. By the end of this video, websockets won't feel like magic anymore. First, you'll understand the
core mechanics of websockets. How a websocket starts life as HTTP. what the
101 switching protocols response actually does and how full duplex communication lets the server push data
instantly. Then we go from theory to production. You'll learn how to keep thousands of
connections stable, how ghost connections silently kill servers, how pingpong heartbeats keep everything
alive, and how to structure messages so your server always knows the intent. And once that's locked in, we'll cover the
patterns that power every serious real-time product. Broadcast versus uniccast versus rooms, pub and sub
architecture for live sports and large scale event streams, acknowledgements for reliability, how back pressure
forms, how real systems avoid memory blowups, and when websockets are not
even the right tool. That's a lot to learn, right? And the best part is that's just the foundation because once
the fundamentals are locked in, you'll take everything you've learned and build sports, a highfidelity live sports match
engine that broadcast scores and playby-play commentary in under 10
milliseconds. And you'll build it by using a real production stack. NodeJS for the fast
event-driven core. Express for the handshake and rest APIs. Native
websockets using the WS library. So we implement the protocol from scratch for
maximum control. Postgress for storing sport matches and commentaries and the
Drizzle OM for type- safe database interactions. Then we ship it like an actual production app. We'll use Arjet
to secure the real-time system, blocking bots, rate limiting abuse, and stopping
DDoS attempts before they even hit your logic. We'll use React to build a high
performance UI that updates like a stadium scoreboard in real time. We'll use site 24/7 to monitor server health,
user experience, and network latency so that 10 millisecond broadcast target stays consistent even under load. And
while we build this, we're not sacrificing code quality. You'll implement clean industry standard
practices with the help of Code Rabbit, your AI code reviewer that catches
architectural flaws before they reach production. Finally, we'll deploy it using Hostinger. So, here's my promise.
This course is enough to lock in your real-time fundamentals and let your
confidence speak in any interview. You won't just say, "Yeah, I can build a chat app." You'll explain exactly how
the data moves through the wire. Look, if you're serious about leveling up from watching tutorials to actually becoming
higher ready, you'll love JS Mastery Pro. It's where I go beyond the build
this app stuff and teach the engineering mindset behind the code. Inside Pro, you
get full premium courses like the ultimate Nex.js, JS testing, animations, JavaScript, SQL, 3JS, and more. Quizzes
after every lesson, so you actually lock in what you learn. Interview practice with our AI interviewer, so you can
train for real technical interviews the same way you train for a sport. And
we're also launching the ultimate back-end course and our AI engineering courses next. And our pro members get
early access. You also get access to our private Discord where you can ask questions to real human beings and get
help fast. If you want to check it out, I might give you a special discount just because you're coming from this video.
Give it a shot. The link is in the description.
The Real Time Shift
Imagine you're at a restaurant. You're starving and you're waiting for your pizza. In the world of HTTP, the only
way to know if it's ready is to keep asking. Is it done? No. What about now?
Still no. That's polling. It's how early real time apps worked. Your browser
would constantly check the server every few seconds just in case something
changed. And it's super wasteful. because every time you ask, you're
sending a full HTTP request with a bunch of headers just to get a tiny response
back. So, if HTTP is so inefficient for real time, how do apps like Discord or
live chats feel instant? Because they don't keep asking, they keep an open
connection and they do it by using a protocol. A protocol is basically the rules for
how two computers communicate. HTTP is a request response protocol. It's amazing
for websites, APIs, and loading pages, but it's terrible for fast back and
forth conversations. For realtime apps, we need a protocol that supports a permanent two-way
connection. That's websockets. A websocket connection stays open. So
both the client and the server can send messages any time. This is called a full
duplex. Fancy term, simple meaning. Both sides can talk at the same time. So the
server can push updates the instant they happen. Typing indicators, live
comments, multiplayer movement, notifications, all of it. Okay, but
isn't that expensive? It sounds expensive, but it's actually cheaper than polling. It's less expensive
because with polling, every check sends large HTTP headers. But with websockets,
once the connection is open, messages are tiny. It's also more efficient for
servers because it's harder to handle thousands of HTTP requests opening and
closing than to keep thousands of websocket connections just sitting there idle. It's also better for mobile
because polling wakes up the phone over and over again, but a single open connection is usually easier on the
battery. Now, let's talk about the websocket handshake. This part is key.
It's the coolest thing because a websocket starts as a normal HTTP request, but then the browser adds a
special header basically saying, "Hey server, can we upgrade this connection
to websocket?" If the server supports it, it replies with HTTP 101 switching
protocols. And the moment that happens, HTTP is done. And now you have something
called a websocket tunnel. Open, persistent, and real time. Just like
HTTP and HTTPS, websockets have two modes. WS is unencrypted, and then
there's WSS, which is encrypted. In production, you always use WSS. And now
that you know what websockets are, very soon, I'll show you how to build one.
Architecture
You just learned that the websocket handshake upgrades HTTP into a
persistent open connection. But once that phone line is open, how do we
actually manage the conversation? Let's break websockets down into the
real production architecture. And I'll do that by telling you a bit more about the life cycle of a websocket
connection. Because a websocket connection isn't just on or off. It has
stages. Think of it like a high-speed train system. You connect, you ride, you
make sure nobody vanished mid-trip, and you clean up properly. Let me explain
what I meant. First is the connect or the knock. It starts with one line. You
set up the socket by creating a new web socket on a specific port. And the
moment this runs, the browser sends an HTTP get request, but with a special
header that says, I want to upgrade this connection to use websockets. That's the
upgrade request or the switch. If the server accepts it, it replies with 101
switching protocols, and that's the moment the relationship changes. HTTP ends, the tunnel stays open and now both
sides can send messages instantly whenever they want. And now we get to the biggest architecture shift, the
state or the memory. HTTP by default is stateless, which means that the server
forgets you after every request. Web sockets on the other hand are stateful.
The server now holds a reference to your socket in memory and that's how it can
push data to you instantly. But this also creates a new problem, ghost
connections. What if someone loses Wi-Fi? What if their phone dies or if
they close the laptop without properly disconnecting? Now the server thinks the connection is
still alive. It keeps holding the socket in memory. These are called ghost
connections. And if you don't clean them up, your server eventually dies slowly
just from holding on to ghosts. So what's the fix? Well, in production,
websocket servers use something called a heartbeat or oftentimes called pingpong
because the server sends a tiny ping and the client responds with a pong. If the
server stops hearing pongs, it assumes the client is dead and terminates the
socket. That's how you prevent ghost connections. Now, you might think, wait,
if we ping every 30 seconds, isn't that basically polling? Well, not even close,
because polling is an entire HTTP request. A websocket ping is basically a
tiny impulse on an already open tunnel. It's massively lighter, massively
cheaper, and far easier on the battery. But now that you understand the
connection, let's talk about the data transfer like what actually gets sent through that tunnel. With websockets,
you don't send web pages obviously, right? You send messages. And there are
two main types, text or JSON and binary raw. Most real-time apps send JSON
things like user is typing, new message, score updated, notification received.
That's usually socket. You stringify it and you send over some data like user
with an ID of 42 is typing. Human readable, easy to debug, and perfect for
99% of the apps. But then we also have binary. Binary is what you use when
things get serious. audio streaming, video frames, multiplayer game states,
large payloads. Instead of sending text, you send raw bytes using array buffer or
blob. It's faster, smaller, and more efficient.
But how does the server know of what type of message it is? Well, at the lowest level, websockets use something
called an up code. It's basically a label that says this frame is text, this
frame is binary, this frame is closing, and this frame is pingpong. You won't
have to deal with op codes directly most of the time, but it's what makes the
whole protocol work cleanly. And then there is back pressure. Advanced but
important. And last major concept I want to teach you, I promise. Think about
what happens if your server is sending updates like crazy. But your user is on a slow internet
connection. New messages start piling up in memory. That's called back pressure.
Production apps monitor how much data is buffered and if it gets too high, they
slow down the sending grade so the server doesn't explode. Literally, this is an advanced concept and you won't
need it for every project. But once you build real systems, this becomes a big
deal. And those types of big deals are the exact reason why I'm working on the
ultimate back-end course. We're going to dive super deep into advanced concepts just like this one. So, if you're
interested, you can join the weight list through the link in the description to get the initial lessons as soon as
they're ready and then the full course in about 2 months. I'll keep you updated. But now that you understand the
architecture like you connect, you upgrade, you keep state, you detect ghost connections, you send messages and
protect your server under load. Now let's actually build it.
Websocket in Action
Okay, enough theory. You've learned a ton about websockets, but now let's do
one real thing, actually create one. But before you write a single line of code,
you need to choose your weapon because there are three different options for creating websockets. There's the socket
io library, pusher or aly which are websocket services and then the WS
library. Let's go over all three. Socket io is the most popular realtime library
in Noode.js. It gives you a full management suite on top of websockets,
reconnects, rooms, fallbacks, the whole package, but it's heavier. You ship
extra client code and every message comes with extra overhead. It's great
for speed of development, but not for the purest websocket experience. Then
there are websockets as service tools such as Pusher or Abley. You don't host
the server, you just pay them and it just scales. It's the easiest path to production, but the trade-off is cost
and control. It's amazing for teams that want done for you solutions, but not
great if you want full ownership of the system. And then there's the WS library.
This is the low-level but high performance route. It's fast with minimal overhead and it matches the
browser websocket API closely. The catch, you build features yourself.
Rooms, reconnections, heartbeats, off logic, all you. But if performance and
low latency matter, this is the real deal. So, I'm happy to say that you
requested it and you got it. In this course, we're using the original websocket library because if you start
with socket io, you'll learn magic. But if you start with WS, you'll learn the
actual protocol. And once you understand native websockets deeply, switching to
socket io later is super easy. That's my promise for this course. So just before
we build it, let me just talk for a second about the websocket life cycle. And please don't skip this as it matters
a lot. A websocket is basically a state machine. If you try to send data in the
wrong state, you'll get bugs, broken messages or crashes. So we need to
understand four different states. The first one is connecting. Handshake is
still happening. Don't send yet. Then there is open. This is the safe zone.
The tunnel is live. you can send. There's closing. Connection is shutting
down. Stop pushing data. And then there's closed. It's dead. Time to
reconnect. And yeah, you can check that anytime using socket. Ready state. Now,
we'll be managing this websocket from both the client and the server side. So, let's talk about the server side events
with websockets because on the server, you're the host. You're listening for
clients joining, sending data, disconnecting, crashing, all of it. So
your starting point is the connection. This is your entry point. You declare a
new WSS.on connection function and within it you can have all the information about
what's happening with the socket and the requests coming in such as learning when new clients are joining in. Then there's
the message. This is incoming data in WS. It usually arrives as a buffer. So
you have to convert it. You do that by saying socket.on message. You get the raw data and then you console log it and
do whatever you want with it. Then there's the error and this is critical.
This is the event that people ignore and then regret. If you don't handle it, one
bad connection can crash your entire node process. Socket.on error and then
you handle it gracefully. Now there's also the other side how you're handling the client side events in the browser
because on the front end you're just a participant. There's an open event which means that
the handshake work and now it's safe to send. You can listen for an open request
and then do a console log or send a message because now you're connected. Then there's the message where you
receive server updates. You can parse the data coming in and display it. And
finally, there's a close which simply means disconnected. Keep in mind your
server is the boss and is sending all the data, but on the front end you're just a participant. If you want to pause
your screen for a second, I can give you a final quick cheat sheet with most important methods and listeners on both
the server side and the client. But once we go through it throughout this course a couple of times together, you'll be
able to remember it easily. On the server, we have the connection message error and close. And on the client, we
have the new websocket to create it. And then on open, message, error, and close.
So now that you understand the life cycle and the events, let's get our hands dirty and actually build something
real. And let's dive right into the demo. You
Websocket in Action (Demo)
can create a new empty folder on your desktop and call it something like websockets and then open it up within
your editor or IDE. Once you're in, you can also open up the built-in terminal.
I'm using webtorm in this case. And then if you make sure that you're in the right folder, go ahead and run mpm
init-y. This will initialize a new Node.js application with the default settings.
And a Noode.js application is nothing more than a package JSON that contains a
name, a version, description, the main starting point of the application, and
some scripts needed to run it. And most importantly, it'll contain a list of
dependencies or libraries that we add to it. And one of the main libraries that we want to install, maybe the only one
for this project is going to be the WS library, a Noode.js websocket library.
It's simple to use, blazing fast, and thoroughly tested websocket client and
server implementation. Most importantly for us, not only the fact that it is popular with 130 million weekly
downloads, but the fact that it is tested and that we know it works properly and is well documented. So,
let's go ahead and install it very quickly by opening up our terminal one more time and running mpm install
WS. You'll be able to see that it is super lightweight. So it'll get added to
our dependencies array in a matter of seconds. Then we want to use ES6 within
our application. So we have to manually modify the type of our app from common.js to module. And then we'll
create a starting point of our application right here by creating a new file called server.js.
And this is where we're going to implement our websocket. So first things first, we have to import it by running
import web socket server coming from WS.
Then we can initialize a new standalone server by saying const WSS is equal to
new websocket server and we can do it on port
8080. This creates its own internal HTTP server just for the handshake.
Then we have to deal with the first event when it comes to websockets and
that is the connection event. You can do that by saying ws.on
specifically on connection we want to get access to the socket and the request. Once we have it we can set it
up. This connection event will fire after the 101 handshake is verified.
Socket will contain the individual connection to one client and the request
will contain the headers such as cookies, IP address, and more from the upgrade request. Now, if you hover over
the socket or the request, you'll see that it just says unused with no additional information about it. That's
because right now even this on function on the websocket server is not recognized. So how can we actually get
more information about what we're actually doing here? Well, if you open up your terminal and run mpm
install--save-dev@types node and at types/WS,
you'll get all the typings for the libraries that we're using, which means that immediately you'll no longer have
squiggly lines right here over the on and instead it'll recognize that this is the on connection event, which now
allows you to try to get access to the IP address by saying request.socket
socket and you can see that now it knows that it is there do remote address so it
autofills it for you and also tells you what it is that you're retrieving such as the string representation of the
remote IP address perfect this is exactly what we wanted to get so even
though we've switched protocols we can still see the original HTTP request data that includes the full request headers
if you want to grab the cookies or the request URL if you want to grab params and it also includes the remote address
which is the physical IP address of the client. Finally, we are ready to turn on the socket.on
event and specifically we'll be waiting for the message. From the message we are retrieving the raw data and we might as
well go ahead and console log the data so we can see how it looks like. So I'll just put it with an object both the key
and the value say raw data so we know where this console log is coming from. Let's also properly close this one right
here. And once we do, we can get access to a list of all currently active socket
objects by saying wss.clients do for each. And for each one of these
clients, you can define what you want to happen. Specifically, we want to iterate
through them and then push the data to everyone. So I'll say if client
ready state, remember when we were talking about it in the crash course. If that is equal to one, in that case we
can run client.end and we can say something like server broadcast and define the message that is
coming in. But of course this message will be the raw data converted into a string because as we learned about the
raw data is actually a buffer or binary. So we need to use the two string to convert it to text. So I'll say const
message is equal to raw data dot to string. Now, why did I specifically use
a ready state of one? Well, remember when we're talking about different states before? They looked something
like this. Here we go. We have a zero for connecting, one is open, the only
state where you can safely use the send command that we used right here. Two is closing, and three is closed. So, always
remember this when you're referring to client ready states. In most cases, you'll be checking whether it's open. if
you try to send a message to a client in a state two or three, your server might throw an error or leak memory. So,
always make sure that you're talking to open clients. Now, here's a pro tip that is unrelated to websockets specifically,
but it's a good programming habit in general. You never want to have something called magic numbers like this
one right here. Like, what does it mean? So instead you can either declare constants yourself or in this case
webocket provides them for us. So instead of checking for the equality with the number one which doesn't mean
anything you can check for the websocket.open state. So if client ready state is equal
to websocket open we can go ahead and send the message. Now let's exit this on
message listener and right below it we'll create a socket on error listener
because sockets are fragile and if a client's internet flickers the socket
might actually throw an error and if you don't catch it the whole server will crash. So let's simply say console.
And here we can do some kind of a console log where we say error. You can even declare for which IP address the
error is happening and that's exactly why I got access to it right here before. So we'll say error for this and
then we can also display the error message. Perfect. Finally you also want to do
some socket cleanup. Right at the end I'll say socket.onlo. For now we can simply console.log and
say something like client disconnected. And this right here is your first very
own web socket server. So let's go ahead and run it by heading over to our
package.json and changing the main part of our application to server.js which is the
name of our file. And I'll also add a script which is going to be a dev script
where you can say node-watch to keep track of the changes server.js.
Once you add that script, you're able to open up your terminal, run mpm rundev,
which will spin up your websocket server. If you just spin it up like this, you won't see anything in your
terminal. But if you head back over to your server.js and at the bottom you add
some kind of a message like console log websocket server is live on WS col/
localhost880. You'll be able to see this message appear right here. But how exactly is
this working? You didn't use Express, right? You didn't even use the HTTP
module to start. You just ran a new websocket server on port 8080. You've
been told for years that to run a web app in Node, you need Express. So, how
did our code just work? Well, the WS websocket library is doing the heavy
lifting under the hood. When you pass a port to a websocket server, it realizes
that there is no HTTP server to hijack. So, it spins up its own internal NO.js
HTTP server automatically. It creates something known as a zombie HTTP server
that only exists to listen for that upgrade handshake. And once it sees a
valid websocket connection, it handles the logic and holds the TCP connection open. In a small project, letting WS
manage the port is totally fine. But in production enterprise app, you usually
attach WS to an existing Express or Fastifi server so they can share the
same port. One port, two protocols. I hope that's clear. But the next question
is how can you test if this is even working real time or not?
Well, there are different ways. One is through the browser and the other is through the terminal and using some
professional tools. So let's try each of them one by one. In this case, you don't need an index html to be able to see it
in the browser. You can hijack any website on the internet to test your local server. Make sure that it is
actually running. Then open up your browser. Go to any website. I'll naturally head over to jsmastery.com
to check out some courses while I'm here. But jokes aside, the only thing you have to do is rightclick any page
within your browser. Go to inspect and then to the console. Once you're in there, we'll write some native
JavaScript. I'll create a new socket by saying con socket is equal to new web
socket. And we can provide a URL that's going to be w/
localhost 8080. So here we're basically connecting to our local machine. Now
I'll hold the shift key and then press enter a couple of times to get some spacing. And then we want to listen to
the broadcast. So I'll say socket.on message is equal to we get access to the
event. And then we can open up a new function block. And within this function
block I'll simply run console.log and say message from server.
And then we will console log the actual event data. So I'll say event data. Perfect. I'll
also put this right here so it's indented properly even when we're typing in the browser. And finally, you can
send a test shout once the tunnel is open by saying socket.onopen
is equal to we're going to open up a new function block.
I don't think you have anticipated that in this video we're going to write JavaScript within the browser console, right? And then you can say socket. And
you can say hello from the Chrome console. So this is going to be our first client that is connected to our
websocket server. I think you get where I'm going with this. Our backend is actually running or acting as the
websocket server, but then the browser will act as the client connecting to it. Make sure that you typed out all of this
properly and that you didn't miss [clears throat] any ending string signs and then go ahead and run it. It looks
like I missed one ending parenthesy. So let's go ahead and fix that. It is missing right here. You might have
caught that. And then go ahead and press enter. You'll see message from server
server broadcast hello from the Chrome console. Now the browser's native websocket API is globally available as
long as your server is running on localhost 880. Any tab in your browser can talk to it. So now if you go back to
your terminal, you'll see a client connection. Yep, here it is. And a message from the client. Since I console
log the raw data, you can just see this binary buffer right here. But this is not a good way to check whether a
websocket server is active. Some sites might block you and you shouldn't be typing any code manually within your
console anyway. It's just a simple hack and a reminder that any browser can run any kind of JavaScript. But a more
proper way to test this out is through a terminal. Real devs love a CLI. Who
doesn't? So there's a tool called WSC cat that is basically curl but for
websockets. You can install it globally by running mpm install-g wscat. I'll do
it right here within a new terminal. And you might need to type pseudo before to give your terminal permissions to be
able to install it. Once installed, you can just run it by typing wscat-
c and then type in the address to your server. Once you press enter, you'll be able to see that it says connected.
Still, I want to be able to see both a server and the client at the same time. So, I've closed the previous terminals.
And I'll just immediately split them. That way, we'll have our own running by running mpm rundev right here. And we'll
have this new one that we just recently ran using WSCAT CLI. So, now it says
connected. Now, as soon as you type a message right here, something like, "Hey from WS Cat with a smiley face, and you
hit enter," you'll see the server broadcasted back to you instantly. And
this is how you test the connectivity without a browser UI getting in your way. And then you can see that the
server broadcasted it back. Now you can continue sending messages, something like, "Hi, testing test." And you can
see that this is indeed happening in real time. You can even see that when I use the word test and then test test,
the first part of it like these characters are the same. So later on when we actually decipher it, it'll
convey the right data. But if you're building a production API, use a tool like Postman. Most people think Postman
is only good for REST APIs, but it also has a dedicated websocket request mode.
So testing with WSCAD is cool, but if you want to see the broadcast in action, you need multiple windows to talk to
each other because that's where the magic happens. So finally, let me show you the coolest way to actually see your
websocket server in action. By the way, see how it says client disconnected right here. And then we can easily
reconnect if we want to. Yeah. So let me show you the coolest way. You can create a new index.html file within the same
directory where we were on. In this case, we don't even have to use React or Vue. We'll use raw web APIs. I haven't
written an HTML 5 template in such a long time. But yeah, just create a
simple doc type, a head, and a body. We can give it a title of web socket live
test rig. We can also insert some styles right here below the title by targeting
the body and changing the font family to sans serif. It feels super weird to
write CSS by hand. We're going to add padding of 20 pixels and a background of
something like hash121212 as well as a color of the text to
something like hash fff. We can also target the ID of log which we'll add
soon enough to be able to send messages. And I'll set that to be background
of hash 0000, a padding of 10 pixels, as well as a
height of 300 pixels, and finally overflow-y
of scroll, a border of 1 pixel, solid hash 333 for the color. I know this is a
testing app, but I still want to make it look nice. So, if you rightclick the index html file, most likely your IDE or
web editor will try to open it up for you in the browser or conveniently WebStorm automatically offers that right
here. And I think I can even open it up in a built-in preview. Yep, that works. That's pretty cool. So, let's see what
we're building. I'm also going to continue writing the styles for the status on class with a color of hash
00 FF 0. And then I'll add the status off which is going to be hash ff00 0 0.
Perfect. Just so we have some colors. Now let's actually create the HTML of
this simple application. I'll start with creating a single H1 that'll say
websocket broadcast console. Then right below it, we'll do a P tag
that'll have an ID of status and a class of status off and it'll say connecting
dot dot dot. You can see it right here. Let's make it fit within a single view.
And then finally, I'll also render a form. So right below the P tag, you can
render a form that has an ID of message form. Then it'll have an input with an ID of
message input with a type of text, a placeholder of send cargo and a require
tag. Below it, we'll also render a button with a type submit and it's going
to say deploy message. And finally, don't forget to close the form component.
Finally, below the form, I'll also render an H3 that's going to say live stream logs so we can track what's
happening. And then I'll add a pre-tag with an ID of log where we can basically
see the messages coming in. And now it's all up to us actually using the
websocket, but this time on the client side. So right below the body, I'll
create a new script tag. We won't be using any bakedin socket io script.
Rather, we're going to build it ourselves by connecting to the base library. First things first, you have to
get access to some HTML elements so that we can actually change them to see something changing on the screen once we
receive the data from websockets. So get the status element by saying
document.getelement get element by id status log by getting the log and then input by getting the message input. But
do you actually remember how to connect to a websocket? I mean we talked about it within the crash course part. The
step number one is to initiate the handshake.
Sounds ominous but basically the only thing you have to do is say con socket is equal to new web socket and then you
have to say which one you want to connect to. That's going to be WS col/
localhost880. Same thing that we've done in the browser. The moment this line executes,
the browser creates a TCP connection to the server, sends an HTTP get request
with an upgrade websocket, and then waits for a 101 switch protocols
response. This does not mean the connection is ready, at least not yet.
The socket exists immediately, but it is not usable until the open event fires.
So let's say socket.adde eventlister,
and we're going to add the event listener for the open state. We're going to have a callback function.
And we want to change the status of the HTML element by saying status l.ext
content. We're going to switch it over to connected. and we'll say which port
we're connected to. Just like this. Then right below it, I'll also change the
status element.class name by turning the status to on. And
now we want to create a utility function to prepend the log messages. We prepend
instead of append so the new messages stay on top for readability. So I'll say
const append log is equal to a function that takes in a label and the message
and we can create a new entry to our log. This entry will consist of a new
date so we know when the message was sent to locale time string and then
finally after that we want to display a label and we can add the backslash end
character for a new line. Finally we want to change the text content of that
log. So log.ext content is going to be equal to the entry plus
log.ext text content. We're prepending it for faster reading. And now we can
use this function append log to well append new messages. We're going to use
it also within our event listeners specifically for the open event listener
by appending a new log which is going to be in this case of a type system right
because something is happening the socket is being opened and we're going to say something like tunnel
established. Then we also want to add another event listener this time for
close. And this one is going to be super similar to this one. So I'll just copy its contents
and instead of connected this time I'll say disconnected
and I'll change the status to status off and the system will say tunnel
collapsed. But why did we use addeventlister instead of socket onopen
or socket on close? Both works but add event listeners allows for multiple
listeners and socket. Something only allows for one. In real application with
logging and analytics and UI updates, you often want multiple independent reactions on the same web event. And why
do we have events at all? Well, that's because websockets are eventdriven, not request driven. I mean, that's the whole
point. You do not check for messages. The browser pushes events into your
code. Specifically, the open event is fired only once when the HTTP websocket
upgrade succeeds. The protocol is then officially switched and the tunnel is established. This is the first safe
moment to call socket. When it comes to the closed, this is
fired when the server intentionally closes the connection or when the network drops or when the socket.close
is called. Once closed, the socket is dead and it can never be reopened again.
You must create a new websocket instance. So now that we know about this, we can create a final event
listener, the one for listening to messages. That's going to be socket.adde
eventlister for the message where we get access to the event and we'll simply say
append log. This time it's not system, it's something like received. And here
we want to display the event data. This event is fired every time the server
pushes data to the client. But do note that the client does not ask for messages. The server decides when
messages arrive. And event data can be a string, most common like usually JSON,
and it can also be a blob or an array buffer. In this demo, we're going to assume that it is text. Now, if you've
been paying close attention to the right side, you'll see that we've gotten a system message. This can either be an
open or a close. But we didn't get this additional message whether the tunnel has been established or whether it
collapsed. I think that's because I forgot to accept that second part of the message within the append log utility
function. So if you head over here, you'll notice that right now we're just displaying the log text content to be
equal to entry plus log.ext content. But I'm not actually adding a message to
this entry string. So right after the label before a new line, we also want to
display the message part right here. So now you can see message tunnel
collapsed. Okay. Now let's focus on sending and receiving data. Below all of
these sockets you can say document.getelement by id and specifically want to get the
message form. Once you get it, we want to append an event listener to it. Specifically the
submit event listener that gets access to the event. Then we want to prevent
default to not reload the page. And then we have to make a check to not try to
send if the socket is dead. So I'll say if socket ready state is not equal to
web socket which you have to import open state. In that case we will append a new
log that will say something along the lines of error. And then the message that we'll send is no active tunnel
found. But if we do have it right below the if I'll say const msg as in message
is equal to input value.trim. And then we can use the socket to
finally send the raw message through the tunnel. And we can log that out by
saying append log where we [clears throat] can say sent and then we'll say which message we
actually sent through the tunnel and then we'll reset the input value by setting it to an empty string. This is
our little websocket broadcast console application that should show you in real
time and in practice how websockets really work by having access to an
active and running websocket server. Make sure that you're running mpm rundev
so it's live on localhost 8080. And once it is, you might need to close and then
reopen the websocket. There we go. You can now see connected to WS localhost
8080 and you can actually send a message. Again, while we're building it, it was super useful to have this open in
a built-in preview within WebStorm. But now I want to do something different. I
want to open up a couple of these windows side by side. So once you open it up within your browser, go ahead and
open another one and another one and then put them side by side.
That'll look something like this. We're connected in all three places. And now you can send the message from the window
A. Let's type something like hello from window A and deploy it. Immediately you
can see a received server broadcast hello from window A coming up to screens
B and C. And of course, since we're sending to all clients, we also received it back within window A. All of this is
happening in less than 10 milliseconds. It is instantaneous and we can actually
speak to each other. Pretty cool, right? Believe it or not, you just developed a
local chat application by using native websockets. Congrats. Sure, you can chat
with a friend yet, but this is a step in the right direction. And just a bit of theory like remember how you wondered
how the server runs without express like look at the client now there is no HTTP
fetches anywhere there is no request and response cycle once that open log appears the HTTP protocol has been
deleted from memory and you're now communicating through a persistent TCP stream. If you look at a network tab
let's open it up right here. I'll go to network and I'll make it take a bit more space. You'll notice that there's some
requests happening right here. And there is that localhost switch 101 status that
I was telling you about. Now, there aren't dozens of requests, right? And even if you keep sending messages,
nothing is going to happen on the network side, which is absolutely crazy because we are actually receiving new
messages in the browser. But instead, there's only one single request that says pending. That's the one that
switched the protocol and opened the tunnel for all the incoming messages. So, give yourself a huge pat on the
back. Or if you need me to say it, congrats. You really deserve that. You've just successfully learned how to
implement websockets. But this is definitely not the end. Later in JavaScript Mastery Style, during the
build and deploy part of this course, you'll actually implement a websocket in an Express.js application and connect it
to a React application on the client side. But just before that I got to tell you a few more things about different
ways in how we can send data through the tunnel. So let's quickly go through that next.
Socket Patterns
In the last lesson you opened a persistent tunnel between the client and the server. You proved you can send data
through it. But in production sending data is the easy part. The real skill is
designing message flow. Because the moment you write socket send hello,
you're sending a blind packet. The server receives it and has zero context.
Is this about a chat message, a typing event, a command, or a delete request?
It has no idea. So, we fix that with structure. Welcome. The envelope
pattern. It's a must for real apps because in real time apps, you don't
send raw strings. You send a message envelope that includes intent. Think of
it like shipping a package. You don't just drop an object into the mail. You
label it. Let me give you an example of a clean websocket envelope. You define a type such as a chat message. You give it
an ID, maybe some metadata, and most importantly, the payload that includes
the text of a message you want to send and the ID of the room you want to send that message to. There are a couple of
important parts here, but it's super simple to understand. The type tells your server what logic to run. The ID
lets you track the message. The payload is the actual data. And then there's the
metadata which includes the optional context. Now your server becomes a switchboard.
It looks only at one field and instantly routes the action. So, as soon as you
parse the message, you open up a literal switch statement in JavaScript, check out the type, and then depending on
whether it's a message, a typing status, or a request to join a room, you can
immediately handle that within your application, clean, scalable, and
production ready. Now, there are two ways to structure envelopes. The first one, and the one I actually recommend,
are typebased commands. This is best when your app has a known list of actions such as chat message, typing,
user join, and more. It's perfect for chat apps, dashboards, and collaborative
tools. But there are also topic based messages, pub sub style. This is best
when channels are dynamic. For example, you can send a topic of stock Apple with
the data containing its price or the topic of a game happening between Lakers and Warriors with a specific score. This
is perfect for sensors, tickers, live markets, and sport engines. And yeah, as
I told you before, once the structure is solved, you have to choose the format. There's JSON and binary. JSON is the
default. Easy, readable, debugable, flexible, and for most apps, JSON is the
best choice. But binary is what you want to use when messages are of a high frequency. GPS updates, mouse movements,
audio chunks, game states. Instead of sending readable text, you send raw
bytes because it takes less bandwidth and less latency. And believe it or not,
most serious apps actually use both JSON for control messages, join O commands,
and binary for high-speed data. But when you make that connection and when you
decide in which format you want to send it, we have to move from message structure to message routing because in
that web socket that we implemented before, you're basically shouting messages to everyone. Production apps
don't do that. So there are a couple of different patterns in which you can send messages. There is broadcast, uniccast
and multiccast. Broadcast is also known as one to all. This is like the
megaphone pattern. One message goes to every single connected client. It has
its uses for things like systems announcements, global alerts, or service
status updates. Just remember 10,000 users means 10,000 cents. That's fine
occasionally, but not fine every 100 milliseconds. The second pattern is
uniccast or one to one. This is a DM. Only one person gets the message. To do
this properly, you keep a registry where you connect a specific user ID to a socket because without that, you'd be
looping through every client just to find one. With a map, lookup is instant. You want
to use uniccast for private messages, user notifications, or admin actions.
And finally, there's multiccast or one to many. Often used to send messages to
specific rooms. It's a group chat pattern. You don't send to everyone. You only send to a specific room. Use it for
Discord channels, game lobbies, live event chats, and collaborative documents
because rooms are the difference between everyone hears everything and only the
right people hear the right thing. And we also have to talk about acknowledgements. Because here's the
brutal truth. Websockets are fast, but they're also a fire and forget. Unlike
HTTP, there's no automatic 200. Okay. So for critical actions, you add axe or
acknowledgements. You send the message with an ID. The server processes it and
replies with the same ID as a receipt. If the client doesn't get the receipt in
time, retry. That's how you add reliability on top of websockets. And
another pattern I want to teach you is the pub sub pattern. Pub sub is like
subscribing to a newspaper. You only receive what you actually care about.
For example, user A subscribes to Apple stock, B to Google, and C again to
Apple. So when Apple stock updates, only A and C get the updates. That's pub sub.
But the real challenge is scaling because when you have multiple servers, each server only knows its own clients.
So if server one publishes an update, server 2 won't know about it. That's why
real systems use a message broker like Reddus, the broker becomes the central
broadcast layer between all servers. And that's how you scale to millions of
connections. So now you've really leveled up. You're not just sending messages, you're designing flows with
structured envelopes, targeted routing. You're checking for reliability with acknowledgements and you can even scale
with the pub sub pattern. But now the big question is when should you actually
use websockets and what kind of data should go through them?
Beyond The Socket
At this point you might be thinking okay websockets are real time. So if I want
to build the next Zoom or Netflix do I just use more websockets? And the answer
is yes and no. Websockets are powerful, but they're not a silver bullet. If you
try to push 4K video through websockets, your server bill will explode and your
servers will get lag. So, let's zoom out a bit and map the realtime world. Let's
start by talking about web RTC for voice, video, and P2P. So far,
everything we discussed looks like this. client, server, client, and that's perfect for chat, notifications,
collaboration, and dashboards. But for heavy media like video calls, routing
everything through your server is expensive and slower. And that's where Web RTC comes in. Web RTC lets two
browsers talk directly peerto-peer with ultra low latency, and that's perfect
for audio and video. The only catch is that WebRTC needs a matchmaking phase.
The two browsers need a way to find each other and exchange connection information. That step is called
signaling. And signaling is usually done with websockets. So the flow will look
like this. Client A connects to a websocket server. It sends an offer for
client B. Client B replies with an answer. And once they've exchanged
network details, WebRTC connects them directly peer-to-peer. The server steps
out, the media flows directly. And that's exactly why apps like Zoom use
websockets for signaling, chat, and join events, but then Web RTC for audio and
video streaming. Now, besides WebRTC, there's also web transport for ultra-
low latency streaming. Because what if peer-to-peer isn't possible? But you
still need extremely low latency. I'm talking high frames pers cloud gaming,
live media pipelines, and competitive real-time systems. Websockets are built
on TCP, one of the primary ways in which we transmit data on the internet. But
TCP has a big downside. If one packet gets lost, everything pauses until it's
resent. That's called head offline blocking. Web transport fixes this by
using HTTP3 powered by quick. So instead of one stream that can freeze, it supports
multiple independent streams over a single connection. So if one stream gets delayed, the others keep moving. That
means fewer freezes and smoother real-time delivery. But unless you're building something insanely latency
sensitive, you should still stick with websockets. They're stable, supported everywhere, and battle tested. And
finally, there are SSEs, the server sent events because sometimes even websockets
are actually overkill. If your app only needs one-way updates like stock prices,
news feeds, and live dashboards, then SSE is a cleaner tool. It's basically
server pushes updates and the client listens. No two-way messaging, no full
duplex tunnel, just a one-way stream over HTTP. Lightweight, simple, and it reconnects
automatically. So, when do you use what? Well, here's the cheat sheet. Websockets.
Two-way realtime apps. Think chat, collaboration, dashboards. WebRTC, great
for heavy media, peer-to-peer. Voice calls, video calls, and file
transfers. Web transport for ultra low latency streaming, high performance
real-time systems, and SS or server sent events for one-way server updates. Think
stock tickers, feeds, and streaming data. And if you're still unsure, just
use this one simple rule. Does the server need to push updates? If yes,
then SSC or websocket. Does the client need to talk back? Then websockets. And
are we talking about sending heavy audio, video, or huge data? If yes, then
WebRTC. You now have the full map of the realtime world. So, let's recap the
journey. You first learned about why HTTP polling is wasteful and how
websockets create a persistent full duplex tunnel through the handshake
process. Then you learn the architecture of websocket connections, life cycle
stages, pingpong heartbeats, ghost connections, and how data flows through op codes.
You then built your first websocket server with the WS library, tested it
with WS CAD and a browser, and saw realtime broadcasting in action. In
lesson four, you learned how to structure messages with the envelope pattern, when to use binary versus JSON,
and the three core communication patterns such as broadcast, uniccast, and multiccast. And finally, you learn
that while websockets are powerful, they're not the only tool. Instead, you
know when to switch over to some other tools, such as WebRTC for peer-to-peer media, Web Transport for ultra low
latency, and SSEs for one-way data feeds.
Course Outro
The crash course is complete. You understand the theory, the architecture,
and the ecosystem. Now it's time to build something real. In the build and
deploy section coming up next, you're going to build a production live sports scoreboard with websockets
for real-time score updates, express for the backend API, posgress for data
persistence, a React front end that updates in real time, and proper error
handling with the reconnection logic and state management. And here's the truth.
Just coding websockets and shipping a production-grade real-time app are two
completely different games because building it locally is only like 20% of
the battle. The other 80% is making sure your app survives the real world.
Attacks, traffic spikes, crashes, monitoring, deployment, and code quality.
Most tutorials just stop at the happy path, but not this one. That's why I've
partnered with the best tools that will help you make the most out of websockets in production. The first one on the list
is Code Rabbit, and it's all about code quality. See, real-time apps are easy to
break. One missed edge case and your server starts behaving weird under load.
That's why in this course, I'll also teach you how to use Code Rabbit. It's an AI powered code reviewer that helps
you catch issues early before they hit production. And that's more important now than ever before since we generate a
lot of code using AI. And their team recently did some research and it showed that AI PRs had 1.7 times more issues
overall. So in this course, I'll show you how I use Code Rabbit. As we
continue building the app, you can get it for free by using a special link down in the description. Next, we dive into
security with Arjet. Right now, your websocket server is basically wide open.
Someone can connect 10,000 times from a single IP, spam garbage data, or stress
your server until it falls over. And traditional security tools aren't designed for persistent websocket
connections. That's why later in the course, I'll also teach you how to use Arjet. It helps you protect your apps,
including real-time websocket connections with rate limiting for connections and messages, bot detection,
and attack and abuse prevention built for real time APIs. Click the link in
the description and create a free account. You'll see exactly how I integrate ARJet inside the sports
scoreboard project that's coming up next. Now, you'll also need visibility.
If your memory starts creeping up or your latency spikes or if your database
maxes out, you want to know before your users do. That's why I'll also teach you
how to use Site 24/7. It gives you uptime monitoring, alerts, and
performance dashboards so you can track your server health, websocket connection counts, and real-time latency. So
instead of guessing, you're engineering proactively. All right, you're now set to build and deploy a production-grade
realtime system. And once you build this with raw websockets, learning socket io
will take you like 10 minutes. Socket io is just a library that automates
everything you're about to build manually, like reconnections, rooms, acknowledgements, and fallbacks. But
because you'll understand how it all works under the hood, you'll be able to read the socket io docs and immediately
know what every feature is doing and why. So in this course, you're not just
learning websockets. You're becoming a real time systems architect. Now let's
build something real. Before we write a single line of
Project Demo
websocket code, check out the final boss. the real time app you'll engineer.
It's called Sports, a high-level professional-grade backend that powers a
live sports dashboard. It's a living system built to handle raw data flow,
security, and thousands of concurrent fans screaming for updates. The second a
user hits the site, your backend does a dualaction handshake. It fires off a
REST response to populate the match list while simultaneously upgrading the
connection to a persistent web socket. You're going to implement this welcome logic and the background heartbeat pings
that big players like ESPN use to keep millions of connections alive. If that
pipe drops, the experience dies. You're going to make sure it doesn't. Next, and this is where it gets powerful, you're
building the automated match discovery. Your API will be optimized for
background polling, allowing the system to detect new games the millisecond they're committed to the database. This
means that your users will see the updates immediately without ever touching the refresh button. Now,
building on instant updates, we have to talk about efficiency. In a hightraic environment, broadcasting every update
to every user is a one-way ticket to a server crash. That's why you're going to
engineer a selective subscription model. Your websocket server will wait for a
specific subscribe command before it starts streaming match specific data. This will not only keep your backend
deficient, but it'll push the scores and commentaries only to the users who are
actually tuned in. So once the user is subscribed, the real-time engine starts.
So when a goal hits the database, you won't just send a generic alert. You're going to broadcast that targeted score
update and commentary events packed with different timestamps and metadata. Your
backend will start providing the exact data the UI needs to highlight that game-changing moment the instant it
happens. Finally, we have to protect the entire application. So you'll build logic that autokills data streams when a
match ends and handles all the disconnects properly. Most importantly, you're wrapping the whole thing in a
security shield to keep bots and spam out of your pipes thanks to Arjet. This
is the exact hybrid architecture. Rest for the foundation and websockets for
the speed used by the fastest platform on the planet. You're moving beyond the
basic sites and learning to engineer a system that handles data like a pro
sports network. It's a massive skill to have this in this AI era and you're
going to master it step by step. In the crash course, you learned websockets,
Hostinger
what they are, how they work, common architectural patterns, real-time data flow, and now we're about to build a
live sports app that updates instantly. But there's one part that almost nobody
teaches properly. Deployment. Because building websockets locally is pretty
straightforward. But shipping them in production is where most apps break.
What happens when a thousand users connect all at once and those connections stay open for hours?
Realtime systems don't behave like normal REST APIs. They need to be stable
and predictable. And this is where many popular platforms start to struggle.
Some platforms are optimized for serverless or short-lived requests, which can introduce issues like cold
starts, sleeping instances, connection limits, usage caps. That's why today's
video is sponsored by Hostinger. As of recently, they offer fully managed
Node.js JS hosting which gives you an always on runtime built for long lived connections exactly what we need here
without forcing you into serverless constraints or turning this into a full-blown DevOps project. You can
deploy straight from GitHub. Your framework is autodetected. SSL is handled automatically and your app stays
live with huge reliability supporting stacks like React, Next, and View, but
most importantly, Express, Nest, and Realtime backends like the one you're
going to build in this video. That's why I want to teach you realworld deployment with proper git commits, domain setup,
https by default, and monitoring without any issues. And since you're a JS
mastery subscriber, Hostinger is offering you a limited time discount. Click the link down in the description
and click view plans. Even though the cloud startup plan is super powerful, business plan is going to be more than
enough for us, allowing you to host five managed Node.js applications.
So, choose this plan. And if you're serious about backend development, I would recommend choosing more than 12
months because then you're going to get a free domain name. And don't forget to enter the JavaScript Mastery coupon code
for an additional discount on this offer. Great. You can buy it now and then we'll use it later on once we
develop our application. Once you buy it, you'll be able to choose your domain name, which you can do right away or for
now, you can use a temporary domain. And then the recommended way to set up our app is to import a Git repository. So go
ahead and connect with GitHub. You can connect it to your personal one and give it access and authorize. Once that is
done, at the end of this build, you'll be able to find your repo and deploy it right here with a single click. For now,
we can just exit the onboarding and then we'll be back to set it up at the end of this course. With that in
mind, let's dive right into the action and let me teach you how to use websockets within real time production
applications. Let's dive right into the build by opening our code editor or IDE.