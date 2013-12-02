// SENDER SIDE
function Sender(file){
  var thisSender = this;
  // this.thisSender = this;
  thisSender.peer = new Peer({ key: "njbpaic7tuwstt9" });

  thisSender.peer.on('open', function(id){
    console.log('sender opened!')
    thisSender.peer_id = id;
    // console.log(thisSender.peer.id);
    thisSender.setDownloadUrl();
  });

  thisSender.file = file;
}

Sender.prototype.handleConnection = function(){
  var thisSender = this;
  thisSender.peer.on("connection", function(connection){
    thisSender.connection = connection;
    // console.log("Connection established in acceptConnection");

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
  // var fileData = {
  //   isFile: true,
  //   arrayBufferFileData: fileData,
  //   fileName: thisSender.file.name,
  //   fileType: thisSender.file.type
  // }

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
    // console.log("got Data inside getData");
    // console.log("GOT: " + data);
  });
}

Sender.prototype.loadFile = function(callback){
  var thisSender = this;
  var fileReader = new FileReader();
  fileReader.readAsArrayBuffer(thisSender.file);

  fileReader.onload = function(){
    var fileData = fileReader.result;
    var blob = [];
    var sliceSize = 1000;
    // console.log(thisSender);
    // console.log("file data length:");
    // console.log(fileData.byteLength/sliceSize);

    for(var sliceId = 0; sliceId < fileData.byteLength/sliceSize; sliceId++) {
      // console.log("Slice ID: "+sliceId);
      if(sliceId >= Math.floor(fileData.byteLength/sliceSize)) {
        var lastStatus = 1;
      }
      else {
        var lastStatus = 0;
      }

      blob = fileData.slice(sliceId * sliceSize, (sliceId + 1) * sliceSize);

      var fileSliceWithMetaData = {
        isFile: true,
        arrayBufferFileData: blob,
        fileName: thisSender.file.name,
        fileSize: thisSender.file.size,
        fileType: thisSender.file.type,
        isLast: lastStatus
      }

      callback(fileSliceWithMetaData, thisSender);
    }
  }
}

Sender.prototype.setDownloadUrl = function(){
  // console.log(this);
  // console.log(this.peer_id);
  console.log('setting the download url');
  $("#url").val(window.location.href + this.peer_id);
}

$(function(){

  $("#file_input").change(function(event){
    var file = event.target.files[0];
    var sender = new Sender(file);
    sender.handleConnection();
  });

  $("#drop_zone").on("dragover", function(event){
    event.preventDefault();
    event.stopPropagation();
    event.originalEvent.dataTransfer.dropEffect = "copy";
  });

  $("#drop_zone").on("drop", function(event){
    event.stopPropagation();
    event.preventDefault();
    var file = event.originalEvent.dataTransfer.files[0];
    var sender = new Sender(file);
    sender.handleConnection();
  });

  $(document).on("dragover", function(event){
    event.stopPropagation();
    event.preventDefault();
  });

  $(document).on("drop", function(event){
    event.stopPropagation();
    event.preventDefault();
  });

  $("#copy_link_form").on("submit", function(event){
    event.preventDefault();
  });
});

