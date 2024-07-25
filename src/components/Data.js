import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ListIcon from '@material-ui/icons/List';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import styled from 'styled-components';
import { db, storage } from '../config/firebase';
import ContextMenu from './ContextMenu';
import { setFiles, deleteFile } from '../redux/action';

const DataContainer = styled.div`
  flex: 1 1;
  padding: 10px 0px 0px 10px;
`;

const DataHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid lightgray;
  height: 40px;
  .headerLeft {
    display: flex;
    align-items: center;
  }
  .headerRight svg {
    margin: 0px 10px;
  }
`;

const DataGrid = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const DataFile = styled.div`
  text-align: center;
  border: 1px solid rgb(204 204 204 / 46%);
  margin: 10px;
  min-width: 200px;
  padding: 10px 0px 0px 0px;
  border-radius: 5px;
  position: relative;
  svg {
    font-size: 60px;
    color: gray;
  }
  p {
    border-top: 1px solid #ccc;
    margin-top: 5px;
    font-size: 12px;
    background: whitesmoke;
    padding: 10px 0px;
  }
`;

const DataListRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  p {
    display: flex;
    align-items: center;
    font-size: 13px;
    b {
      display: flex;
      align-items: center;
    }
    svg {
      font-size: 22px;
      margin: 10px;
    }
  }
`;

const Data = ({ selectedFolder, user }) => {
  const dispatch = useDispatch();
  const files = useSelector(state => state.files);
  const [contextMenu, setContextMenu] = useState(null);
  const dataContainerRef = useRef(null);

  useEffect(() => {
    if (!user) {
      console.error('User is not logged in.');
      return;
    }

    const fetchFiles = async () => {
      try {
        const userId = user.uid; // Get the current user ID
        const folderRef = db.collection(selectedFolder);
        const snapshot = await folderRef.where("userId", "==", userId).get();
        const fetchedFiles = snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }));
        dispatch(setFiles(fetchedFiles));
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();

    const unsubscribe = db.collection(selectedFolder).onSnapshot(snapshot => {
      const fetchedFiles = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      }));
      dispatch(setFiles(fetchedFiles));
    });

    return () => unsubscribe();
  }, [dispatch, selectedFolder, user]); 

  //convert the firestore size to actual size
  const changeBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleContextMenu = (event, file) => {
    event.preventDefault();
    setContextMenu({
      file,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const handleDelete = async () => {
    if (contextMenu && selectedFolder) {
      const file = contextMenu.file;
      try {
        // Delete from Firestore
        await db.collection(selectedFolder).doc(file.id).delete();
        // Delete from Storage
        const fileRef = storage.refFromURL(file.data.fileURL);
        await fileRef.delete();
        // Dispatch delete action
        dispatch(deleteFile(file.id));
      } catch (error) {
        console.error('Error deleting file: ', error);
      } finally {
        setContextMenu(null);
      }
    }
  };

  const handleShare = () => {
    if (contextMenu) {
      const file = contextMenu.file;
      const fileURL = file.data.fileURL;
      const subject = encodeURIComponent('Shared File from My Drive');
      const body = encodeURIComponent(`Here is the file you requested: ${fileURL}`);
      const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
      setContextMenu(null);
    }
  };

  const handleClickOutside = (event) => {
    if (dataContainerRef.current && !dataContainerRef.current.contains(event.target)) {
      setContextMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <DataContainer ref={dataContainerRef}>
      <DataHeader>
        <div className="headerLeft">
          <p>{selectedFolder}</p>
          <ArrowDropDownIcon />
        </div>
        <div className="headerRight">
          <ListIcon />
          <InfoOutlinedIcon />
        </div>
      </DataHeader>
      <div>
        <DataGrid>
          {files.map(file => (
            <DataFile key={file.id} onContextMenu={(e) => handleContextMenu(e, file)}>
              <InsertDriveFileIcon />
              <p>{file.data.filename}</p>
            </DataFile>
          ))}
        </DataGrid>
        <div>
          <DataListRow>
            <p>
              <b>
                Name <ArrowDownwardIcon />
              </b>
            </p>
            <p>
              <b>Owner</b>
            </p>
            <p>
              <b>Last Modified</b>
            </p>
            <p>
              <b>File Size</b>
            </p>
          </DataListRow>
          {files.map(file => (
            <DataListRow key={file.id}>
              <a href={file.data.fileURL} target='_blank' rel="noopener noreferrer">
                <p><InsertDriveFileIcon />{file.data.filename}</p>
              </a>
              <p>Me</p>
              <p>{new Date(file.data.timestamp?.toDate()).toLocaleString()}</p>
              <p>{changeBytes(file.data.size)}</p>
            </DataListRow>
          ))}
        </div>
      </div>
      {contextMenu && (
        <ContextMenu
          position={contextMenu.position}
          onDelete={handleDelete}
          onShare={handleShare}
        />
      )}
    </DataContainer>
  );
};

export default Data;
