import { useRef, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';

function Editor({modalTogle, docid, messagesRef}) {
  const [formValue, setFormValue] = useState('');
  const storageRef = firebase.storage().ref()
  const onImg = useRef(null)

  const sendMessage = async (e) => {
    e.preventDefault();
    const file = onImg.current.files[0];
    if(formValue!==''){
        messagesRef.doc(docid).update({ text: formValue })
    }
    if(file){
        const fileRef = storageRef.child(docid);
        fileRef.delete().then(() => {
            fileRef.put(file).then(() => {
                fileRef.getDownloadURL().then((downloadURL) => {
                    messagesRef.doc(docid).update({ imgURL: downloadURL });
                });
            });
        });
    }
  }
  const deletePlaylist = () => {
    messagesRef.doc(docid).delete();
    const fileRef = storageRef.child(docid);
    fileRef.delete();
  }

  return (
    <div class="adder-modal">
        <div class="modal-dialog">
            <div class="modal-content modal-dark">
            <div class="modal-header">
                <h5 class="modal-title">Edit Playlist</h5>
            </div>
            <div class="modal-body">
            <form onSubmit={sendMessage}>
                <div class="form-group">
                    <label for="exampleFormControlFile1">Playlist Image</label>
                    <input 
                      ref={onImg} 
                      type="file" 
                      class="form-control-file" 
                    />
                </div>
                <div class="form-group">
                    <label for="formGroupExampleInput">Playlist Title</label>
                    <input 
                      value={formValue} 
                      onChange={(e)=>setFormValue(e.target.value)} 
                      type="text" 
                      class="form-control" 
                      placeholder="Enter the title"
                    />
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-danger" onClick={()=>deletePlaylist()}>Delete playlist</button>
                  <button type="submit" class="btn btn-outline-info">Save changes</button>
                  <button type="button" class="btn btn-outline-light" data-dismiss="modal"  onClick={modalTogle}>Close</button>
                </div>
          </form></div>
          </div>
         </div>
    </div>
  );
}

export default Editor;