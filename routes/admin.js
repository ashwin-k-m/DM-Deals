var express = require('express');

var router = express.Router();

var productHelpers = require('../helpers/product-helpers')
/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    res.render('admin/viewproducts', { products, admin: true })
  })

});

router.get('/addproduct', function (req, res) {
  res.render('admin/addproduct', { admin: true })
})

router.post('/addproduct', (req, res) => {
  productHelpers.addProducts(req.body, (id) => {
    let img = req.files.image
    img.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/addproduct', { admin: true })
      }
    })

  })
})

router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin')
  })
})

router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  res.render('admin/edit-product', { product })
})

router.post('/edit-product/:id', (req, res) => {
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin')
    if (req.files.image) {
      let img = req.files.image
      img.mv('./public/product-images/' + req.params.id + '.jpg')
    }
  })
})

module.exports = router;
