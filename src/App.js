import { useState } from "react";
import axios from "axios";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "./App.css";

import logo from "./assets/logo.png";

import { useAuthState } from "react-firebase-hooks/auth";
import Collection from "./components/collection";

import ReactPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";

firebase.initializeApp({
  apiKey: "AIzaSyC9EFvHjxx-setkSTCxI1u6eWPwFsNsfGE",
  authDomain: "isky-unity-music.firebaseapp.com",
  projectId: "isky-unity-music",
  storageBucket: "isky-unity-music.appspot.com",
  messagingSenderId: "976107155751",
  appId: "1:976107155751:web:4ff6c77a991f8a4643f902",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
function App() {
  const [playData, setPlayData] = useState([]);
  const [removeSongs, setRemoveSongs] = useState({
    playsong: false,
    unmount: false,
  });

  const [user] = useAuthState(auth);

  const getSongData = async (songs) => {
    setRemoveSongs({
      playsong: false,
      unmount: true,
    });
    try {
      for (const i of songs) {
        const songUrl = await axios(
          `https://express-music-api.herokuapp.com/youtube?URL=${i.id}`
        );
        if (!songUrl.data) {
          alert(`Video "${i.title}" is blocked on YouTube and will not play!`);
        } else {
          setPlayData([
            {
              musicSrc: songUrl.data,
              name: i.title,
              cover: i.imgUrl,
              singer: i.author,
            },
          ]);
          setRemoveSongs({
            playsong: true,
            unmount: false,
          });
        }
      }
    } catch (e) {
      alert("Sorry Something Want Wrong Please Try Again");

      setPlayData({ loading: false });
    }
  };
  return (
    <div className="flex-container main">
      <header className="navbar justify-content-between border-bottom border-info">
        <img className="logo" src={logo} alt="Unity Music" />
        <SignOut />
      </header>

      <section className="section-list">
        {user ? (
          <Collection
            auth={auth}
            firestore={firestore}
            getSongData={getSongData}
          />
        ) : (
          <SignIn />
        )}
      </section>
      {removeSongs.playsong && (
        <ReactPlayer
          locale={"en_US"}
          showMediaSession
          audioLists={playData}
          theme="dark"
          mode="full"
          showReload={false}
          showDownload={false}
          showThemeSwitch={false}
          remove={false}
          unmount={removeSongs.unmount}
        />
      )}
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <div className="signIn">
      <h1>Unity Music</h1>
      <p>
        This is the place where you can combine playlists from Spotify and
        YouTube
      </p>
      <button className="btn btn-outline-info" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="btn btn-outline-info" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

export default App;
