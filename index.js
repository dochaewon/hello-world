// index.js

﻿var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); // 1
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);    // 1
mongoose.set('useFindAndModify', false);  // 1
mongoose.set('useCreateIndex', true);     // 1
mongoose.set('useUnifiedTopology', true); // 1
mongoose.connect(process.env.MONGO_DB); // 2
var db = mongoose.connection; //3

db.once('open', function(){
  console.log('DB connected');
});

db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// DB schema // 4
var contactSchema = mongoose.Schema({
  name:{type:String, required:true},
  role:{type:String, required:true},
  email:{type:String, required:true, unique:true},
  birth:{type:String, required:true},
  phone:{type:String, required:true},
  etc:{type:String, required:false}
});
var Contact = mongoose.model('contact', contactSchema);

// Routes
// Home
app.get('/', function(req, res){
  res.redirect('/contacts');
});
// Contacts - Index
app.get('/contacts', function(req, res){
  Contact.find({}, function(err, contacts){
    if(err) return res.json(err);
    res.render('contacts/index', {contacts:contacts});
  });
});
// Contacts - New
app.get('/contacts/new', function(req, res){
  res.render('contacts/new');
});
// Contacts - create
app.post('/contacts', function(req, res){
  Contact.create(req.body, function(err, contact){
    if(err) return res.json(err);
    res.redirect('/contacts');
  });
});
// Contacts - show // 3
app.get('/contacts/:id', function(req, res){
  Contact.findOne({_id:req.params.id}, function(err, contact){
    if(err) return res.json(err);
    res.render('contacts/new', {contact:contact});
  });
});
// Contacts - edit // 4
app.get('/contacts/:id/edit', function(req, res){
  Contact.findOne({_id:req.params.id}, function(err, contact){
    if(err) return res.json(err);
    res.render('contacts/edit', {contact:contact});
  });
});
// Contacts - update // 5
app.put('/contacts/:id', function(req, res){
  Contact.findOneAndUpdate({_id:req.params.id}, req.body, function(err, contact){
    if(err) return res.json(err);
    res.redirect('/contacts/'+req.params.id);
  });
});
// Contacts - destroy // 6
app.delete('/contacts/:id', function(req, res){
  Contact.deleteOne({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect('/contacts');
  });
});

app.listen(3000, function(){
  console.log('Server On!');
});
