import React from 'react';
import { useSelector } from 'react-redux';
import styled from "styled-components";
import CloseIcon from '@material-ui/icons/Close';

//to display the results
const ResultsContainer = styled.div`
  padding: 20px;
  position: relative;
  background-color: white;
  border: 1px solid lightgray;
  border-radius: 5px;
  width: 80%; /* Adjust width as needed */
  max-height: 60vh; /* Adjust max-height to fit within the viewport */
  overflow-y: auto; /* Add scroll if content exceeds max-height */
`;

const FileItem = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid lightgray;
  border-radius: 5px;
`;

//to close the search module
const CloseButton = styled(CloseIcon)`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 1; 
`;

const SearchResults = ({ onClose }) => {
  const searchTerm = useSelector((state) => state.searchTerm);
  const files = useSelector((state) => state.files);

  const filteredFiles = files.filter((file) =>
    file.data.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ResultsContainer>
      <CloseButton onClick={onClose} />
      {filteredFiles.length > 0 ? (
        filteredFiles.map((file) => (
          <FileItem key={file.id}>
            {file.data.filename}
          </FileItem>
        ))
      ) : (
        <p>No results found</p>
      )}
    </ResultsContainer>
  );
};

export default SearchResults;
