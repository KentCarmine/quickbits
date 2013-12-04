// SENDER SIDE

//Detect browser type and revision
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
  thisSender.peer = new Peer({ host: "ancient-lake-1993.herokuapp.com", port: 80 });

  thisSender.peer.on('open', function(id){
    console.log("Peer open");
    thisSender.peer_id = id;
    thisSender.setDownloadUrl();
  });

  thisSender.file = file;
}

Sender.prototype.handleConnection = function(){
  var thisSender = this;
  thisSender.peer.on("connection", function(connection){
    thisSender.connection = connection;

    thisSender.connection.on("open", function(){
      thisSender.sendFileAndMetadata();
      thisSender.updateProgressBar();
      // thisSender.handleDisconnectionError();
    });
  });
}

Sender.prototype.updateProgressBar = function(){
  var progress = document.querySelector('.percent');
  var progress_bar = document.querySelector('#progress_bar')
  var value_prop = document.querySelector(".value_prop");
  var link_field = document.querySelector('.link_field');
  var button_upload = document.querySelector(".button_upload");
  // var errorElement = document.querySelector('#error_message')
  var errorElement = $("#error_message");
  var thisSender = this;
  var sliceSize = 1000;
  link_field.style.display = "none";

  value_prop.innerHTML = "<h1> File Being Transferred</h1>"
  thisSender.connection.on("data", function(data){

    if(data.isChunkCount){
      errorElement.text("");
      var chunksReceivedByRemotePeer = parseInt(data.chunksReceived);
      var percentLoaded = Math.round((chunksReceivedByRemotePeer / (thisSender.file.size/sliceSize) ) * 100);
      progress.style.width = percentLoaded + '%';
      progress.textContent = percentLoaded + '%';
    // }


      // Communication heartbeat check
      if(percentLoaded < 100){
        clearTimeout(thisSender.timeout);
        thisSender.timeout = setTimeout(function(){
          errorElement.text("Connection lost! File transfer aborted!");
        }, 1000);
      }
      else if(percentLoaded >= 100){
        clearTimeout(thisSender.timeout);
        value_prop.innerHTML = "<h1> File Successfully Transferred</h1>";
        button_upload.style.display = "inline";
        progress.style.display = "none";
        progress_bar.style.display = "none";
        window.onbeforeunload = null;
      }
    }
  });
}

Sender.prototype.sendFileAndMetadata = function(){
  // console.log(this);
  var thisSender = this;

  var fileMetadata = {
    isFileMetaData: true,
    fileSize: thisSender.file.size,
    fileName: thisSender.file.name
  }
  thisSender.connection.send(fileMetadata);

  thisSender.sendFile();
}

Sender.prototype.sendFile = function(){
  var thisSender = this;
  var fileReader = new FileReader();
  fileReader.readAsArrayBuffer(thisSender.file);


  window.onbeforeunload = function() {
    return "If you close the window the file will not finish transfer.";
 };


  fileReader.onload = function(){
    var fileData = fileReader.result;
    var blob = [];
    var sliceSize = 1000;

    //Setting up variables to display to initiating user
    var status = document.querySelector('.status_view');

    var percent = document.querySelector('.percent');
    var progress_bar = document.querySelector('#progress_bar');
    var userFileName = document.querySelector('.file_name');
    var userFileSize = document.querySelector('.file_size');

    status.style.display = 'inline';
    progress_bar.style.display = '';
    percent.style.display = '';
    userFileName.textContent = thisSender.file.name;
    userFileSize.textContent = byteConverter(thisSender.file.size);

    for(var sliceId = 0; sliceId < fileData.byteLength/sliceSize; sliceId++) {
      // var percentLoaded = Math.round((sliceId / (fileData.byteLength/sliceSize) ) * 100);
      // progress.style.width = percentLoaded + '%';
      // progress.textContent = percentLoaded + '%';

      if(sliceId >= Math.floor(fileData.byteLength/sliceSize)) {
        var lastStatus = 1;
      }
      else {
        var lastStatus = 0;
      }

      blob = fileData.slice(sliceId * sliceSize, (sliceId + 1) * sliceSize);

      var fileSlice = {
        isFile: true,
        arrayBufferFileData: blob,
        isLast:   lastStatus
      }

      thisSender.connection.send(fileSlice);
    }
  }
}

Sender.prototype.setDownloadUrl = function(){
  // $(".value_prop").update("Share this link to start file transfer")
  var value_prop = document.querySelector(".value_prop");
  var button_upload = document.querySelector(".button_upload");
  var link_field  = document.querySelector(".link_field");
  var status = document.querySelector('.status_view');

  value_prop.innerHTML = "<h1>Share this link to start file transfer</h1>";
  button_upload.style.display = "none";
  link_field.style.display = "inline";
  status.style.display = "none";
  $("#url").val(window.location.href + this.peer_id);
}

$(function(){

  $("#file_input").change(function(event){
    var file = event.target.files[0];
    var sender = new Sender(file);
    console.log(sender);
    sender.handleConnection();
  });

  $("#drop_zone").on("dragover", function(event){
    event.preventDefault();
    event.stopPropagation();
    $(this).css("background","url(/assets/pMAiU.jpg)");
    $(this).css("-webkit-background-size","cover");
    $(this).css(" -moz-background-size","cover");
    $(this).css("-o-background-size","cover");
    $(this).css("background-size","cover");
    event.originalEvent.dataTransfer.dropEffect = "copy";
  });

  $("#drop_zone").on("drop", function(event){
    $(this).css("background","white");
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

