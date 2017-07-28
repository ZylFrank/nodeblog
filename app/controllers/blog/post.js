/**
 * Created by Administrator on 2017/2/14.
 */
var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post');
  mongoose.Promise = global.Promise
var Category = mongoose.model('Category')

module.exports = function (app) {
  app.use('/posts', router);
};
//添加路由
router.get('/', function (req, res, next) {
  var conditions = {published:true};

  //搜索
  if (req.query.keyword){
    conditions.title = new RegExp(req.query.keyword.trim(),'i');
    conditions.content = new RegExp(req.query.keyword.trim(),'i');
  }
  Post.find(conditions)
      //排序
      .sort('created')
      .populate('author')
      .populate('category')
      .exec(function (err, posts) {
        if (err) return next(err);
        //翻页
        var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
        var pageSize = 10;

        var totalCount = posts.length;
        var pageCount = Math.ceil(totalCount / pageSize);

        if (pageNum > pageCount) {
          pageNum = pageCount;
        }


        res.render('blog/index', {
          title: 'Hello Nodeblog Home',
          posts: posts.slice((pageNum - 1) * pageSize,pageNum*pageSize),
          pageNum: pageNum,
          pageCount: pageCount,
          pretty:true
      });
    });
});

//为分类页面配置路由
router.get('/category/:name', function (req, res, next) {
  Category.findOne({name:req.params.name}).exec(function(err,category){
    if (err){
      return next(err);
    }
    Post.find({category:category,published:true})
      .sort('-created')
      .populate('category')
      .populate('author')
      .exec(function(err,posts){
        if (err){
          return next(err);
        }
        res.render('blog/category', {
            title: 'Hello Nodeblog Home',
            posts: posts,
            category: category,
            pretty:true,
      });
      });
  });

});

router.get('/view/:id', function (req, res, next) {
  if(!req.params.id){
    return next(new Error('no post id provided'))
  }
  //seo优化
  var conditions={};
  try{
    conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch(err){
    conditions.slug = req.params.id;
  }

  //Post.findOne({_id:req.params.id})
  Post.findOne(conditions)
      .populate('category')
      .populate('author')
      .exec(function(err,post){
        if (err){
          return next(err);
        }
        res.render('blog/view',{
          post:post,
        });
      });
});


router.get('/favourite/:id', function (req, res, next) {
  if(!req.params.id){
    return next(new Error('no post id provided'))
  }
  //seo优化id,slug都可以
  var conditions={};
  try{
    conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch(err){
    conditions.slug = req.params.id;
  }

  //Post.findOne({_id:req.params.id})
  Post.findOne(conditions)
      .populate('category')
      .populate('author')
      .exec(function(err,post){
        if (err){
          return next(err);
        }

        //点赞
        post.meta.favourite = post.meta.favourite ? post.meta.favourite + 1 : 1;
        post.markModified('meta');
        post.save(function(err){

          res.redirect('/posts/view/' + post.slug);
        });

      });
});

router.post('/comment/:id', function (req, res, next) {
  if(!req.body.email){
     return next(new Error('no email provided for commenter'))
  }
  if(!req.body.content){
     return next(new Error('no content provided for commenter'))
  }
  //seo优化
  var conditions={};
  try{
    conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch(err){
    conditions.slug = req.params.id;
  }

  //Post.findOne({_id:req.params.id})
  //添加评论
  Post.findOne(conditions).exec(function(err,post){
    if (err){
     return next(err);
    }
    var comment={
      email: req.body.email,
      content: req.body.content,
      created: new Date(),
    }
    //unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度
    post.comments.unshift(comment);
    post.markModified('comments');

    post.save(function(err,post){
      req.flash('info','评论添加成功')
      res.redirect('/posts/view/' + post.slug)
    });

  });
});
