// RECEIVER SIDE

function Receiver(){
  var thisReceiver = this;
  thisReceiver.peer = new Peer({ key: "ry9t770xq4hx5hfr" });
}

Receiver.prototype.establishConnection = function(senderPeerId){
  var thisReceiver = this;
  // console.log("establishConnection called");

  thisReceiver.connection = thisReceiver.peer.connect(senderPeerId);
}

Receiver.prototype.handleConnection = function(){
  var thisReceiver = this;
  thisReceiver.connection.on("open", function(){
    thisReceiver.getData();
  });
}


Receiver.prototype.getData = function(){
  // console.log("getData called");
  var fileArray = [];
  var thisReceiver = this;
  var chunk_count = 0;
  var progress = document.querySelector('.percent');
  var userFileName = document.querySelector('.file_name');
  var userFileSize = document.querySelector('.file_size');
  // var progress = $('.percent');

  thisReceiver.connection.on("data", function(data){
    // console.log("data received in getData");

    if(data.isFileMetaData){
      // console.log("GOT: " + data); //tester code
      // console.log("GOT: " + data.fileSize);
      // var chunk_count = 0;
      // var file_size = data.fileSize;

      // GLOBAL, COME BACK TO THIS
      file_size = data.fileSize;
      console.log(data.fileName);
      userFileName.textContent = data.fileName;
      size = byteConverter(data.fileSize);
      console.log(size);
      userFileSize.textContent = size;
      console.log(file_size);
      console.log("got fileMetaData, should not be here!");
    }
    else if(data.isFile){
      chunk_count += 1;
      // console.log(chunk_count);
      // call byteConverter(data.fileSize) to get file size in the appropriate unit
      var file = new Blob([data.arrayBufferFileData], { type: data.fileType });
      thisReceiver.file = file;
      fileArray.push(data.arrayBufferFileData);
      // console.log("file_size");
      // console.log(file_size);
      // console.log("chunk count / file size");
      // console.log(chunk_count / (file_size/1000));

      var percentLoaded = Math.round((chunk_count / (file_size / 1000) ) * 100);
      // console.log(percentLoaded);
      // $('.percent').html(percentLoaded + '%');
      progress.style.width = percentLoaded + '%';
      progress.textContent = percentLoaded + '%';

      //added progress code, untested
    // function updateProgress(evt) {
    //   console.log("inside updateProgress")
    //   // evt is an ProgressEvent.
    //   if (evt.lengthComputable) {
    //     console.log("lengthComputable")
    //     console.log(lengthComputable)
    //     var percentLoaded = Math.round((chunk_count/file_size/1000) * 100);
    //     // Increase the progress bar length.
    //     if (percentLoaded < 100) {
    //       progress.style.width = percentLoaded + '%';
    //       progress.textContent = percentLoaded + '%';
    //     }
    //   }
    // }

      //ALTER OR REMOVE TIMEOUT LATER!
      //Maybe by checking if file is complete?
      if(data.isLast == 1){
        // console.log("in data.islast");
        setTimeout(function(){
        var fileConstruct = new Blob(fileArray);
        saveAs(fileConstruct, data.fileName);}, 500);
      }

      // debugger;
      // console.log(file);
      // console.log(data.arrayBufferFileData);
      // saveAs(file, data.fileName);
    }

    // thisReceiver.sendData("I got it!"); //tester code
  });
}

Receiver.prototype.sendData = function(dataToSend){
  var thisReceiver = this;
  thisReceiver.connection.send(dataToSend); //tester code
}

function byteConverter(bytes){
  var kilobyte = 1024;
  var megabyte = kilobyte * 1024;
  var gigabyte = megabyte * 1024;

  if (Math.floor(bytes/gigabyte) > 0){
    return (bytes/gigabyte).toFixed(2) + " GB"
  }
  else if (Math.floor(bytes/megabyte) > 0){
    return (bytes/megabyte).toFixed(2) + " MB"
  }
  else if (Math.floor(bytes/kilobyte) > 0){
    return (bytes/kilobyte).toFixed(2) + " kB"
  }
  else {
    return bytes + " B"
  }
}

$(function(){
  // debugger;
  var splitUrl = window.location.href.split("/");
  var senderPeerId = splitUrl[splitUrl.length-1];
  // console.log(senderPeerId);
  var receiver = new Receiver();
  // var senderPeerId = $("p").text();
  // console.log(senderPeerId);
  // debugger;

  receiver.establishConnection(senderPeerId);
  receiver.handleConnection();
});

