import YouTube from "simple-youtube-api";

const API_KEY = "AIzaSyDNptt6BUIQiO5IcVTolWSXnuHXFzB9G3Q";

export const getPlaylistData = async (props) => {
  const youtube = new YouTube(API_KEY);
  const playlist = await youtube.getPlaylist(props);
  const videos = await playlist.getVideos().catch(console.log);
  const data = [];
  for(const i of videos){
    data.push(await youtube.getVideo(i.url).catch(console.log));
  }
  console.log(data);
  return data;
};

export const getSearchData = async (props) => {
  const youtube = new YouTube(API_KEY);
  const data = await youtube.getVideo(props).catch(console.log);
  return data;
};
