const { admin, db } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const { 
   validateSignupData, 
   validateLoginData,
   reduceUserDetails,
   validateMessageData,
   validateNewMessageData
} = require('../util/validators');

const isEmail = (email) => {
   const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   if (email.match(regEx)) return true;
   else return false;
 };


exports.getUserDetails = (req, res) => {
   let userData = {};

   let postsDocument = db
      .collection('posts')
      .where('creator', '==', req.params.userNickName)
      .orderBy('createdAt', 'desc');
   
   let responsesDocument = db
      .collection('responses')
      .where('creator', '==', req.params.userNickName)
      .orderBy('createdAt', 'desc');


   db.doc(`/users/${req.params.userNickName}`)
     .get()
     .then((doc) => {
       if (doc.exists) {
         userData.profile = {
            userNickName: doc.id,
            bio: doc.data().bio,
            createdAt: doc.data().createdAt,
            email: doc.data().email,
            imageUrl: doc.data().imageUrl,
            userCoins: doc.data().userCoins,
            userType: doc.data().userType,
            companyName: doc.data().companyName
         };
         return postsDocument.get();
       } else {
         return res.status(404).json({ error: "User not found" });
       }
     })
     .then((data) => {
       userData.posts = [];
       data.forEach((doc) => {
         userData.posts.push({
           title: doc.data().title,
           createdAt: doc.data().createdAt,
           tags: doc.data().tags,
           companyName: doc.data().companyName,
           imageUrl: doc.data().imageUrl,
           prize: doc.data().prize,
           website: doc.data().website,
           postId: doc.id,
         });
       });
       return responsesDocument.get();
     })
     .then((data) => {
       userData.responses = [];
       data.forEach((doc) => {
          if(doc.data().root === doc.data().postId) {
            userData.responses.push({
               createdAt: doc.data().createdAt,
               root: doc.data().root,
               title: doc.data().title,
               content: doc.data().content,
               responseId: doc.id,
               reward: doc.data().reward
            });
          }
       })
       return res.status(201).json(userData);
     })
     .catch((err) => {
       console.error(err);
       return res.status(500).json({ error: err.code });
     });
 };

exports.getAuthenticatedUser = (req, res) => {
   let userData = {};
   db.doc(`/users/${req.user.userNickName}`)
     .get()
     .then((doc) => {
       if (doc.exists) {
         userData.credentials = doc.data();
         return db
           .collection("posts")
           .where("creator", "==", req.user.userNickName)
           //.orderBy("createdAt", "desc")
           .get();
       }
     })
     .then((data) => {
       userData.posts = [];
       data.forEach((doc) => {
         userData.posts.push(doc.data());
       });
       return db
         .collection("responses")
         .where("creator", "==", req.user.userNickName)
         //.orderBy("createdAt", "desc")
         .get();
     })
     .then((data) => {
       userData.responses = [];
       data.forEach((doc) => {
         userData.responses.push(doc.data());
       });
       return db
         .collection("likes")
         .where("userNickName", "==", req.user.userNickName)
         .get();
     })
     .then((data) => {
        userData.likes = [];
        data.forEach((doc) => {
           userData.likes.push(doc.data());
        });
        return db
        .collection("notifications")
        .where("recipient", "==", req.user.userNickName)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
     })
     .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          postId: doc.data().postId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,
        });
      });
      return res.status(201).json(userData);
     })
     .catch((err) => {
       console.error(err);
       return res.status(500).json({ error: err.code });
     });
 };

//user signup
exports.signup = (req, res) => {
    const newUser = {
       email: req.body.email,
       userCoins: req.body.userCoins,
       userType: req.body.userType,
       password: req.body.password,
       confirmPassword: req.body.confirmPassword,
       userNickName: req.body.userNickName,
       likesCount: req.body.likesCount,
       unreadMessages: req.body.unreadMessages,
       unreadNotifications: req.body.unreadNotifications,
       invitationId: req.body.invitationId,
       companyName: req.body.companyName
    };
 
 
    //validate data
    
    const { valid, errors } = validateSignupData(newUser);

    if(!valid) return res.status(400).json(errors);

   const noImg = "no-img.png";

    let token, userId, type;
    db
      .doc(`/users/${newUser.userNickName}`)
      .get()
      .then((doc) => {
         if(doc.exists) {
            return res.status(400).json({ userNickName: 'this nickname is already taken'});
         }
         else {
            return db.doc(`/invites/${newUser.invitationId}`).get()
            .then((doc) => {
               if(!doc.exists || doc.data().receipt) {
                  return res.status(404).json({ invite: 'invite not found'});
               }
               else {
                  type = doc.data().type;
                  return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
               }
            })
            .catch((err) => console.log(err));
         }
      })
      .then((data) => {
         userId = data.user.uid;
         return  data.user.getIdToken();
      })
      .then((idToken) => {
         token = idToken;
         if(type === 2) {
            const userCredentials =  {
               email: newUser.email,
               userCoins: newUser.userCoins,
               userType: type,
               createdAt: new Date().toISOString(),
               imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
               userNickName: newUser.userNickName,
               likesCount: newUser.likesCount,
               unreadMessages: newUser.unreadMessages,
               unreadNotifications: newUser.unreadNotifications,
               bio: '',
               companyName: newUser.companyName,
               userId
            };
            return db.doc(`/users/${newUser.userNickName }`).set(userCredentials);
         }
         else {
            const userCredentials =  {
               email: newUser.email,
               userPassword: newUser.password,
               userCoins: newUser.userCoins,
               userType: type,
               createdAt: new Date().toISOString(),
               imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
               userNickName: newUser.userNickName,
               likesCount: newUser.likesCount,
               unreadMessages: newUser.unreadMessages,
               unreadNotifications: newUser.unreadNotifications,
               bio: '',
               userId
            };
            return db.doc(`/users/${newUser.userNickName }`).set(userCredentials);
         }
      })
      .then(() => {
         return db.doc(`/invites/${newUser.invitationId}`).update({ receipt: newUser.userNickName });
      })
      .then(() => {
         return res.status(201).json({ token });
      })
      .catch((err) => {
         console.error(err);
         if(err.code === 'auth/email-already-in-use') {
            return res.status(400).json({ email: 'Email is already in use' });
         } else {
            return res.status(500).json({ error: err.code });
         }
      });
   };

  //user login

  exports.login = (req, res) => {
    const user = {
       email: req.body.email,
       password: req.body.password
    };

    const { valid, errors } = validateLoginData(user);

    if(!valid) return res.status(400).json(errors);

    if(isEmail(user.email)) {
      firebase
       .auth()
       .signInWithEmailAndPassword(user.email, user.password)
       .then((data) => {
          return data.user.getIdToken();
       })
       .then((token) => {
          return res.json({token});
       })
       .catch((err) => {
          console.error(err);
          return res.status(403).json({ general: 'Wrong credentials, please try again' });
       });
    }
    else {
       db
         .doc(`/users/${user.email}`)
         .get()
         .then((doc) => {
            if(doc.exists) {
               firebase
                  .auth()
                  .signInWithEmailAndPassword(doc.data().email, user.password)
                  .then((data) => {
                  return data.user.getIdToken();
               })
               .then((token) => {
                  return res.json({token});
               })
               .catch((err) => {
                  console.error(err);
                  return res.status(403).json({ general: 'Wrong credentials, please try again' });
               });
            }
            else {
               return res.status(403).json({ general: 'Wrong credentials, please try again' });
            }
         })
         .catch((err) => {
            console.error(err);
            return res.status(403).json({ general: 'Wrong credentials, please try again' });
         });
    }
  };


  //add user details

  exports.addUserDetails = (req, res) => {
     let userDetails = reduceUserDetails(req.body);

     db.doc(`/users/${req.user.userNickName}`)
      .update(userDetails)
      .then(() => {
         return res.status(201).json({ message: 'Details adds successfully' });
      })
      .catch((err) => {
         console.error(err);
         return res.status(500).json({ error: err.code });
      })
  };


  //upload user avatar
  let imageFileName;
  let imageToBeUploaded = {};

  exports.uploadImage = (req, res) => {
   const BusBoy = require('busboy');
   const path = require('path');
   const os =  require('os');
   const fs = require('fs');

   const busboy = new BusBoy({ headers: req.headers });

   busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      if(mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
         return res.status(400).json({ error: 'Wrong file type subbmited' });
      }
      const imageExtension = filename.split('.')[filename.split('.').length - 1];
      imageFileName = `${Math.round(Math.random() * 10000000000)}.${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));

   });

   busboy.on('finish', () => {
      admin.storage().bucket().upload(imageToBeUploaded.filepath, {
         resumable: false,
         metadata: {
            metadata: {
               contentType: imageToBeUploaded.mimetype
            }
         }
      })
      .then(() => {
         const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
         return db.doc(`/users/${req.user.userNickName}`).update({ imageUrl });
      })
      .then(() => {
         return res.json({ message: 'image upload successfully'});
      })
      .catch((err) => {
         console.error(err);
         return res.status(500).json({ error: err.code });
      });
   });

   busboy.end(req.rawBody);


  };
  exports.getUserConversations = (req, res) => {
   let conversations = [];

   db
      .collection('conversations')
      .where('participants', 'array-contains', req.user.userNickName)
      .get()
      .then((data) => {
         data.forEach((doc) => {
            conversations.push({
               participants: doc.data().participants,
               createdAt: doc.data().createdAt,
               conversationId: doc.id,
               lastMessage: doc.data().lastMessage
            });
         });
         return res.status(201).json(conversations);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      })
};

exports.getUserMessages = (req, res) => {
   let conversationData = db.doc(`/conversations/${req.params.docid}`);
   let messagesData = db.collection(`/conversations/${req.params.docid}/messages`).orderBy('createdAt', 'desc');
   let messages = [];

   conversationData
      .get()
      .then((doc) => {
         if(!doc.exists){
            return res.status(404).json({ error: 'conversation not found' });
         }
         else {
            return messagesData.get();
         }
      })
      .then((data) => {
         data.forEach((doc) => {
            messages.push({
               sender: doc.data().sender,
               createdAt: doc.data().createdAt,
               message: doc.data().message,
               messageId: doc.id
            });
         });
         return res.status(201).json(messages);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.id });
      })
};

exports.addNewMessage = (req, res) => {
   const newMessageDetails = {
      message: req.body.message,
      sender: req.user.userNickName,
      createdAt: new Date().toISOString()
   };
   const { valid, errors } = validateNewMessageData(newMessageDetails);
   if(!valid) return res.status(400).json(errors);
   let messages = [];

   db
      .doc(`/conversations/${req.params.conversationId}`)
      .get()
      .then((doc) => {
         if(!doc.exists) {
            return res.status(404).json({ error: 'document not found' });
         }
         else {
            return db.doc(`/conversations/${req.params.conversationId}`).update({ lastMessage: newMessageDetails.sender + ': ' + newMessageDetails.message});
         }
      })
      .then(() => {
         return db.collection(`/conversations/${req.params.conversationId}/messages`).add(newMessageDetails);
      })
      .then(() => {
         return db.collection(`/conversations/${req.params.conversationId}/messages`).orderBy('createdAt', 'desc').get();
      })
      .then((data) => {
         data.forEach((doc) => {
            messages.push({
               sender: doc.data().sender,
               createdAt: doc.data().createdAt,
               message: doc.data().message,
               messageId: doc.id
            });
         });
         return res.status(201).json(messages);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.id });
      })
}

exports.sendUserMessage = (req, res) => {
   const newMessageDetails = {
      message: req.body.message,
      sender: req.user.userNickName,
      createdAt: new Date().toISOString()
   }

   const newConversationDetails = {
      participants: [req.user.userNickName, req.body.recipient],
      createdAt: new Date().toISOString(),
      lastMessage: req.body.lastMessage
   }

   const updateLastMessage = {
      lastMessage: req.body.lastMessage
   }

   const { valid, errors } = validateMessageData(newMessageDetails, newConversationDetails);

   if(!valid) return res.status(400).json(errors);

   let conversations = [];

   const checkDocument = db
      .collection('conversations')
      .where('participants', 'array-contains', newMessageDetails.sender);
   
   const getAllConversation = db
      .collection('conversations')
      .where('participants', 'array-contains', req.user.userNickName);

   checkDocument
      .get()
      .then((data) => {
            let ceva = '';
            data.forEach((doc) => {
               doc.data().participants.forEach((participant) => {
                  if(participant === req.body.recipient) {
                     ceva = doc.id;
                  }
               });
            });
            if(ceva !== '') {
               return db.collection(`/conversations/${ceva}/messages`).add(newMessageDetails);
            }
            else {
               db.collection('conversations').add(newConversationDetails)
               .then((doc) => {
                  console.log("am creat documentu");
                  console.log(doc.id);
                  return db.collection(`/conversations/${doc.id}/messages`).add(newMessageDetails);
               })
               .catch((err) => {
                  return res.status(500).json({ error: err.id });
               });
            }
      })
      .then(() => {
         return getAllConversation.get();
      })
      .then((data) => {
         data.forEach((doc) => {
            conversations.push({
               participants: doc.data().participants,
               createdAt: doc.data().createdAt,
               conversationId: doc.id,
               lastMessage: doc.data().lastMessage
            });
         });
         return res.status(201).json(conversations);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({ general: 'something went wrong, please try again later' });
      })
}
exports.markNotificationsRead = (req, res) => {
   let batch = db.batch();
   req.body.forEach((notificationId) => {
     const notification = db.doc(`/notifications/${notificationId}`);
     batch.update(notification, { read: true });
   });
   batch
     .commit()
     .then(() => {
       return res.json({ message: "Notifications marked read" });
     })
     .catch((err) => {
       console.error(err);
       return res.status(500).json({ error: err.code });
     });
 };

 exports.getAllUserImages = (req, res) => {
    let response = [];
    db
      .collection('users')
      .get()
      .then((data) => {
         data.forEach((doc) => {
            response.push({
               userNickName: doc.data().userNickName,
               imageUrl: doc.data().imageUrl
            });
         });
         return res.status(201).json(response);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json(response);
      })
 }
 exports.getAllUsers = (req, res) => {
    let users = [];
    db
      .collection('users')
      .where('userType', '==', 1)
      .get()
      .then((data) => {
         data.forEach((doc) => {
            users.push({
               userNickName: doc.data().userNickName,
               responses: []
            })
         });
         return db
         .collection('users')
         .where('userType', '>', 2)
         .get();
      })
      .then((data) => {
         data.forEach((doc) => {
            users.push({
               userNickName: doc.data().userNickName,
               responses: []
            })
         });
         return res.status(201).json(users);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.id });
      })
 }
exports.getAllCompanies = (req, res) => {
   let companies = [];
   db
      .collection('users')
      .where('userType', '==', 2)
      .get()
      .then((data) => {
         data.forEach((doc) => {
            companies.push({
               userNickName: doc.data().userNickName,
               companyName: doc.data().companyName,
               posts: [],
            });
         });
         return res.status(201).json(companies);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.id });
      })
}
exports.getAllInvites = (req, res) => {
   let invites = [];
   db
      .collection('invites')
      .where('creator', '==', req.user.userNickName)
      .orderBy('createdAt', 'desc')
      .get()
      .then((data) => {
         data.forEach((doc) => {
            invites.push({
               ...doc.data(),
               inviteId: doc.id
            });
         });
         return res.status(201).json(invites);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.id });
      })
}
exports.addNewInvite = (req, res) => {
   let newInviteData = {
      creator: req.user.userNickName,
      createdAt: new Date().toISOString()
   };

   if(req.user.userType <= 2 && req.user.userCoins < 100) {
      return res.status(403).json({ error: 'unauthorized' });
   }

   db
      .collection('invites')
      .add(newInviteData)
      .then(() => {
         return db.collection('invites').where('creator', '==', req.user.userNickName).orderBy('createdAt', 'desc').get();
      })
      .then((data) => {
         let invites = [];
         data.forEach((doc) => {
            invites.push({
               ...doc.data(),
               inviteId: doc.id
            });
         });
         return res.status(201).json(invites);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.id });
      })
}