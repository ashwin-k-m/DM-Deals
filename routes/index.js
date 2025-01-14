var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let items = [
    {
      name: "Boat Eardopes 131",
      category: "headphone",
      price: 1099,
      image: "https://images.firstpost.com/wp-content/uploads/2019/06/Airdopes411.jpg?im=FitAndFill=(596,336)"
    },
    {
      name: "Iphone 16 pro",
      category: "mobile",
      price: 129000,
      image: "https://images.macrumors.com/t/AHCF2fbZHvN6V4KR_pQ2_W_uy4g=/800x0/article-new/2024/09/iphone-16-pro-colors-1.jpg?lossy"
    },
    {
      name: "Realme Watch 2",
      category: "smart watch",
      price: 4999,
      image: "https://www.wareable.com/wp-content/uploads/sites/6/2024/migration-3/35510-original-1024x576.jpg"
    },
    {
      name: "Allen Zolly Shirt",
      category: "fashion",
      price: 3699,
      image: "https://allensolly.abfrl.in/blog/wp-content/uploads/2023/04/13-Mens-Premium-Outfitss.jpg"
    },
    {
      name: "Rubics Cube",
      category: "Toy",
      price: 349,
      image: "https://cdn.pixabay.com/photo/2017/01/13/09/23/magic-cube-1976725_1280.jpg"
    },
    {
      name: "Nike Air",
      category: "shoe",
      price: 14999,
      image: "https://media.gettyimages.com/id/1609701777/photo/nashville-tennessee-a-view-of-some-trainers-at-the-soles-with-soul-a-celebration-of-hip-hop.jpg?s=612x612&w=0&k=20&c=JMfjnZKzbKxZnUReJVQF57oz5EwTQZMFtHbJm8sQs6Y="
    },
    {
      name: "Ergonomic chair",
      category: "furniture",
      price: 7999,
      image: "https://cdn11.bigcommerce.com/s-492apnl0xy/images/stencil/1280x1280/products/1315/10157/gallery-chr456-j3-chair-both__43026.1684347740.jpg?c=2"
    },
    {
      name: 'IQOO 13',
      category: "mobile",
      price: 55999,
      image: "https://fdn2.gsmarena.com/vv/pics/vivo/vivo-iqoo-13-11.jpg"
    }
  ]

  let banner = [
    {
      name:"banner 1",
      no:0,
      im:"/images/b1.jpg",
      clas:"active"
    },
    {
      name:"banner 2",
      no:1,
      im:"/images/b2.jpg",
      clas:""
    },{
      name:"banner 3",
      no:2,
      im:"/images/b3.jpg",
      clas:""
    },
    {
      name:"banner 4",
      no:3,
      im:"/images/b4.jpg",
      clas:""
    },
    {
      name:"banner 5",
      no:4,
      im:"/images/b5.jpg",
      clas:""
    }
  ]
  res.render('index', { items ,banner,admin:false});
});

module.exports = router;
