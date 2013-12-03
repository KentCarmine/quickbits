// SENDER SIDE
$(document).ready(function(){
 //Detect browser type and revision
  navigator.sayswho = (function(){
    var browser = document.querySelector('.alert_browser');
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
    var version = parseFloat(M[1]);
    var browserName = M[0]

    console.log(parseFloat(M[1]))
    if(browserName == 'Firefox' && version >= 23){
      browser.innerHTML = '';
    }

    if(browserName == 'Firefox' && version < 23){
      browser.innerHTML = '<h3> To use this service please upgrade your version of Firefox <a href = http://www.mozilla.org/en-US/firefox/new/> Here </a></h3>';
    }

    if(browserName == 'Chrome' && version >= 31){
      browser.innerHTML = '<h3> The size of the file transfer is limited using this browser.  We recommend using <a href = http://www.mozilla.org/en-US/firefox/new/> FireFox. </a></h3>';
    }



   })();
});



function Sender(file){
  var thisSender = this;
  // this.thisSender = this;
  thisSender.peer = new Peer({ key: "ry9t770xq4hx5hfr" });

  thisSender.peer.on('open', function(id){
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
}

Sender.prototype.getData = function(){
  console.log("getData called");
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

    //Setting up variables to display to initiating user
    var status = document.querySelector('.status_view');
    var progress = document.querySelector('.percent');
    var userFileName = document.querySelector('.file_name');
    var userFileSize = document.querySelector('.file_size');

    status.style.display = 'inline';
    userFileName.textContent = thisSender.file.name,
    userFileSize.textContent = byteConverter(thisSender.file.size);





    // console.log(thisSender);
    // console.log("file data length:");
    // console.log(fileData.byteLength/sliceSize);

    for(var sliceId = 0; sliceId < fileData.byteLength/sliceSize; sliceId++) {
      var percentLoaded = Math.round((sliceId / (fileData.byteLength/sliceSize) ) * 100);
      progress.style.width = percentLoaded + '%';
      progress.textContent = percentLoaded + '%';
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
        isLast:   lastStatus
      }

      callback(fileSliceWithMetaData, thisSender);
    }
  }
}

Sender.prototype.setDownloadUrl = function(){
  // console.log(this);
  // console.log(this.peer_id);
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

