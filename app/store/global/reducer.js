import {
  LOGGED_IN,
  LOGGED_OUT,
  FLASH_MSG,
  NOT_FOUND,
  LOADING,
  OPEN_SEARCH,
  CLOSE_SEARCH,
  TOGGLE_CHAT,
  CLOSE_CHAT,
  INCREMENT_UNREAD_MSG,
  CLEAR_UNREADED_MESSAGES_COUNT,
} from "./action";

export const initState = {
  loggedin: Boolean(localStorage.getItem("socialAppToken")),
  flashMsg: [],
  flashMsgType: "",
  user: {
    token: localStorage.getItem("socialAppToken"),
    username: localStorage.getItem("socialAppUsername"),
    avatar: localStorage.getItem("socialAppAvatar"),
  },
  notFound: false,
  loading: true,
  searchOpen: false,
  isChatOpen: false,
  unReadChatMsg: 0,
};
export const reducer = (state, action) => {
  switch (action.type) {
    case LOGGED_IN:
      return { ...state, loggedin: true, user: action.value };
    case LOGGED_OUT:
      return { ...state, loggedin: false };
    case FLASH_MSG:
      return {
        ...state,
        flashMsg: state.flashMsg.concat(action.value),
        flashMsgType: action.msgType,
      };
    case NOT_FOUND:
      return {
        ...state,
        notFound: true,
      };
    case LOADING:
      return {
        ...state,
        loading: action.value,
      };
    case OPEN_SEARCH:
      return { ...state, searchOpen: true };
    case CLOSE_SEARCH:
      return { ...state, searchOpen: false };
    case TOGGLE_CHAT:
      return { ...state, isChatOpen: !state.isChatOpen };
    case CLOSE_CHAT:
      return { ...state, isChatOpen: false };
    case INCREMENT_UNREAD_MSG:
      return { ...state, unReadChatMsg: state.unReadChatMsg + 1 };
    case CLEAR_UNREADED_MESSAGES_COUNT:
      return { ...state, unReadChatMsg: 0 };
    default:
      return state;
  }
};
