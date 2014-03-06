$(document).ready(function(){
  //Detect browser type and revision
  navigator.sayswho = (function(){
    var browser = document.querySelector('.alert_browser');
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
    var version = parseFloat(M[1]);
    var browserName = M[0];

    if(browserName == 'Firefox' && version >= 23){
      browser.innerHTML = '<h2>  Thanks For Using Quickbits </h2>';
    }

    if(browserName == 'Firefox' && version < 23){
      browser.innerHTML = '<h3> To use this service please upgrade your version of Firefox <a href = http://www.mozilla.org/en-US/firefox/new/> Here </a></h3>';
    }

    if(browserName == 'Chrome' && version >= 31){
      browser.innerHTML = '<p> If file does not transfer confirm may have been sent a file too large for Chrome to handle. Try <a href = http://www.mozilla.org/en-US/firefox/new/>Firefox</a>.</p>';
    }
   })();
});

function Receiver(){
  var thisReceiver = this;
  thisReceiver.peer = new Peer({ host: "ec2-54-201-154-161.us-west-2.compute.amazonaws.com", port: 9000 });
}

Receiver.prototype.establishConnection = function(senderPeerId){
  var thisReceiver = this;
  thisReceiver.connection = thisReceiver.peer.connect(senderPeerId);

  setTimeout(function(){
    var isDone = ($.trim($('.percent').get()[0].innerHTML) == "100%");
    if((thisReceiver.connection.open !== true) && (!isDone)){
      $("#error_message").text("Unable to connect to sender! Connection timed out after 10 sec.");
      return;
    }
  }, 10000);
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
  var alert_browser = document.querySelector('.alert_browser');
  var errorElement = $("#error_message");
  var upload_button = document.querySelector('.button_upload');
  thisReceiver.connection.on("data", function(data){
  alert_browser.innerHTML = "<h2>Your File is Being Transferred</h2>";
  alert_browser.style.display = "inline";

    if(data.isFileMetaData){
      // GLOBAL, COME BACK TO THIS
      file_size = data.fileSize;
      fileName = data.fileName;
      userFileName.textContent = data.fileName;
      size = byteConverter(data.fileSize);
      userFileSize.textContent = size;
    }
    else if(data.isFile){
      chunk_count += 1;

      thisReceiver.connection.send({ isChunkCount: true, chunksReceived: chunk_count });
      var file = new Blob([data.arrayBufferFileData], { type: data.fileType });
      thisReceiver.file = file;
      fileArray.push(data.arrayBufferFileData);

      var percentLoaded = Math.round((chunk_count / (file_size / 56000) ) * 100);

      progress.style.width = percentLoaded + '%';
      progress.textContent = percentLoaded + '%';

      if(percentLoaded >= 100){
        progress.style.width = '100%';
        progress.textContent = '100%';
        alert_browser.innerHTML = "<h2>File Successfully Transferred</h2>";
        upload_button.style.display = "block";
      }

      // Communication heartbeat check
      if(percentLoaded < 100){
        clearTimeout(thisReceiver.timeout);
        thisReceiver.timeout = setTimeout(function(){
          errorElement.text("Connection may have failed. File transfer may have aborted.");
        }, 15000);
      }
      else if(percentLoaded >= 100){
        clearTimeout(thisReceiver.timeout);
      }

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
  var phoneticUrl = splitUrl[splitUrl.length-1];
  var urlStore = new Firebase('https://quickbits.firebaseio.com/' + phoneticUrl);
  var receiver = new Receiver();

  urlStore.on('value', function(snapshot) {
    var senderPeerId = snapshot.val();
    receiver.establishConnection(senderPeerId);
    receiver.handleConnection();
  });

  window.onunload = function(){
    receiver.peer.destroy();
  }
});
