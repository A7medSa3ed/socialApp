import {
  DATA_FETCHED,
  TITLE_CHANGE,
  BODY_CHANGE,
  SUBMIT_REQUEST,
  REQUEST_STARTED,
  REQUEST_FINISHED,
  TITLE_RULES,
  BODY_RULES,
} from "./action";

export const initialState = {
  title: {
    value: "",
    hasError: false,
    errorMsg: "",
  },
  body: {
    value: "",
    hasError: false,
    errorMsg: "",
  },
  isFetching: true, // this is used to show loading icon till show post data
  isUpdating: false, // this is used to disable update button while data is posted to server
  sendCount: 0, // this is used to run useEffect on click on update button
};

export const reducer = (state, action) => {
  switch (action.type) {
    case DATA_FETCHED:
      return {
        ...state,
        title: { ...state.title, value: action.value.title },
        body: { ...state.body, value: action.value.body },
        isFetching: false,
      };
    case TITLE_CHANGE:
      return {
        ...state,
        title: { ...state.title, value: action.value, hasError: false },
      };
    case BODY_CHANGE:
      return {
        ...state,
        body: { ...state.body, value: action.value, hasError: false },
      };
    case SUBMIT_REQUEST:
      if (!state.title.hasError && !state.body.hasError) {
        return { ...state, sendCount: state.sendCount + 1 };
      } else {
        return state;
      }
    case REQUEST_STARTED:
      return { ...state, isUpdating: true };
    case REQUEST_FINISHED:
      return { ...state, isUpdating: false };
    case TITLE_RULES:
      if (!action.value.trim()) {
        return {
          ...state,
          title: {
            ...state.title,
            hasError: true,
            errorMsg: "Please Enter Title",
          },
        };
      }
    case BODY_RULES:
      if (!action.value.trim()) {
        return {
          ...state,
          body: {
            ...state.body,
            hasError: true,
            errorMsg: "Please Enter Body Content",
          },
        };
      }
    default:
      return state;
  }
};
