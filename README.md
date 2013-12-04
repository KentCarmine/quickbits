![quickbits](http://i.imgur.com/ulynnBc.png)

# What is Quickbits
A student project created in 9 days at [Dev Bootcamp Chicago](http://devbootcamp.com), Quickbits is the USB stick for the 21st century: easy, secure, anonymous, decentralized browser-to-browser file transfer with no signups or plugins.

## Technologies
- HTML5 File API
- [PeerJS](https://github.com/peers/peerjs/) to wrap WebRTC
- [PeerServer](https://github.com/peers/peerjs-server) (Node.js)
- Heroku
- Amazon Web Services
- Modern web browsers (Firefox 23+)
- jQuery
- Rails 3.2, Ruby 1.9.3
- CSS3

## To run:
- You will need either a PeerJS API key or your own peer server (if you elect to run your own peerserver instance, we recommend going with AWS EC2/Beanstalk; [Heroku's timeout limitations](https://devcenter.heroku.com/articles/request-timeout) degrade the window in which peers can successfully signal).
- Rails: No database required, just
```
bundle install
```

## Contributors:
- Kent Carmine
- Clark Kampfe
- Chirag Tailor
- Nathan Hadlock
- Jake Koten
