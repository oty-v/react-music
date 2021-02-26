import { useState } from "react";
import axios from "axios";
import firebase from "firebase/app";
import {
  getPlaylistData,
  getSearchData,
  getSearchVideo,
} from "./../api/youtube";
import { ReactComponent as PlayBtn } from "./../../assets/play.svg";
import Editor from "./../editor/index";

function Playlist({ message, imgSrc, getSongData }) {
  const [modalActive, setModalActive] = useState(false);
  const [formValue, setFormValue] = useState("");
  const messagesRef = firebase.firestore().collection("messages");
  const { text, songs } = message;
  const setSongData = async (getData) => {
    const songData = {
      author: getData.channel.title.replace(/\s-\sTopic/g, ""),
      id: getData.id,
      title: getData.title,
      url: getData.shortURL,
      seconds: getData.durationSeconds,
      imgUrl: getData.maxRes.url,
    };
    await messagesRef.doc(message.id).update({
      songs: firebase.firestore.FieldValue.arrayUnion(songData),
    });
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (formValue.includes("list=")) {
      const data = await getPlaylistData(formValue);
      for (const i of data) {
        await setSongData(i);
      }
      setFormValue("");
    } else if (formValue.includes("spotify")) {
      if (formValue.includes("track")) {
        const urlData = await axios(
          `https://...com/spotify/track?URL=${formValue}`
        );
        const data = await getSearchVideo(
          `${urlData.data.title} - ${urlData.data.artist}`
        );
        await setSongData(data);
        setFormValue("");
      } else if (formValue.includes("playlist")) {
        const urlData = await axios(
          `https://...com/spotify/playlist?URL=${formValue}`
        );
        for (const i of urlData.data) {
          const data = await getSearchVideo(`${i.artists[0].name} ${i.name}`);
          await setSongData(data);
        }
        setFormValue("");
      }
    } else {
      const data = await getSearchData(formValue);
      await setSongData(data);
      setFormValue("");
    }
  };
  const sendRemove = async (props) => {
    const messagesRef = firebase.firestore().collection("messages");
    await messagesRef.doc(message.id).update({
      songs: songs.filter((song) => song.id !== props),
    });
  };
  const time = (props) => {
    const h = (props / 3600) ^ 0;
    const m = ((props - h * 3600) / 60) ^ 0;
    const s = props - h * 3600 - m * 60;
    if (h !== 0) {
      return `${h}:${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
    } else {
      return `${m}:${s < 10 ? "0" + s : s}`;
    }
  };
  const plistTime = () => {
    let allTime = 0;
    songs.map((i) => (allTime = allTime + i.seconds));
    return time(allTime);
  };
  const modalTogle = () => setModalActive(!modalActive);
  const modalCont = (
    <Editor
      docid={message.id}
      modalTogle={modalTogle}
      messagesRef={messagesRef}
    />
  );
  const allSongs = (props) => {
    const arr = [...songs];
    arr.unshift(...arr.splice(props));
    getSongData(arr);
  };
  return (
    <>
      {modalActive && modalCont}
      <div className="modal-body">
        <div className="border-bottom border-info">
          <div className="plist-info">
            <img src={imgSrc} alt={text} />
            <div className="card-body">
              <small>Playlist</small>
              <h1 className="card-title">{text}</h1>
              <small>
                {songs ? songs.length : 0} tracks {songs && plistTime()}
              </small>
              <div className="plist-btn-block">
                <button
                  className="plist-btn-play"
                  title={`Listen ${text}`}
                  onClick={() => getSongData(songs)}
                >
                  <PlayBtn />
                </button>
                <button
                  className="plist-btn-edit"
                  title={`Edit ${text}`}
                  onClick={modalTogle}
                >
                  EDIT
                </button>
              </div>
            </div>
          </div>
          <form className="search-form" onSubmit={sendMessage}>
            <input
              className="search-input"
              type="text"
              placeholder="Search"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
            />
          </form>
        </div>
        {songs && (
          <div className="plist-table">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col"></th>
                  <th scope="col">Name/Author</th>
                  <th scope="col"></th>
                  <th scope="col">🕗</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((props, i) => (
                  <tr key={props.id}>
                    <th scope="row">
                      <span>{i + 1}</span>
                      <PlayBtn
                        className="song-play-btn"
                        title={`Listen ${props.title}`}
                        onClick={() => allSongs(i)}
                      />
                    </th>
                    <td className="song-img">
                      <img src={props.imgUrl} alt={props.id}></img>
                    </td>
                    <td className="table-item-name">
                      <div className="cont-song-title">
                        <b className="song-bold-title">{props.title}</b>
                      </div>
                      <small style={{ color: "#17a2b8" }}>{props.author}</small>
                    </td>
                    <td>
                      <button
                        className="song-del-btn"
                        title={`Delete ${props.title}`}
                        onClick={() => sendRemove(props.id)}
                      >
                        DELETE
                      </button>
                    </td>
                    <td>{time(props.seconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Playlist;
