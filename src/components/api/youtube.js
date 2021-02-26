import YouTube from "simple-youtube-api";

const API_KEY = "";

export const getPlaylistData = async (props) => {
  const youtube = new YouTube(API_KEY);
  const playlist = await youtube.getPlaylist(props);
  const videos = await playlist.getVideos().catch(console.log);
  const data = [];
  for (const i of videos) {
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

export const getSearchVideo = async (props) => {
  const youtube = new YouTube(API_KEY);
  const video = await youtube.searchVideos(props, 1).catch(console.log);
  const data = await youtube.getVideo(video[0].url).catch(console.log);
  return data;
};
