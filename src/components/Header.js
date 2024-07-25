import React, { useState } from 'react';
import styled from "styled-components";
import { useDispatch } from 'react-redux';
import { setSearchTerm } from '../redux/action';
import SearchIcon from "@material-ui/icons/Search";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SettingsIcon from '@material-ui/icons/Settings';
import AppsIcon from '@material-ui/icons/Apps';
import { Avatar, Button } from '@material-ui/core';
import { auth } from '../config/firebase'; // Import Firebase auth
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 300px auto 200px;
  align-items: center;
  padding: 5px 20px;
  height: 60px;
  border-bottom: 1px solid lightgray;
`;

const HeaderLogo = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 40px;
  }
  span {
    font-size: 22px;
    margin-left: 10px;
    color: gray;
  }
`;

const HeaderSearch = styled.div`
  display: flex;
  align-items: center;
  width: 700px;
  background-color: whitesmoke;
  padding: 12px;
  border-radius: 10px;
  input {
    background-color: transparent;
    border: 0;
    outline: 0;
    flex: 1;
  }
`;

const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  span {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  svg.MuiSvgIcon-root {
    margin: 0px 10px;
  }
`;

const SubMenu = styled.div`
  position: absolute;
  top: 70px; /* Adjust based on header height */
  right: 20px;
  background: white;
  border: 1px solid lightgray;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
  padding: 10px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  button {
    background: transparent;
    border: none;
    padding: 10px;
    text-align: left;
    cursor: pointer;
    &:hover {
      background: #f0f0f0;
    }
  }
`;

const Header = ({ photoURL, onSearchClick }) => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [showSubMenu, setShowSubMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClick = () => {
    dispatch(setSearchTerm(searchValue));
    onSearchClick();
    setSearchValue('') //clear the search bar when the user clicks search
  };

  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigate('/login'); //Redirect to login page after user signs out
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  const toggleSubMenu = () => {
    setShowSubMenu(prev => !prev);
  };

  const handleClickOutside = (e) => {
    if (e.target.closest('.avatar-container') === null) {
      setShowSubMenu(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <HeaderContainer>
      <HeaderLogo>
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" alt="Google Drive"></img>
        <span>Drive</span>
      </HeaderLogo>
      <HeaderSearch>
        <SearchIcon />
        <input type="text" placeholder="Search in Drive" value={searchValue} onChange={handleSearchChange} />
        <Button onClick={handleSearchClick}>Search</Button>
      </HeaderSearch>
      <HeaderIcon>
        <span>
          <a href="https://support.google.com/drive" target="_blank" rel="noopener noreferrer">
            <HelpOutlineIcon />
          </a>
          <SettingsIcon />
        </span>
        <span className="avatar-container" style={{ position: 'relative' }}>
          <AppsIcon />
          <Avatar
            src={photoURL}
            onClick={toggleSubMenu}
            style={{ cursor: 'pointer' }}
          />
          {showSubMenu && (
            <SubMenu>
              <button onClick={handleSignOut}>Sign Out</button>
            </SubMenu>
          )}
        </span>
      </HeaderIcon>
    </HeaderContainer>
  );
};

export default Header;
