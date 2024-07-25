import { SET_FILES, ADD_FILE, DELETE_FILE, SET_SEARCH_TERM } from './action';

const initialState = {
  files: [],
  searchTerm: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILES:
      return {
        ...state,
        files: action.payload,
      };
    case ADD_FILE:
      return {
        ...state,
        files: [...state.files, action.payload],
      };
    case DELETE_FILE:
      return {
        ...state,
        files: state.files.filter(file => file.id !== action.payload),
      };
    case SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
