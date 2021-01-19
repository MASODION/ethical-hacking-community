import { 
    SET_USER, 
    SET_ERRORS, 
    CLEAR_ERRORS, 
    LOADING_UI, 
    SET_UNAUTENTIFICATED, 
    LOADING_USER, 
    SET_CONVERSATIONS, 
    SET_MESSAGES,
    MARK_NOTIFICATIONS_READ,
    SET_INVITES,
    SET_LAST_MESSAGE
} from '../types';
import axios from 'axios';
import swal from 'sweetalert';

export const loginUser = (userData, history) => (dispatch) => {

    dispatch({ type: LOADING_UI });
    axios.post('/login', userData)
            .then((res) => {
                setAuthorizationHeader(res.data.token);
                dispatch(getUserData());
                dispatch(getUserConversations());
                dispatch({ type: CLEAR_ERRORS });
                history.push('/');
            })
            .catch((err) => {
                dispatch({
                    type: SET_ERRORS,
                    payload: err.response.data
                });
            });
};

export const signupUser = (newUserDatas, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/signup', newUserDatas)
            .then((res) => {
                setAuthorizationHeader(res.data.token);
                dispatch(getUserData());
                dispatch({ type: CLEAR_ERRORS });
                history.push('/');
            })
            .catch((err) => {
                dispatch({
                    type: SET_ERRORS,
                    payload: err.response.data
                });
            });
};

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTENTIFICATED });
};

export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post('/user', userDetails)
        .then(() => {
            dispatch(getUserData());
            if(window.location.pathname === `/profile`) swal("Success!", "Profile was updated!", "success");
        })
        .catch((err) => {
            console.log(err);
            swal("Oops!", "Something went wrong!", "error");
        });
}

export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.get('/user')
        .then((res) => {
            dispatch({
                type: SET_USER,
                payload: res.data
            });
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.data
            });
        });
    dispatch(getUserConversations());
};

export const uploadImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post('/user/image', formData)
        .then((res) => {
            dispatch(getUserData());
            swal("Success!", "Profile image was updated!", "success");
        })
        .catch((err) => {
            console.log(err);
            swal("Oops!", "Something went wrong!", "error");
        });
}

const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem('FBIdToken', FBIdToken);
    axios.defaults.headers.common['Authorization'] = FBIdToken;
};



export const getUserConversations = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.get('/user/conversations/all')
        .then((res) => {
            dispatch({
                type: SET_CONVERSATIONS,
                payload: res.data
            });
        })
        .catch((err) => {
            swal("Oops!", "Something went wrong while trying to get your messages", "error");
        })
}

export const getUserMessages = (conversationId) => (dispatch) => {
    axios.get(`/user/conversation/${conversationId}/messages`)
        .then((res) => {
            dispatch({
                type: SET_MESSAGES,
                payload: res.data
            });
        })
        .catch((err) => {
            swal("Oops!", "Something went wrong while trying to get your messages", "error");
        })
}

export const markNotificationsRead = (notificationIds) => (dispatch) => {
    axios
      .post('/notifications', notificationIds)
      .then((res) => {
        dispatch({
          type: MARK_NOTIFICATIONS_READ
        });
      })
      .catch((err) => console.log(err));
  };

export const sendMessage = (messageDetails) => (dispatch) => {
    console.log(messageDetails);
    axios
        .post('/user/sendNewMessage', messageDetails)
        .then((res) => {
            dispatch({
                type: SET_CONVERSATIONS,
                payload: res.data
            });
            swal("Success!", "Message was succesfully send.", "success");
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.data
            })
        })
}
export const sendUserMessage = (conversationId, messageDetails) => (dispatch) => {
    axios
        .post(`/conversations/${conversationId}/sendNewMessage`, messageDetails)
        .then((res) => {
            dispatch({
                type: SET_MESSAGES,
                payload: res.data
            });
            dispatch({ type: SET_LAST_MESSAGE, payload: {convId: conversationId, message: messageDetails.message} })
        })
        .catch((err) => {
            swal("Oops!", "Something went wrong while trying to get your messages", "error");
        })
}
export const getAllInvites = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios
        .get('/user/invites/get')
        .then((res) => {
            dispatch({
                type: SET_INVITES,
                payload: res.data
            });
        })
        .catch((err) => {
            console.log(err);
        })
}
export const addNewInvite = () => (dispatch) => {
    axios
        .post('/user/invites/add')
        .then((res) => {
            dispatch({
                type: SET_INVITES,
                payload: res.data
            });
        })
        .catch((err) => {
            console.log(err);
        })
}