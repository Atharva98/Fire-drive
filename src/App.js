import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Data from './components/Data';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './components/SearchResults';

const AppContainer = styled.div`
  display: flex;
`;

const App = () => {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState('ClientFiles');

  const handleSearchClick = () => {
    setShowSearchResults(true);
  };

  const handleCloseSearchResults = () => {
    setShowSearchResults(false);
  };

  const handleFolderChange = (folderName) => {
    setSelectedFolder(folderName);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        {user ? (
          <>
            <Route path="/" element={
              <>
                <Header photoURL={user.photoURL} onSearchClick={handleSearchClick} />
                {showSearchResults && <SearchResults onClose={handleCloseSearchResults} />}
                <AppContainer>
                  <Sidebar onFolderChange={handleFolderChange} />
                  <Data selectedFolder={selectedFolder} user={user} />
                </AppContainer>
              </>
            } />
          </>
        ) : (
          <Route path="/" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
