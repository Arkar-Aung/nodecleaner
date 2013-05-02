var express = require('express')
  , http = require('http')
  , path = require('path')
  , route = require('./routes/route');

var app = express();
app.configure(function(){
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.favicon());
});

app.get('/',route.home);
app.post('/',route.getUrl)
app.get('/:url',route.redirect);

app.listen(process.env.VCAP_APP_PORT || 3000);
