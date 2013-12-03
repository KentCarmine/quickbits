// SENDER SIDE
function Sender(file){
  var thisSender = this;
  // this.thisSender = this;
  thisSender.peer = new Peer({host: 'ancient-lake-1993.herokuapp.com', port: 80});

  thisSender.peer.on('open', function(id){
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
      thisSender.sendFile();
    });
  });
}

Sender.prototype.sendFile = function(callback){
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

    for(var sliceId = 0; sliceId < fileData.byteLength/sliceSize; sliceId++) {
      var percentLoaded = Math.round((sliceId / (fileData.byteLength/sliceSize) ) * 100);
      progress.style.width = percentLoaded + '%';
      progress.textContent = percentLoaded + '%';

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

      thisSender.connection.send(fileSliceWithMetaData);
    }
  }
}

Sender.prototype.setDownloadUrl = function(){
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

