import { useState } from "react";
import Plist from "../playlist";
import noSignal from "./../../assets/no-signal.jpg";

function UserPlaylist({ message, auth, getSongData }) {
  const [playlistSelect, setPlaylistSelect] = useState(false);
  const { text, uid, imgURL } = message;
  if (uid !== auth.currentUser.uid) {
    return null;
  }
  const imgSrc = imgURL || noSignal;
  const plist = (
    <div className="plist-modal">
      <div className="modal-header border-bottom border-info">
        <button
          className="btn-back"
          type="button"
          title="Back to collection"
          onClick={() => setPlaylistSelect(false)}
        >
          ←
        </button>
      </div>
      <Plist message={message} imgSrc={imgSrc} getSongData={getSongData} />
    </div>
  );
  return (
    <>
      <div
        className="p-card btn-plist-select"
        title="Open playlist"
        onClick={() => setPlaylistSelect(true)}
      >
        <img className="rounded-top" src={imgSrc} alt={text} />
        <div className="card-body">
          <h5 className="p-title">{text}</h5>
        </div>
      </div>
      {playlistSelect && plist}
    </>
  );
}

export default UserPlaylist;
