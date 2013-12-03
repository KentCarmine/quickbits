![quickbits](http://i.imgur.com/ulynnBc.png)

# What is Quickbits
A student project created in 9 days at [Dev Bootcamp Chicago](http://devbootcamp.com), Quickbits is the USB stick for the 21st century: easy, secure, anonymous, decentralized file transfers in the browser built on WebRTC.

## Technologies
- HTML5 File API
- [PeerJS](https://github.com/peers/peerjs/) to wrap WebRTC
- [PeerServer](https://github.com/peers/peerjs-server) (Node.js)
- Heroku
- Modern web browsers (Firefox 25+ and Chrome 31+)
- jQuery
- Rails 3.2, Ruby 1.9.3
- CSS3

## To run:
- You will need either a PeerJS API key or your own peer server.
- If you elect to deploy a PeerServer to Heroku, it helps to include the
  PeerServer node module. You will also want your Procfile to look something like this:

```
web: node_modules/.bin/peerjs --port $PORT
```

your server instantiation (typically a web.js file) to look something like this:

```javascript
var server = new PeerServer({ port: (process.env.PORT || 80) });
```

your node_modules/peer/server.js to look like this:

```javascript
var server = new PeerServer({ port: 80 });
```

and your peer instantiations in your program logic to be this:
```javascript
var peer = new Peer({ host: 'your.domain.com', port: 80 });
```

Rails:

No database required, just
```ruby
bundle install
```

## Contributors:
- Kent Carmine
- Clark Kampfe
- Chirag Tailor
- Nathan Hadlock
- Jake Koten
