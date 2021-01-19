import { 
    SET_POSTS, 
    LIKE_POST, 
    UNLIKE_POST, 
    LOADING_DATA, 
    SET_POST_PAGE, 
    SET_RESPONSES, 
    SET_RESPONSE_REWARD, 
    SET_ALL_RESPONSES, 
    SET_ALL_USERS,
    SET_ALL_POSTS,
    SET_ALL_RESPONSESC, 
    SET_ALL_COMPANIES,
    SET_ALL_POSTS_AUX,
    SET_SHOP_LIST,
    EDIT_POST,
    EDIT_RESPONSE
} from '../types';

const initialState = {
    posts: [],
    post: {},
    postData: {},
    responses: [],
    loading: false,
};

export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case SET_POSTS:
            return {
                ...state, 
                posts: action.payload,
                loading: false
            }
        case EDIT_POST:
            if(state.postData.postId && state.postData.postId === action.payload.postId) {
                state.postData = action.payload;
            }
            let index_edit_post = state.posts.findIndex((post) => post.postId === action.payload.postId);
            if(index_edit_post >= 0) {
                state.posts[index_edit_post] = action.payload;
            }
            return {
                ...state
            }
        case EDIT_RESPONSE:
            let index_edit_response = state.responses.findIndex((response) => response.responseId === action.payload.responseId);
            if(index_edit_response >= 0) {
                state.responses[index_edit_response] = action.payload;
            }
            return {
                ...state
            }
        case SET_POST_PAGE:
            return {
                ...state,
                postData: action.payload,
                responses: action.payload.responses,
                loading: false
            }
        case SET_RESPONSES:
            return {
                ...state,
                responses: action.payload,
                loading: false
            }
        case LIKE_POST:
        case UNLIKE_POST:
            let index = state.posts.findIndex((post) => post.postId === action.payload.postId);
            state.posts[index] = action.payload;
            if(state.postData.postId === action.payload.postId) {
                state.postData = action.payload;
            }
            return {
                ...state
            }
        case SET_RESPONSE_REWARD:
            let index2 = state.responses.findIndex((response) => response.responseId === action.payload.responseId);
            console.log(index2);
            console.log(action.payload.responseId);
            state.responses[index2] = action.payload; 
            return {
                ...state
            }
        case SET_ALL_RESPONSES:
            action.payload.forEach((response) => {
                let indexresp = state.users.findIndex((user) => response.creator === user.userNickName);
                if(indexresp >= 0) {
                    state.users[indexresp].responses.push(response);
                }
            });
            return {
                ...state,
                loading: false
            }
        case SET_ALL_USERS:
            return {
                ...state,
                users: action.payload
            }
        case SET_ALL_COMPANIES:
            return {
                ...state,
                companies: action.payload
            }
        case SET_ALL_POSTS:
            console.log(state.posts)
            state.postsc.forEach((post) => {
                let indexpost = state.companies.findIndex((company) => post.creator === company.userNickName);
                if(indexpost >= 0) {
                    state.companies[indexpost].posts.push(post);
                }
            })
            return {
                ...state,
                loading: false
            }
        case SET_ALL_POSTS_AUX:
            return{
                ...state,
                postsc: action.payload
            }
        case SET_ALL_RESPONSESC:
            action.payload.forEach((response) => {
                let indexrespc = state.postsc.findIndex((post) => post.postId === response.root);
                if(indexrespc >= 0) {
                    state.postsc[indexrespc].responses.push(response);
                }
            })
            return{
                ...state
            }
        case SET_SHOP_LIST:
            return {
                ...state,
                shoplist: action.payload,
                loading: false
            }
        default:
            return state;
    }
}