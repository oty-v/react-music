import YouTube from "simple-youtube-api";

const API_KEY = "AIzaSyDNptt6BUIQiO5IcVTolWSXnuHXFzB9G3Q";

export const getSearchData = async (props) => {
  const youtube = new YouTube(API_KEY);

  const data = await youtube.getVideo(props).catch((e) => {
    console.log(e);
  });

  return data;
};
