const { db } = require('../util/admin');

exports.getAllShopItems = (req, res) => {
    let items = [];
    db
        .collection('shop')
        .get()
        .then((data) => {
            data.forEach((doc) => {
                items.push({
                    item: doc.data().item,
                    description: doc.data().description,
                    price: doc.data().price,
                    itemId: doc.id
                });
            });
            return res.status(201).json(items);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err.id });
        })
}

exports.buyItem = (req, res) => {
    let usercoins = req.user.userCoins;
    let itemType, price;
    db
        .doc(`/shop/${req.params.item}`)
        .get()
        .then((doc) => {
            if(!doc.exists) {
                return res.status(404).json({ error: 'item not found' });
            }
            else {
                price = doc.data().price;
                itemType = doc.data().itemType;
                if(price > usercoins) {
                    return res.status(403).json({ error: 'insuficient coins' });
                }
                else {
                        return db.doc(`/users/${req.user.userNickName}`).update({userCoins: usercoins - price})
                                .then(() => {
                                    return db.collection('invites').add({
                                        creator: req.user.userNickName,
                                        type: itemType,
                                        createdAt: new Date().toISOString()
                                    })
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                }
            }
        })
        .then(() => {
            return res.status(201).json({ succes: 'success' });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err.id });
        })
}