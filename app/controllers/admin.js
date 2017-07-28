/**
 * Created by Administrator on 2017/2/11.
 */
var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post');

module.exports = function (app) {
  app.use('/admin', router);
};
//添加路由
router.get('/', function (req, res, next) {
  Post.find(function (err, posts) {
    if (err) return next(err);
    res.render('admin/index', {
      title: 'Hello Nodeblog Admin',
      posts: posts,
      pretty:true
    });
  });
});

