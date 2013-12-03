![quickbits](http://i.imgur.com/ulynnBc.png)

# What is Quickbits
A student project created in 9 days at [Dev Bootcamp Chicago](http://devbootcamp.com), Quickbits is a browser-based file sharing application that allows anyone to easily transfer files from their browser to a friend's browser, in an anonymous, secure, decentralized way using WebRTC.

## Technologies/dependencies
- HTML5 File API
- [PeerJS](https://github.com/peers/peerjs/) to wrap WebRTC
- [PeerServer](https://github.com/peers/peerjs-server)
- Heroku
- Modern web browsers (Firefox 25+ and Chrome 31+)
- jQuery
- Rails 3.2, Ruby 1.9.3
- CSS3

## To run
- You will need either a PeerJS API key or your own peer server.
- If you elect to deploy a PeerServer to Heroku, it helps to inlude the
  PeerServer Module. You will also want your Procfile to look something like this:

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
```ruby
bundle install
```
No database is required.

## Contributors:
- Kent Carmine
- Clark Kampfe
- Chirag Tailor
- Nathan Hadlock
- Jake Koten
