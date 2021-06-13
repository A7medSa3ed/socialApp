import {
  HANDLE_USERNAME_CHANGE,
  DELAY_USERNAME,
  UNIQUE_USERNAME_RESULTS,
  HANDLE_EMAIL_CHANGE,
  DELAY_EMAIL,
  UNIQUE_EMAIL_RESULTS,
  HANDLE_PASSWORD_CHANGE,
  DELAY_PASSWORD,
  SUBMIT_FORM,
} from "./action";

export const initialState = {
  username: {
    value: "",
    hasError: false,
    msg: "",
    isUnique: false,
    checkCount: 0,
  },
  email: {
    value: "",
    hasError: false,
    msg: "",
    isUnique: false,
    checkCount: 0,
  },
  password: {
    value: "",
    hasError: false,
    msg: "",
  },
  submitCount: 0,
};
export const reducer = (state, action) => {
  switch (action.type) {
    case HANDLE_USERNAME_CHANGE:
      if (action.value.length > 30) {
        return {
          ...state,
          username: {
            ...state.username,
            hasError: true,
            msg: "Username Cannot Exceed 30 Character",
          },
        };
      } else if (action.value && !/^([a-zA-Z0-9]+)$/.test(action.value)) {
        return {
          ...state,
          username: {
            ...state.username,
            hasError: true,
            msg: "Username Can Only Contain Letters Or Numbers",
          },
        };
      } else {
        return {
          ...state,
          username: {
            ...state.username,
            value: action.value,
            hasError: false,
            msg: "",
          },
        };
      }

    case DELAY_USERNAME:
      if (state.username.value.length < 3) {
        return {
          ...state,
          username: {
            ...state.username,
            hasError: true,
            msg: "Username Must Be At Least 3 Character",
          },
        };
      }
      //!action.noRequest used to prevent make request aqain when use this dispatch
      if (!state.username.hasError && !action.noRequest) {
        return {
          ...state,
          username: {
            ...state.username,
            checkCount: state.username.checkCount + 1,
          },
        };
      }
    case UNIQUE_USERNAME_RESULTS:
      if (action.value === true) {
        return {
          ...state,
          username: {
            ...state.username,
            hasError: true,
            isUnique: false,
            msg: "That Username Is Already Taken.",
          },
        };
      } else {
        return {
          ...state,
          username: {
            ...state.username,
            hasError: false,
            isUnique: true,
            msg: "",
          },
        };
      }
    case HANDLE_EMAIL_CHANGE:
      return {
        ...state,
        email: { ...state.email, value: action.value.toLowerCase() },
      };
    case DELAY_EMAIL:
      if (!/^\S+@\S+$/.test(state.email.value)) {
        return {
          ...state,
          email: {
            ...state.email,
            hasError: true,
            msg: "You Must Provide Valid Email Address",
          },
        };
      }
      if (!state.email.hasError && !action.noRequest) {
        return {
          ...state,
          email: {
            ...state.email,
            checkCount: state.email.checkCount + 1,
          },
        };
      }
    case UNIQUE_EMAIL_RESULTS:
      if (action.value === true) {
        return {
          ...state,
          email: {
            ...state.email,
            hasError: true,
            isUnique: false,
            msg: "That Email Is Already Being Used.",
          },
        };
      } else {
        return {
          ...state,
          email: {
            ...state.email,
            hasError: false,
            isUnique: true,
            msg: "",
          },
        };
      }
    case HANDLE_PASSWORD_CHANGE:
      if (action.value.length > 50) {
        return {
          ...state,
          password: {
            ...state.password,
            hasError: true,
            msg: "Password Cannot Exceed 50 Character",
          },
        };
      } else {
        return {
          ...state,
          password: { ...state.password, value: action.value },
        };
      }
    case DELAY_PASSWORD:
      if (state.password.value.length < 12) {
        return {
          ...state,
          password: {
            ...state.password,
            hasError: true,
            msg: "Password Must Be At Least 12 Character Or More",
          },
        };
      } else {
        return {
          ...state,
          password: {
            ...state.password,
            hasError: false,
            msg: "",
          },
        };
      }
    case SUBMIT_FORM:
      console.log(state);
      if (
        !state.username.hasError &&
        state.username.isUnique &&
        !state.email.hasError &&
        state.email.isUnique &&
        !state.password.hasError
      ) {
        return {
          ...state,
          submitCount: state.submitCount + 1,
        };
      }
    default:
      return state;
  }
};
