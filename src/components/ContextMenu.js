import React from 'react';
import styled from 'styled-components';

const ContextMenuContainer = styled.div`
  position: absolute;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 10px;
`;

const ContextMenuItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
`;

const ContextMenu = ({ position, onDelete, onShare }) => {
  return (
    <ContextMenuContainer style={{ top: position.y, left: position.x }}>
      <ContextMenuItem onClick={onDelete}>Delete</ContextMenuItem>
      <ContextMenuItem onClick={onShare}>Share</ContextMenuItem>
    </ContextMenuContainer>
  );
};

export default ContextMenu;
