var youtube = require("youtube-api");
var ytdl = require("ytdl-core");
var fs = require("fs");

function pullPlayListRecursive (playlistId, fileName, callStackSize, pageToken){
  youtube.playlistItems.list({
    part:"snippet",
    pageToken: pageToken,
    maxResults:50,
    playlistId:playlistId
  }, function(err, data){
    if (err) return console.log("error");
    for (var x in data.items){
      var test = "https://www.youtube.com/watch?v=" +
      data.items[x].snippet.resourceId.videoId;
      var y = parseInt(x) + callStackSize*50
      ytdl(test,
        {
          filter: function(format) {
            return format.container === 'mp4' && format.resolution == null && format.audioBitrate == 128;
          }
        }
      ).pipe(fs.createWriteStream(fileName + y +'.mp3'));
    }

    if (data.nextPageToken){
      pullPlayListRecursive(playlistId, fileName, callStackSize+1, data.nextPageToken);
    }
  });
}


exports.pullPlaylist = function (apiKey, playlistId, fileName){

  youtube.authenticate({
    type: "key",
    key: apiKey
  });

  pullPlayListRecursive(playlistId, fileName, 0, null);
}

// pullPlayList("playlist id here", "name of mp3 here");
