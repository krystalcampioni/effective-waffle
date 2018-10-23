const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser')

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));

const mainRoutes = require('./routes');
const cityRoutes = require('./routes/city');

app.use(mainRoutes);
app.use('/city', cityRoutes);

app.use(function(req, res, next){
  res.render('error', { status: 404, url: req.url });
});

app.use(function(err, req, res, next){
  res.render('error', {
      status: err.status || 500
    , error: err
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
