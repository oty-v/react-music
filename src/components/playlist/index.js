import { useState } from 'react';
import firebase from 'firebase/app';
import { getSearchData } from "./../api/youtube";
import {ReactComponent as PlayBtn} from "./../../assets/play.svg";
import Editor from "./../editor/index"

function Playlist({message,imgSrc,getSongData}) {
  const [ modalActive, setModalActive ] = useState(false);
  const [formValue, setFormValue] = useState('');
  const messagesRef = firebase.firestore().collection('messages');
    const { text, songs } = message;
    const sendMessage = async (e) => {
        e.preventDefault();
        const data = await getSearchData(formValue);
        const songData = {
            author:data.channel.title.replace(/\s-\sTopic/g, ''),
            id:data.id,
            title:data.title,
            url:data.shortURL,
            seconds:data.durationSeconds,
            imgUrl:data.maxRes.url
        }
        await messagesRef.doc(message.id).update({
            songs: firebase.firestore.FieldValue.arrayUnion(songData)
        });
        setFormValue('');
    }
    const sendRemove = async (props) => {
        const messagesRef = firebase.firestore().collection('messages');
        await messagesRef.doc(message.id).update({
            songs: songs.filter(song => song.id !== props)
        });
    }
    const time = (props) => {
        const h = props/3600 ^ 0;
        const m = (props-h*3600)/60 ^ 0;
        const s = props-h*3600-m*60 ;
        if(h!==0){
            return (`${h}:${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`);
        }else{
            return (`${m}:${s < 10 ? "0" + s : s}`);
        }
    }
    const plistTime = () => {
        let allTime = 0;
        songs.map(i=>allTime=allTime+i.seconds)
        return time(allTime)
    }
    const modalTogle = () => setModalActive(!modalActive);
    const modalCont = (
      <Editor docid={message.id} modalTogle={modalTogle} messagesRef={messagesRef}/>
    )
    const allSongs = (props) => {
        const arr = [...songs]
        arr.unshift(...arr.splice(props));
        getSongData(arr);
    }
    return(
        <>
        {modalActive && modalCont}
        <div className="modal-body">
            <div className="border-bottom border-info">
                <div className="plist-info">
                    <img src={imgSrc} alt={text}/>
                    <div className="card-body">
                        <small>Playlist</small>
                        <h1 className="card-title">{text}</h1>
                        <small>{songs?songs.length:0} tracks {songs&&plistTime()}</small>
                        <div className="plist-btn-block">
                            <button className="plist-btn-play" onClick={() => getSongData(songs)}>
                                <PlayBtn/>
                            </button>
                            <button className="plist-btn-edit" onClick={modalTogle}>EDIT</button>
                        </div>
                    </div>
                </div>
                <form className="search-form" onSubmit={sendMessage}>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search"
                        value={formValue}
                        onChange={(e)=>setFormValue(e.target.value)}
                    />
                </form>
            </div>
            {songs&&(
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
                            {songs.map((props,i)=>(
                                <tr
                                    key={props.id}
                                >
                                    <th scope="row">
                                        <span>{i+1}</span>
                                        <PlayBtn className="song-play-btn" onClick={() => allSongs(i)}/>
                                    </th>
                                    <td className="song-img"><img src={props.imgUrl} alt={props.id}></img></td>
                                    <td className="table-item-name"><div><b>{props.title}</b></div><small style={{color: "#17a2b8"}}>{props.author}</small></td>
                                    <td>
                                        <button className="song-del-btn" onClick={()=>sendRemove(props.id)}>DELETE</button>
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
    )
}

export default Playlist;