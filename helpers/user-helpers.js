var db = require('../config/connection')
var collections = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((Status) => {
                    if (Status) {
                        console.log("login success")
                        response.user = user
                        response.Status = true
                        resolve(response)
                    } else {
                        console.log("login failed")
                        resolve({ Status: false })
                    }
                })
            } else {
                console.log("login failed")
                resolve({ Status: false })
            }
        })
    },
    addToCart: (proId, userId) => {
        let proObj = {
            item: objectId(proId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collections.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (userCart) {
                let proExist = userCart.products.findIndex(product => product.item == proId)
                if (proExist !== -1) {
                    db.get().collection(collections.CART_COLLECTION).updateOne({ user: objectId(userId), 'products.item': objectId(proId) },
                        {
                            $inc: { 'products.$.quantity': 1 }
                        }).then(() => {
                            resolve()
                        })
                } else {
                    db.get().collection(collections.CART_COLLECTION).updateOne({ user: objectId(userId) },
                        {
                            $push: { products: proObj }

                        }).then((response) => {
                            resolve()
                        })
                }
            } else {
                let cartObj = {
                    user: objectId(userId),
                    products: [proObj]
                }
                db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    },
    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: "$products"
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        localField: "item",
                        foreignField: "_id",
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }
            ]).toArray();

            resolve(cartItems);
        });
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collections.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    },
    changeProductQuantity: (details) => {
        let count = parseInt(details.count)
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).updateOne({ _id: objectId(details.cart), 'products.item': objectId(details.product) },
                {
                    $inc: { 'products.$.quantity': count }
                }).then(() => {
                    resolve()
                })
        })
    },
    deleteCartProduct: (cartId, proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).updateOne(
                { _id: objectId(cartId) },
                { $pull: { products: { item: objectId(proId) } } }
            ).then((response) => {
                resolve(response);
            }).catch(err => reject(err));
        });
    },
    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: "$products"
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        localField: "item",
                        foreignField: "_id",
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] },
                        price: { $toInt: { $arrayElemAt: ['$product.Price', 0] } }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', '$price'] } }
                    }
                }
            ]).toArray();

            if (total.length > 0) {
                resolve(total[0].total);
            } else {
                resolve(0);
            }
        });
    },
    placeOrder: (order, products, total) => {
        return new Promise(async (resolve, reject) => {
            let status = order['payment'] === 'cod' ? 'placed' : 'pending'
            let orderObj = {
                deliveryDetails: {
                    mobile: order.mobile,
                    address: order.address,
                    pincode: order.pincode
                },
                userId: objectId(order.userId),
                payment: order['payment'],
                products: products,
                totalAmount: total,
                status: status,
                date: new Date()
            }
            db.get().collection(collections.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
                db.get().collection(collections.CART_COLLECTION).removeOne({ user: objectId(order.userId) })
                resolve()
            })
        })
    },
    getCartProductList: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collections.CART_COLLECTION).findOne({ user: objectId(userId) })
            resolve(cart.products)
        })
    }


}