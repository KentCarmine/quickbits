// SENDER SIDE
function Sender(){
  var thisSender = this;
  thisSender.peer = new Peer({ key: "ry9t770xq4hx5hfr" });

  thisSender.peer.on('open', function(id){
    thisSender.peer_id = id;
    console.log(thisSender.peer.id);
  });

  // this.file = "some_file_location"
}

Sender.prototype.handleConnection = function(){
  var thisSender = this;
  thisSender.peer.on("connection", function(connection){
    thisSender.connection = connection;
    console.log("Connection established in acceptConnection");

    thisSender.connection.on("open", function(){
      thisSender.sendData("Connected! Here's your file metadata.");
      thisSender.getData();
    });

    // connection.close();
    // thisSender.peer.destroy();
  });
};

Sender.prototype.sendData = function(dataToSend){
  // console.log("sendData called");
  this.connection.send(dataToSend);
};

Sender.prototype.getData = function(){
  // console.log("getData called");
  this.connection.on("data", function(data){
    console.log("got Data inside getData");
    console.log("GOT: " + data);
  });
}

$(function(){
  var sender = new Sender();

  sender.handleConnection();
});

