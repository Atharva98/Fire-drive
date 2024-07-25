export const SET_FILES = 'SET_FILES';
export const ADD_FILE = 'ADD_FILE';
export const DELETE_FILE = 'DELETE_FILE';
export const SET_SEARCH_TERM = 'SET_SEARCH_TERM';

export const setFiles = (files) => ({
  type: SET_FILES,
  payload: files,
});

export const addFile = (file) => ({
  type: ADD_FILE,
  payload: file,
});

export const deleteFile = (fileId) => ({
  type: DELETE_FILE,
  payload: fileId,
});

export const setSearchTerm = (term) => ({
  type: SET_SEARCH_TERM,
  payload: term,
});
