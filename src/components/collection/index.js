/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore";
import Adder from "../adder";
import UserPlaylist from "./../userplaylist/index";
import { ReactComponent as AddBtn } from "./../../assets/add-button.svg";

function Collection({ auth, firestore, getSongData }) {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  const { uid } = auth.currentUser;

  const [messages] = useCollectionData(query, { idField: "id" });

  const [modalActive, setModalActive] = useState(false);
  const modalTogle = () => setModalActive(!modalActive);
  const modalCont = (
    <Adder uid={uid} modalTogle={modalTogle} messagesRef={messagesRef} />
  );
  return (
    <div className="card-list">
      <div
        className="p-card btn-plist-select"
        onClick={modalTogle}
        title="Create a new playlist"
      >
        <AddBtn className="p-img" />
        <div className="card-body">
          <h5 className="p-title">ADD PLAYLIST</h5>
        </div>
      </div>
      {messages &&
        messages.map((msg) => (
          <UserPlaylist
            key={msg.id}
            message={msg}
            auth={auth}
            getSongData={getSongData}
          />
        ))}
      {modalActive && modalCont}
    </div>
  );
}

export default Collection;
