// SENDER SIDE
function Sender(file){
  var thisSender = this;
  // this.thisSender = this;
  thisSender.peer = new Peer({ key: "ry9t770xq4hx5hfr" });

  thisSender.peer.on('open', function(id){
    thisSender.peer_id = id;
    console.log(thisSender.peer.id);
  });

  thisSender.file = file;
}

Sender.prototype.handleConnection = function(){
  var thisSender = this;
  thisSender.peer.on("connection", function(connection){
    thisSender.connection = connection;
    console.log("Connection established in acceptConnection");

    thisSender.connection.on("open", function(){
      // thisSender.sendData("Connected! Here's your file metadata.");

      var fileMetaData = {
        isFileMetaData: true,
        fileName: thisSender.file.name,
        fileSize: thisSender.file.size,
        fileType: thisSender.file.type,
      }

      thisSender.sendData(fileMetaData);

      thisSender.loadFile(thisSender.sendFile);

    //   var fileData = {
    //     isFile: true,
    //     arrayBufferFileData: thisSender.loadFile(),
    //     fileType: thisSender.file.type
    //   }
    //   debugger;

    //   thisSender.sendData(fileData);
    //   thisSender.getData();
    // });

    // connection.close();
    // thisSender.peer.destroy();
    });
  });
}

// Sender.prototype.getThisSender = function(){
//   return this;
// }

Sender.prototype.sendFile = function(fileData, thisSender){
  // var thisSender = this;
  // debugger;
  var fileData = {
    isFile: true,
    arrayBufferFileData: fileData,
    fileName: thisSender.file.name,
    fileType: thisSender.file.type
  }

  thisSender.connection.send(fileData);
  // thisSender.getData();
    // });
}

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

Sender.prototype.loadFile = function(callback){
  var thisSender = this;
  var fileReader = new FileReader();
  fileReader.readAsArrayBuffer(thisSender.file);

  fileReader.onload = function(){
    // debugger;
    callback(fileReader.result, thisSender);
  }
}

// $(function(){
//   var sender = new Sender();

//   sender.handleConnection();
// });

