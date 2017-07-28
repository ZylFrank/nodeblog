
 var express = require('express'),
 router = express.Router()

 module.exports = function (app) {
    app.use('/', router);
 };
 //添加路由
 router.get('/', function (req, res, next) {
   res.redirect('/posts')
 });

 router.get('/about', function (req, res, next) {
   res.render('blog/about', {
     title: 'About me',
     pretty:true,
 });
 });

 router.get('/contant', function (req, res, next) {
 res.render('blog/contant', {
   title: 'Contant me',
   pretty:true,
 });
 });



