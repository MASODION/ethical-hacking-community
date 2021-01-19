const { db } = require('../util/admin');

const { validatePostData, validateEditPostData } = require('../util/validators');

exports.editPost = (req, res) => {
  let postDetails = {
    content: req.body.content,
    title: req.body.title,
    website: req.body.website
  };
    const { valid, errors } = validateEditPostData(postDetails);

    if(!valid) return res.status(400).json(errors);
 
    if(req.user.userType < 2) {
       return res.status(403).json({ error: 'not a company user'} );
    }

    db
      .doc(`/posts/${req.params.postId}`)
      .get()
      .then((doc) => {
        if(!doc.exists) {
          return res.status(404).json({ error: 'post not found'});
        }
        else {
          if(doc.data().creator !== req.user.userNickName) return res.status(403).json({ error: 'Unauthorized'});
          return db.doc(`/posts/${req.params.postId}`).update(postDetails);
        }
      })
      .then(() => {
        return db.doc(`/posts/${req.params.postId}`).get();
      })
      .then((doc) => {
        return res.status(201).json({
          ...doc.data(),
          postId: doc.id
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: err.code });
      })
}

   exports.addNewPost = (req, res) => {
 
    let newPost = {
       content: req.body.content,
       creator: req.user.userNickName,
       prize: parseInt(req.body.prize, 10),
       title: req.body.title,
       tags: req.body.tags,
       likeCount: 0,
       imageUrl: req.user.imageUrl,
       createdAt: new Date().toISOString(),
       website: req.body.website
    };

    if(req.user.companyName) newPost.companyName = req.user.companyName;

    const { valid, errors } = validatePostData(newPost);

    if(!valid) return res.status(400).json(errors);
 
    if(req.user.userType < 2) {
       return res.status(403).json({ error: 'not a company user'} );
    }
    
    let responseDocument = db.collection('posts').orderBy('createdAt', 'desc');

    db
       .collection('posts')
       .add(newPost)
       .then(() => {
          return responseDocument.get();
       })
       .then((data) => {
          let posts = [];
          data.forEach((doc) => {
            posts.push({
              postId: doc.id,
              title: doc.data().title,
              content: doc.data().content,
              creator: doc.data().creator,
              companyName: doc.data().companyName,
              createdAt: doc.data().createdAt,
              imageUrl: doc.data().imageUrl,
              tags: doc.data().tags,
              likeCount: doc.data().likeCount,
              prize: doc.data().prize,
              website: doc.data().website
            });
          });
          return res.status(201).json(posts);
       })
       .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: 'something went wrong' });
       });
  };

  exports.deletePost = (req, res) => {
    const responseDocument = db
      .collection('responses')
      .where('root', '==', req.params.postId);

    const likeDocument = db
      .collection('likes')
      .where('postId', '==', req.params.postId);

    const postDocument = db.doc(`/posts/${req.params.postId}`);

    const returnDocument = db.collection('posts').orderBy('createdAt', 'desc');

    postDocument
      .get()
      .then((doc) => {
        if(!doc.exists) {
          return res.status(400).json({ error: 'post not found'});
        }
        else {
          let creator = doc.data().creator;
          if(creator != req.user.userNickName && req.user.userType <= 2) {
            return res.status(403).json({ error: 'Unauthorized'});
          }
          let batch = db.batch();
          batch.delete(doc.ref);
          return batch.commit().then(() => {
            return responseDocument.get();
          });
        }
      })
      .then((data) => {
        let batch = db.batch();
        data.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit().then(() => {
          return likeDocument.get();
        });
      })
      .then((data) => {
        let batch = db.batch();
        data.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit().then(() => {
          return returnDocument.get();
        })
      })
      .then((data) => {
        let posts = [];
        data.forEach((doc) => {
          posts.push({
            postId: doc.id,
            title: doc.data().title,
            content: doc.data().content,
            creator: doc.data().creator,
            companyName: doc.data().companyName,
            createdAt: doc.data().createdAt,
            imageUrl: doc.data().imageUrl,
            tags: doc.data().tags,
            likeCount: doc.data().likeCount,
            prize: doc.data().prize,
            website: doc.data().website
          });
        });
        return res.status(201).json(posts);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: err.code });
      })
  }

  exports.getPostDetails = (req, res) => {
    const responseDocument = db
    .collection('responses')
    .where('root', '==', req.params.postId)
    .orderBy('createdAt', 'desc');

  const postDocument = db.doc(`/posts/${req.params.postId}`);

  let postData;

  postDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        return responseDocument.get();
      } else {
        return res.status(404).json({ error: 'Post not found' });
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
          reward: doc.data().reward,
          rresponseId: doc.data().rresponseId,
          responseId: doc.id
        });
      });
      return res.status(201).json(postData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
  }

   exports.getAllPosts = (req, res) => {

    let obj = {
      orderType: req.body.orderBy
    }

    let resultDocument;
    if(obj.orderType === 'date_desc')
      resultDocument = db.collection('posts').orderBy('createdAt', 'desc');
    else if(obj.orderType === 'date_asc')
      resultDocument = db.collection('posts').orderBy('createdAt', 'asc');
    else if(obj.orderType === 'likes')
      resultDocument = db.collection('posts').orderBy('likeCount', 'desc');
    else if(obj.orderType === 'prize_desc')
      resultDocument = db.collection('posts').orderBy('prize', 'desc');
    else if(obj.orderType === 'prize_asc')
      resultDocument = db.collection('posts').orderBy('prize', 'asc');
    else resultDocument = db.collection('posts').orderBy('createdAt', 'desc');

      resultDocument
       .get()
       .then((data) => {
          let posts = [];
          data.forEach((doc) => {
             posts.push({
                postId: doc.id,
                title: doc.data().title,
                content: doc.data().content,
                creator: doc.data().creator,
                companyName: doc.data().companyName,
                createdAt: doc.data().createdAt,
                imageUrl: doc.data().imageUrl,
                tags: doc.data().tags,
                likeCount: doc.data().likeCount,
                prize: doc.data().prize,
                website: doc.data().website
             });
          });
          return res.json(posts);
       })
       .catch((err) => console.error(err));
  };

  exports.getAllPostsC = (req, res) => {
    let posts = [];
    db
      .collection('posts')
      .get()
      .then((data) => {
        data.forEach((doc) => {
          posts.push({
            postId: doc.id,
            creator: doc.data().creator,
            createdAt: doc.data().createdAt,
            responses: []
          });
        });
        return res.status(201).json(posts);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: err.id });
      })
  }

  exports.likePost = (req, res) => {
   const likeDocument = db
     .collection('likes')
     .where('userNickName', '==', req.user.userNickName)
     .where('postId', '==', req.params.postId)
     .limit(1);
 
   const postDocument = db.doc(`/posts/${req.params.postId}`);
 
   let postData;
 
   postDocument
     .get()
     .then((doc) => {
       if (doc.exists) {
         postData = doc.data();
         postData.postId = doc.id;
         return likeDocument.get();
       } else {
         return res.status(404).json({ error: 'Post not found' });
       }
     })
     .then((data) => {
       if (data.empty) {
         return db
           .collection('likes')
           .add({
             postId: req.params.postId,
             userNickName: req.user.userNickName
           })
           .then(() => {
             postData.likeCount++;
             return postDocument.update({ likeCount: postData.likeCount });
           })
           .then(() => {
             return res.json(postData);
           });
       } else {
         return res.status(400).json({ error: 'Post already liked' });
       }
     })
     .catch((err) => {
       console.error(err);
       res.status(500).json({ error: err.code });
     });
 };
 
 exports.unlikePost = (req, res) => {
   const likeDocument = db
     .collection('likes')
     .where('userNickName', '==', req.user.userNickName)
     .where('postId', '==', req.params.postId)
     .limit(1);
 
   const postDocument = db.doc(`/posts/${req.params.postId}`);
 
   let postData;
 
   postDocument
     .get()
     .then((doc) => {
       if (doc.exists) {
         postData = doc.data();
         postData.postId = doc.id;
         return likeDocument.get();
       } else {
         return res.status(404).json({ error: 'Post not found' });
       }
     })
     .then((data) => {
       if (data.empty) {
         return res.status(400).json({ error: 'Post not liked' });
       } else {
         return db
           .doc(`/likes/${data.docs[0].id}`)
           .delete()
           .then(() => {
             postData.likeCount--;
             return postDocument.update({ likeCount: postData.likeCount });
           })
           .then(() => {
             res.json(postData);
           });
       }
     })
     .catch((err) => {
       console.error(err);
       res.status(500).json({ error: err.code });
     });
 };