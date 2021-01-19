const functions = require('firebase-functions');
const app = require('express')();

const cors = require('cors');
app.use(cors());

const { db } = require('./util/admin');


const FirebaseAuth = require('./util/FirebaseAuth');


const { 
   addNewPost, 
   getAllPosts,
   likePost,
   unlikePost,
   getPostDetails,
   deletePost,
   getAllPostsC,
   editPost 
} = require('./handlers/posts');

const {
   createNewResponse,
   createNewRResponse,
   deleteResponse,
   addNewResponseReward,
   getAllResponses,
   editResponse
} = require('./handlers/responses');


const { 
   signup, 
   login,
   getAuthenticatedUser,
   getUserDetails,
   uploadImage,
   addUserDetails,
   getUserConversations,
   getUserMessages,
   markNotificationsRead,
   sendUserMessage,
   getAllUserImages,
   addNewMessage,
   getAllUsers,
   getAllCompanies,
   getAllInvites,
   addNewInvite 
} = require('./handlers/users');

const {
  getAllShopItems,
  buyItem
} = require('./handlers/shop');


//posts routes
//app.get('/posts', FirebaseAuth, getAllPosts);
app.post('/posts', FirebaseAuth, getAllPosts);
app.get('/posts', FirebaseAuth, getAllPostsC);
app.post('/posts/add', FirebaseAuth, addNewPost);
app.get('/posts/:postId', FirebaseAuth, getPostDetails);
app.post('/posts/:postId/edit', FirebaseAuth, editPost);
app.get('/posts/:postId/like', FirebaseAuth, likePost);
app.get('/posts/:postId/unlike', FirebaseAuth, unlikePost);
app.post('/posts/:postId/delete', FirebaseAuth, deletePost);
//responses routes
app.post('/posts/:postId/response', FirebaseAuth, createNewResponse);
app.post('/posts/:postId/:responseId/response/delete', FirebaseAuth, deleteResponse);
app.post('/posts/:postId/:responseId/response/edit', FirebaseAuth, editResponse);
app.post('/posts/:postId/reponse/:responseId/response', FirebaseAuth, createNewRResponse);
app.post('/posts/:postId/reward/response/:responseId', FirebaseAuth, addNewResponseReward);
app.get('/responses/get/all', FirebaseAuth, getAllResponses);

//users routes
app.post('/signup', signup);
app.post('/login', login);
app.get('/user', FirebaseAuth, getAuthenticatedUser);
app.get('/user/:userNickName', FirebaseAuth, getUserDetails)
app.post('/user/image', FirebaseAuth, uploadImage);
app.post('/user', FirebaseAuth, addUserDetails);
app.get('/user/conversations/all', FirebaseAuth, getUserConversations);
app.get('/user/conversation/:docid/messages', FirebaseAuth, getUserMessages);
app.post('/notifications', FirebaseAuth, markNotificationsRead);
app.post('/user/sendNewMessage', FirebaseAuth, sendUserMessage);
app.get('/users/getAllImages', FirebaseAuth, getAllUserImages);
app.post('/conversations/:conversationId/sendNewMessage', FirebaseAuth, addNewMessage);
app.get('/users/get/all', FirebaseAuth, getAllUsers);
app.get('/companies/get/all', FirebaseAuth, getAllCompanies);
app.get('/user/invites/get', FirebaseAuth, getAllInvites);
app.post('/user/invites/add', FirebaseAuth, addNewInvite);

//shop routes
app.get('/shop/items', FirebaseAuth, getAllShopItems);
app.post('/shop/:item/buy', FirebaseAuth, buyItem);

 exports.api = functions.region('europe-west1').https.onRequest(app);

 exports.createNotificationOnLike = functions
  .region('europe-west1')
  .firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().creator !== snapshot.data().userNickName
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().creator,
            sender: snapshot.data().userNickName,
            type: 'like',
            read: false,
            postId: doc.id
          });
        }
      })
      .catch((err) => console.error(err));
  });
exports.deleteNotificationOnUnLike = functions
  .region('europe-west1')
  .firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });
exports.createNotificationOnReply = functions
  .region('europe-west1')
  .firestore.document('responses/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/posts/${snapshot.data().root}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().creator !== snapshot.data().creator
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().creator,
            sender: snapshot.data().creator,
            type: 'response',
            read: false,
            postId: doc.id
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });