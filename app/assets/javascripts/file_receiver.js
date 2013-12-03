// RECEIVER SIDE
function Receiver(){
  var thisReceiver = this;
  thisReceiver.peer = new Peer({ host: "ancient-lake-1993.herokuapp.com", port: 80 });
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
  var chunk_count = 0;
  var progress = document.querySelector('.percent');
  var userFileName = document.querySelector('.file_name');
  var userFileSize = document.querySelector('.file_size');

  thisReceiver.connection.on("data", function(data){

    if(data.isFileMetaData){
      // GLOBAL, COME BACK TO THIS
      file_size = data.fileSize;

      fileName = data.fileName;
      userFileName.textContent = data.fileName;
      size = byteConverter(data.fileSize);
      userFileSize.textContent = size;
      // console.log("in file metadata");
    }
    else if(data.isFile){
      // console.log("in file load");
      chunk_count += 1;

      thisReceiver.connection.send({ isChunkCount: true, chunksReceived: chunk_count });
      // call byteConverter(data.fileSize) to get file size in the appropriate unit
      var file = new Blob([data.arrayBufferFileData], { type: data.fileType });
      thisReceiver.file = file;
      fileArray.push(data.arrayBufferFileData);


      var percentLoaded = Math.round((chunk_count / (file_size / 1000) ) * 100);
      progress.style.width = percentLoaded + '%';
      progress.textContent = percentLoaded + '%';

      //ALTER OR REMOVE TIMEOUT LATER!
      //Maybe by checking if file is complete?
      if(data.isLast == 1){
        setTimeout(function(){
        var fileConstruct = new Blob(fileArray);
        saveAs(fileConstruct, fileName);}, 500);
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

