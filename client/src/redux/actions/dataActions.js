import axios from "axios";
import swal from 'sweetalert';

import {
    SET_POSTS,
    LOADING_DATA,
    CLEAR_ERRORS, 
    LIKE_POST,
    UNLIKE_POST,
    SET_POST_PAGE,
    SET_ERRORS,
    SET_RESPONSE_REWARD,
    SET_ALL_RESPONSES,
    SET_ALL_USERS,
    SET_ALL_COMPANIES,
    SET_ALL_POSTS,
    SET_ALL_RESPONSESC,
    SET_ALL_POSTS_AUX,
    SET_SHOP_LIST,
    EDIT_POST,
    EDIT_RESPONSE
  } from '../types';

export const editResponse = (postId, responseId, responseData) => (dispatch) => {
    axios.post(`/posts/${postId}/${responseId}/response/edit`, responseData)
        .then((res) => {
            swal("Done!", "Response was edited.", "success");
            dispatch({
                type: EDIT_RESPONSE,
                payload: res.data
            })
        })
        .catch((err) => {
            swal("Oopss!", "Something went wrong, please try again later.", "error");
            console.log(err);
        })
};

export const editPost = (postDetails, postId) => (dispatch) => {
    axios.post(`/posts/${postId}/edit`, postDetails)
        .then((res) => {
            swal("Done!", "Post was edited!", "success");
            dispatch({
                type: EDIT_POST,
                payload: res.data
            })
        })
        .catch((err) => {
            console.log(err);
            swal("Ooops!", "Something went wrong. Please try again later.", "error");
        })
};

export const deleteResponse = (postId, responseId) => (dispatch) => {
    axios.post(`/posts/${postId}/${responseId}/response/delete`)
        .then((res) => {
            dispatch({
                type: SET_POST_PAGE,
                payload: res.data
            });
            swal("Done!", "Response deleted!", "success");
        })
        .catch((err) => {
            swal("Oops!", "Something went wrong!", "error");
        });
};

export const addNewResponse = (postId, responseDetails) => (dispatch) => {
    axios.post(`/posts/${postId}/response`, responseDetails)
        .then((res) => {
            dispatch({
                type: SET_POST_PAGE,
                payload: res.data
            });
            swal("Done!", "Reply added!", "success");
        })
        .catch((err) => {
            swal("Oops!", "Something went wrong!", "error");
        });
};

export const addNewRResponse = (postId, responseId, responseDetails) => (dispatch) => {
    axios.post(`/posts/${postId}/reponse/${responseId}/response`, responseDetails)
        .then((res) => {
            dispatch({
                type: SET_POST_PAGE,
                payload: res.data
            });
            swal("Done!", "Reply added!", "success");
        })
        .catch((err) => {
            swal("Oops!", "Something went wrong!", "error");
        })
};

export const addNewPost = (postDetails) => (dispatch) => {
    axios.post('/posts/add', postDetails)
        .then((res) => {
            dispatch({
                type: SET_POSTS,
                payload: res.data
            });
            dispatch({ type: CLEAR_ERRORS });
            swal("Done!", "New post added!", "success");
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const getPostData = (postId) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get(`/posts/${postId}`)
        .then((res) => {
            dispatch({
                type: SET_POST_PAGE,
                payload: res.data
            });
        })
        .catch((err) => {
            dispatch({
                type: SET_POST_PAGE,
                payload: null
            })
        });
};

  //get all posts
export const getPosts = (type, firstTime) => (dispatch) => {
    if(firstTime) dispatch({ type: LOADING_DATA });
    const obj = {
        orderBy: type
    }
    axios.post('/posts', obj)
        .then((res) => {
            dispatch({
                type: SET_POSTS,
                payload: res.data
            });
        })
        .catch((err) => {
            dispatch({
                type: SET_POSTS,
                payload: []
            });
        });
};

//like a post
export const likePost = (postId) => (dispatch) => {
    axios.get(`/posts/${postId}/like`)
        .then((res) => {
            dispatch({
                type: LIKE_POST,
                payload: res.data
            });
        })
        .catch((err) => console.log(err));
};


//unlike a post

export const unlikePost = (postId) => (dispatch) => {
    axios.get(`/posts/${postId}/unlike`)
        .then((res) => {
            dispatch({
                type: UNLIKE_POST,
                payload: res.data
            });
        })
        .catch((err) => console.log(err));
};

export const addNewReward = (newRewardDetails) => (dispatch) => {
    axios.post(`/posts/${newRewardDetails.root}/reward/response/${newRewardDetails.responseId}`, newRewardDetails)
        .then((res) => {
            dispatch({
                type: SET_RESPONSE_REWARD,
                payload: res.data
            })
            swal("Success", "The response was rewarded", "success");
        })
        .catch((err) => {
            console.log(err);
            swal("Oopss!", "Something went wrong. Please try again later", "error");
        })
}

export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};

export const deletePost = (postId) => (dispatch) => {
    axios.post(`/posts/${postId}/delete`)
        .then((res) => {
            dispatch({
                type: SET_POSTS,
                payload: res.data
            });
            swal("Done!", "Post deleted!", "success")
            .then(() => {
                if(window.location.pathname === `/posts/${postId}`) window.location.href = '/';
            });
        })
        .catch((err) => {
            swal("Oops!", "Something went wrong!", "error");
        })
}

export const getAllUsers = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get('/users/get/all')
        .then((res) => {
            dispatch({
                type: SET_ALL_USERS,
                payload: res.data
            });
            dispatch(getAllResponses());
        })
        .catch((err) => {
            console.log(err);
        });
}

export const getAllResponses = () => (dispatch) => {
    axios.get('/responses/get/all')
        .then((res) => {
            dispatch({
                type: SET_ALL_RESPONSES,
                payload: res.data
            });
        })
        .catch((err) => {
            console.log(err);
        })
}

export const getAllCompanies = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get('/companies/get/all')
    .then((res) => {
        dispatch({
            type: SET_ALL_COMPANIES,
            payload: res.data
        });
        dispatch(getAllPostsC());
    })
    .catch((err) => {
        console.log(err);
    })
}

export const getAllPostsC = () => (dispatch) => {
    axios.get('/posts')
        .then((res) => {
            dispatch({
                type: SET_ALL_POSTS_AUX,
                payload: res.data
            });
            dispatch(getAllResponsesC());
        })
        .catch((err) => {
            console.log(err);
        })
}

export const getAllResponsesC = () => (dispatch) => {
    axios.get('/responses/get/all')
        .then((res) => {
            dispatch({
                type: SET_ALL_RESPONSESC,
                payload: res.data
            });
            dispatch({ type: SET_ALL_POSTS });
        })
        .catch((err) => {
            console.log(err);
        })
}

export const getAllShopItems = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get('/shop/items')
        .then((res) => {
            dispatch({
                type: SET_SHOP_LIST,
                payload: res.data
            });
        })
        .catch((err) => {
            console.log(err);
        })
}