import React, { useState } from 'react';
import FolderIcon from '@material-ui/icons/Folder';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import { Modal } from '@material-ui/core';
import { storage, db, auth } from '../config/firebase';
import firebase from 'firebase/compat/app';

// Styled components
const SidebarContainer = styled.div`
  margin-top: 10px;
`;

const SidebarButton = styled.div`
  position: relative;
  button {
    background: transparent;
    border: 1px solid lightgray;
    display: flex;
    align-items: center;
    border-radius: 40px;
    padding: 5px 10px;
    box-shadow: 2px 2px 2px;
    margin-left: 20px;
    span {
      font-size: 16px;
      margin-right: 20px;
      margin-left: 10px;
    }
  }
`;

const SidebarOptions = styled.div`
  margin-top: 10px;
`;

const SidebarOption = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: whitesmoke;
  }
  svg {
    font-size: 24px;
    color: gray;
  }
  span {
    margin-left: 10px;
    font-size: 14px;
    color: gray;
  }
`;

const ModalPopup = styled.div`
  top: 50%;
  background-color: #fff;
  width: 500px;
  margin: 0 auto;
  position: relative;
  transform: translateY(-50%);
  padding: 10px;
  border-radius: 10px;
`;

const ModalHeading = styled.div`
  text-align: center;
  border-bottom: 1px solid lightgray;
  height: 40px;
  position: relative;
  h3 {
    margin: 0;
    padding: 10px 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 24px;
`;

const ModalBody = styled.div`
  input.modal_submit {
    width: 100%;
    background: darkmagenta;
    padding: 10px 20px;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 5px;
    font-size: 16px;
    border: 0;
    outline: 0;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
  }
  input.modal_file, input.modal_folder {
    background: whitesmoke;
    padding: 20px;
    color: #000;
    display: block;
    margin-top: 20px;
  }
`;

const NewButtonPopup = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid lightgray;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  border-radius: 10px;
  width: 150px;
  padding: 10px;
  z-index: 100;
`;

const Sidebar = ({ onFolderChange }) => {
  const [openFileModal, setOpenFileModal] = useState(false);
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('ClientFiles'); 
  const [newButtonOpen, setNewButtonOpen] = useState(false);
  const [folders, setFolders] = useState(['ClientFiles', 'CaseFiles', 'CourtDocs', 'Billing']); 

  const handleFile = e => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = e => {
    const user = auth.currentUser;
    if (!user) {
      console.error('No user is signed in');
      setUploading(false);
      return;
    }
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    storage.ref(`files/${file.name}`).put(file).then(snapshot => {
      storage.ref('files').child(file.name).getDownloadURL().then(url => {
        db.collection(selectedFolder).add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          filename: file.name,
          fileURL: url,
          size: snapshot._delegate.bytesTransferred,
          userID: user.uid,
        });
        setUploading(false);
        setFile(null);
        setOpenFileModal(false);
      });
    });
  };

  const handleCreateFolder = e => {
    e.preventDefault();
    if (!newFolderName) return;
    setFolders([...folders, newFolderName]);
    setNewFolderName('');
    setOpenFolderModal(false);
  };

  const handleFolderClick = folderName => {
    setSelectedFolder(folderName);
    onFolderChange(folderName); 
  };

  const openNewButtonPopup = () => setNewButtonOpen(!newButtonOpen);

  return (
    <>
      <Modal open={openFileModal} onClose={() => setOpenFileModal(false)}>
        <ModalPopup>
          <form onSubmit={handleUpload}>
            <ModalHeading>
              <h3>Select File you want to upload</h3>
              <CloseButton onClick={() => setOpenFileModal(false)}>&times;</CloseButton>
            </ModalHeading>
            <ModalBody>
              {uploading ? (
                <p>Uploading...</p>
              ) : (
                <>
                  <input type="file" className="modal_file" onChange={handleFile} />
                  <input type="submit" className="modal_submit" value="Upload" />
                </>
              )}
            </ModalBody>
          </form>
        </ModalPopup>
      </Modal>

      <Modal open={openFolderModal} onClose={() => setOpenFolderModal(false)}>
        <ModalPopup>
          <form onSubmit={handleCreateFolder}>
            <ModalHeading>
              <h3>Create New Folder</h3>
              <CloseButton onClick={() => setOpenFolderModal(false)}>&times;</CloseButton>
            </ModalHeading>
            <ModalBody>
              <input
                type="text"
                className="modal_folder"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="New folder name"
              />
              <input
                type="submit"
                className="modal_submit"
                value="Create Folder"
              />
            </ModalBody>
          </form>
        </ModalPopup>
      </Modal>

      <SidebarContainer>
        <SidebarButton>
          <button onClick={openNewButtonPopup}>
            <AddIcon />
            <span>New</span>
          </button>
          {newButtonOpen && (
            <NewButtonPopup>
              <p onClick={() => { setOpenFileModal(true); setNewButtonOpen(false); }}>Upload File</p>
              <p onClick={() => { setOpenFolderModal(true); setNewButtonOpen(false); }}>Create Folder</p>
            </NewButtonPopup>
          )}
        </SidebarButton>
        <SidebarOptions>
          {folders.map((folder, index) => (
            <SidebarOption key={index} onClick={() => handleFolderClick(folder)}>
              <FolderIcon />
              <span>{folder}</span>
            </SidebarOption>
          ))}
        </SidebarOptions>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
