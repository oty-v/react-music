import { useRef, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';

function Adder({modalTogle, uid, messagesRef}) {
  const [formValue, setFormValue] = useState('');
  const storageRef = firebase.storage().ref()
  const onImg = useRef(null)

  const sendMessage = async (e) => {
    e.preventDefault();
    const file = onImg.current.files[0];
    messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      imgURL:null
    })
    .then(function(docRef) {
      if(file){
        const fileRef = storageRef.child(docRef.id);
        fileRef.put(file).then(() => {
          fileRef.getDownloadURL().then((downloadURL) => {
            messagesRef.doc(docRef.id).update({ imgURL: downloadURL });
          });
        });
      };
      modalTogle();
    })
  }


  return (
    <div className="adder-modal">
        <div className="modal-dialog">
            <div className="modal-content modal-dark">
            <div className="modal-header">
                <h5 className="modal-title">Add Playlist</h5>
            </div>
            <div className="modal-body">
            <form onSubmit={sendMessage}>
                <div className="form-group">
                    <label for="exampleFormControlFile1">Playlist Image</label>
                    <input
                      ref={onImg}
                      type="file"
                      className="form-control-file"
                    />
                </div>
                <div className="form-group">
                    <label for="formGroupExampleInput">Playlist Title</label>
                    <input
                      value={formValue}
                      onChange={(e)=>setFormValue(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Enter the title"
                    />
                </div>
                <div className="modal-footer">
                  <button type="submit" disabled={!formValue} className="btn btn-outline-info">Save changes</button>
                  <button type="button" className="btn btn-outline-light" data-dismiss="modal"  onClick={modalTogle}>Close</button>
                </div>
          </form></div>
          </div>
         </div>
    </div>
  );
}

export default Adder;