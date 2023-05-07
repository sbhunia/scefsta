var express = require('express');
var cors = require('cors');
var mysqllib = require('mysqlLib');
app = express(),
app.use(cors()),
port = process.env.PORT || 3001;
bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mysqllib.connect().then(() => {
  console.log('Connected to mysql...')
  var routes = require('./api/routes/routes'); //importing route
  routes(app);
  console.log('todo list RESTful API server started on: ' + port);
  app.listen(port);

}).catch(e => {
  console.error('Error connecting mysql...')
  process.exit()
})