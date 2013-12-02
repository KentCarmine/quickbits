// RECEIVER SIDE
function Receiver(){
  var thisReceiver = this;
  thisReceiver.peer = new Peer({ key: "2pmakgfy6gw7mn29" });
}

Receiver.prototype.establishConnection = function(senderPeerId){
  var thisReceiver = this;
  thisReceiver.connection = thisReceiver.peer.connect(senderPeerId);
}

Receiver.prototype.handleConnection = function(){
  var thisReceiver = this;
  thisReceiver.connection.on("open", function(){
    thisReceiver.getData();
  });
}

Receiver.prototype.getData = function(){
  var fileArray = [];
  var thisReceiver = this;
  thisReceiver.connection.on("data", function(data){

    if(data.isFileMetaData){
      console.log("got fileMetaData, should not be here!");
    }
    else if(data.isFile){
      // call byteConverter(data.fileSize) to get file size in the appropriate unit
      var file = new Blob([data.arrayBufferFileData], { type: data.fileType });
      thisReceiver.file = file;
      fileArray.push(data.arrayBufferFileData);

      //ALTER OR REMOVE TIMEOUT LATER!
      //Maybe by checking if file is complete?
      if(data.isLast == 1){
        setTimeout(function(){
        var fileConstruct = new Blob(fileArray);
        saveAs(fileConstruct, data.fileName);}, 500);
      }
    }
  });
}

function byteConverter(bytes){
  var kilobyte = 1024;
  var megabyte = kilobyte * 1024;
  var gigabyte = megabyte * 1024;

  if (Math.floor(bytes/gigabyte) > 0){
    return (bytes/gigabyte).toFixed(2) + " GB";
  }
  else if (Math.floor(bytes/megabyte) > 0){
    return (bytes/megabyte).toFixed(2) + " MB";
  }
  else if (Math.floor(bytes/kilobyte) > 0){
    return (bytes/kilobyte).toFixed(2) + " kB";
  }
  else {
    return bytes + " B";
  }
}

$(function(){
  var splitUrl = window.location.href.split("/");
  var senderPeerId = splitUrl[splitUrl.length-1];
  var receiver = new Receiver();

  receiver.establishConnection(senderPeerId);
  receiver.handleConnection();
});

