import { SET_USER, 
    SET_AUTENTIFICATED, 
    SET_UNAUTENTIFICATED, 
    LOADING_USER, 
    LIKE_POST, 
    UNLIKE_POST, 
    SET_CONVERSATIONS, 
    SET_MESSAGES,
    MARK_NOTIFICATIONS_READ,
    SET_INVITES,
    SET_LAST_MESSAGE
} from '../types';

 const initialState = {
     authentificated: false,
     loading: false, 
     credentials: {},
     posts: [],
     reponses: [],
     likes: [],
     conversations: [],
     messages: []
 };

 export default function(state = initialState,  action) {
     switch(action.type) {
        case SET_AUTENTIFICATED:
            return {
                ...state,
                authentificated: true
            };
        case SET_UNAUTENTIFICATED:
            return initialState;
        case SET_USER:
            return {
                ...state,
                authentificated: true,
                loading: false,
                ...action.payload
            };
        case LOADING_USER:
            return {
                ...state, 
                loading: true
            }
        case LIKE_POST:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userNickName: state.credentials.userNickName,
                        postId: action.payload.postId
                    }
                ]
            };
        case UNLIKE_POST:
            return {
                ...state,
                likes: state.likes.filter(like => like.postId !== action.payload.postId)
            };
        
        case SET_CONVERSATIONS:
            return {
                ...state,
                conversations: action.payload,
                loading: false
            }
        case SET_MESSAGES:
            return {
                ...state,
                messages: action.payload,
                loading: false
            }
        case MARK_NOTIFICATIONS_READ:
            state.notifications.forEach((not) => (not.read = true));
            return {
                ...state
            };
        case SET_INVITES:
            return {
                ...state,
                invites: action.payload,
                loading: false
            };
        case SET_LAST_MESSAGE:
            let indexcc = state.conversations.findIndex((conversation) => conversation.conversationId === action.payload.convId);
            let messagecompose = 'You: ' + action.payload.message;
            if(indexcc >= 0) {
                state.conversations[indexcc] = {
                    ...state.conversations[indexcc],
                    lastMessage: messagecompose.substring(0, 25)
                };
            };
            return {
                ...state
            }
        default:
            return state;
     }
 };