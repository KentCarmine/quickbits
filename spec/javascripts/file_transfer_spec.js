describe("File Transfer", function(){
  it("should transfer a file correctly", function(){
    var fileBlob = new Blob(["this is the text of the file"], {type: "text/plain"});
    fileBlob.name = "testfile.txt";
    var sender = new Sender(fileBlob);

    waitsFor(function(){
        return sender.peer_id !== undefined;
    });

    runs(function(){
      var senderPeerId = sender.peer_id;

      sender.handleConnection();

      var receiver = new Receiver();
      receiver.establishConnection(senderPeerId);
      receiver.handleConnection();

      waitsFor(function(){
        return receiver.file !== undefined;
      });

      runs(function(){
        var fileReader = new FileReader();
        fileReader.readAsText(receiver.file);
        waitsFor(function(){
          return ((fileReader.result !== null) && (fileReader.result !== undefined));
        });

        runs(function(){
          expect(fileReader.result).toBe("this is the text of the file");
        });
      });
    });
  });
});
