const { db } = require('../util/admin');
const isEmpty = (string) => {
   if (string.trim() === '') return true;
   else return false;
 };

 const { validateResponseData, validateRResponseData, validateReward, validateEditResponseData } = require('../util/validators');

exports.deleteResponse = (req, res) => {
   const responsesDocument = db
      .collection('responses')
      .where('rresponseId', '==', req.params.responseId);
   
   const resultDocument = db
      .collection('responses')
      .where('root', '==', req.params.postId)
      .orderBy('createdAt', 'desc');
   
   const responseDocument = db.doc(`/responses/${req.params.responseId}`);
   const postDocument = db.doc(`/posts/${req.params.postId}`);

   let postData;

   responseDocument
      .get()
      .then((doc) => {
         if(!doc.exists) {
            return res.status(400).json({ error: 'response not found' });
         }
         else {
            let creator = doc.data().creator;
            if(creator != req.user.userNickName && req.user.userType <= 2) {
               return res.status(403).json({ error: 'Unauthorized' });
            }
            let batch = db.batch();
            batch.delete(doc.ref);
            return batch.commit().then(() => {
               return responsesDocument.get();
            });
         }
      })
      .then((data) => {
         let batch = db.batch();
         data.docs.forEach((doc) => {
            batch.delete(doc.ref);
         });
         return batch.commit().then(() => {
            return postDocument.get();
         });
      })
      .then((doc) => {
         if(!doc.exists) {
            return res.status(400).json({ error: 'post not found' });
         }
         else {
            postData = doc.data();
            postData.postId = doc.id;
            return resultDocument.get();
         }
      })
      .then((data) => {
         postData.responses = [];
         data.forEach((doc) => {
            postData.responses.push({
               title: doc.data().title,
               createdAt: doc.data().createdAt,
               content: doc.data().content,
               creator: doc.data().creator,
               postId: doc.data().postId,
               root: doc.data().root,
               rresponseId: doc.data().rresponseId,
               reward: doc.data().reward,
               responseId: doc.id
             });
         });
         return res.status(201).json(postData);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      })
}

exports.createNewResponse = (req, res) => {
   const newResponse = {
      title: req.body.title,
      content: req.body.content,
      creator: req.user.userNickName,
      postId: req.params.postId,
      root: req.params.postId,
      createdAt: new Date().toISOString()
   };
   const { valid, errors } = validateResponseData(newResponse);

   if(!valid) return res.status(400).json(errors);

   let postData;
   db
      .doc(`/posts/${newResponse.postId}`)
      .get()
      .then((doc) => {
         if(!doc.exists) {
            console.error('invalid postId');
            return res.status(401).json({ error: 'invalid postId'});
         }
         else {
            postData = doc.data();
            postData.postId = doc.id;
            return db
            .collection('responses')
            .add(newResponse);
         }
      })
      .then(() => {
         const responseDocument = db
            .collection('responses')
            .where('root', '==', req.params.postId)
            .orderBy('createdAt', 'desc');
         return responseDocument.get();
      })
      .then((data) => {
         postData.responses = [];
         data.forEach((doc) => {
            postData.responses.push({
              title: doc.data().title,
              createdAt: doc.data().createdAt,
              content: doc.data().content,
              creator: doc.data().creator,
              postId: doc.data().postId,
              rresponseId: doc.data().rresponseId,
              root: doc.data().root,
              reward: doc.data().reward,
              responseId: doc.id
            });
         });
         res.status(201).json(postData);
      })
      .catch((err) => {
         console.error(err);
         return res.status(500).json({ error: err.code });
      });
};


exports.createNewRResponse = (req, res) => {
   const newResponse = {
      title: req.body.title,
      content: req.body.content,
      creator: req.user.userNickName,
      rresponseId: req.params.responseId,
      root: req.params.postId,
      createdAt: new Date().toISOString()
   };
   const { valid, errors } = validateRResponseData(newResponse);

   if(!valid) return res.status(400).json(errors);

   let postData;
   db
      .doc(`/posts/${req.params.postId}`)
      .get()
      .then((doc) => {
         if(!doc.exists) {
            console.error('invalid postId');
            return res.status(401).json({ error: 'invalid postId'});
         }
         else {
            postData = doc.data();
            postData.postId = doc.id;
            return db
               .doc(`/responses/${newResponse.rresponseId}`)
               .get();
         }
      })
      .then((doc) => {
         if(!doc.exists) {
            console.error('invalid responseId');
            return res.status(400).json({ error: 'invalid responseId'});
         }
         else return db
         .collection('responses')
         .add(newResponse);
      })
      .then(() => {
         const responseDocument = db
            .collection('responses')
            .where('root', '==', req.params.postId)
            .orderBy('createdAt', 'desc');
         return responseDocument.get();
      })
      .then((data) => {
         postData.responses = [];
         data.forEach((doc) => {
            postData.responses.push({
              title: doc.data().title,
              createdAt: doc.data().createdAt,
              content: doc.data().content,
              creator: doc.data().creator,
              postId: doc.data().postId,
              rresponseId: doc.data().rresponseId,
              root: doc.data().root,
              reward: doc.data().reward,
              responseId: doc.id
            });
         });
         res.status(201).json(postData);
      })
      .catch((err) => {
         console.error(err);
         return res.status(500).json({ error: err.code });
      });
};

exports.addNewResponseReward = (req, res) => {
   const dataObj = {
      coins: req.body.coins,
      responseId: req.params.responseId,
      root: req.params.postId,
      creator: req.body.creator
   };

   if(req.user.userType !== 2) {
      return res.status(403).json({ error: 'unauthorized' });
   }

   const { valid, errors } = validateReward(dataObj);

   if(!valid) return res.status(400).json(errors);

   let coins;

   db 
      .doc(`/posts/${dataObj.root}`).get()
      .then((doc) => {
         if(!doc.exists) {
            return res.status(404).json({ error: 'post not found' });
         }
         else {
            if(doc.data().creator !== req.user.userNickName) return res.status(403).json({ error: 'unauthorized' });
            if(dataObj.coins < doc.data().prize) return res.status(404).json({ error: 'invalid coin amount' });
            return db.doc(`/users/${dataObj.creator}`).get();
         }
      })
      .then((doc) => {
         if(!doc.exists) {
            return res.status(404).json({ error: 'user not found' });
         }
         else {
            coins = parseInt(doc.data().userCoins, 10) + dataObj.coins;
            console.log(coins);
            return db.doc(`/responses/${dataObj.responseId}`).get();
         }
      })
      .then((doc) => {
         if(!doc.exists) {
            return res.status(404).json({ error: 'response not found' });
         }
         else {
            if(doc.data().creator === req.user.userNickName) return res.status(403).json({ error: 'unaunthorized' });
            return db.doc(`/responses/${dataObj.responseId}`).update({
               reward: dataObj.coins
            });
         }
      })
      .then(() => {
         return db.doc(`/users/${dataObj.creator}`).update({
            userCoins: coins
         });
      })
      .then(() => {
         return db.doc(`/responses/${dataObj.responseId}`).get();
      })
      .then((doc) => {
         return res.status(201).json({
            title: doc.data().title,
            createdAt: doc.data().createdAt,
            content: doc.data().content,
            creator: doc.data().creator,
            postId: doc.data().postId,
            rresponseId: doc.data().rresponseId,
            root: doc.data().root,
            reward: doc.data().reward,
            responseId: doc.id
         })
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ err: err.id });
      })
}
exports.getAllResponses = (req, res) => {
   let responses = [];
   db
      .collection('responses')
      .orderBy('createdAt', 'desc')
      .get()
      .then((data) => {
         data.forEach((doc) => {
            responses.push({
               ...doc.data(),
               responseId: doc.id
            });
         });
         return res.status(201).json(responses);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.id });
      })
}
exports.editResponse = (req, res) => {
   const responseData = {
      title: req.body.title,
      content: req.body.content
   }

   const { valid, errors } = validateEditResponseData(responseData);

    if(!valid) return res.status(400).json(errors);


   db
      .doc(`/posts/${req.params.postId}`)
      .get()
      .then((doc) => {
         if(!doc.exists) {
            return res.status(404).json({ error: 'post not found'});
         }
         else {
            return db.doc(`/responses/${req.params.responseId}`).get()
                     .then((doc) => {
                        if(!doc.exists){
                           return res.status(404).json({ error: 'response not found'});
                        }
                        else {
                           if(doc.data().creator !== req.user.userNickName) return res.status(403).json({ error: 'Unauthorized'});
                           return db.doc(`/responses/${req.params.responseId}`).update(responseData);
                        }
                     })
                     .catch((err) => {
                        console.log(err);
                        return res.status(500).json({ error: err.code });
                     })
         }
      })
      .then(() => {
         return db.doc(`/responses/${req.params.responseId}`).get();
      })
      .then((doc) => {
         return res.status(201).json({
            ...doc.data(),
            responseId: doc.id
         });
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code});
      })
}