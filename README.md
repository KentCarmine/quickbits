![quickbits](http://i.imgur.com/ulynnBc.png)

# What is QuickBits
Millions of people are transferring files everyday.  Services such as Dropbox, BitTorrent and basic email have been created to deal with this need.  However all of these services have many drawbacks, which keep the user from realizing the true potential of file transfer on the modern web.  Quick Bits is a browser based application that allows a user to easily transfer files from their browser to a friends browser, in an anonymous, secure way.

## Technologies/dependencies
- HTML5 File API
- [PeerJS](https://github.com/peers/peerjs/)
- [PeerServer](https://github.com/peers/peerjs-server)
- Heroku
- jQuery
- Rails 3.2, Ruby 1.9.3
- CSS3

## To run
- You will need either a PeerJS API key or your own peer server.
- If you elect to deploy a PeerServer to Heroku, it helps to inlude the
  PeerServer Module. You will also want your Procfile to look something like this

```
web: node_modules/.bin/peerjs --port $PORT
```

your server creation (typically a web.js file) to look something like this:

```javascript
var server = new PeerServer({ port: (process.env.PORT || 80) });
```

and your peer instantiations in your program logic to be this
```javascript
var peer = new Peer({ host: 'your.domain.com', port: 80 });
```

On the Rails side of things:
```ruby
bundle install
```







## Contributors:
- Kent Carmine
- Clark Kampfe
- Chirag Tailor
- Nathan Hadlock
- Jake Koten
