const express = require('express'),
      parser = require('body-parser'),
      path = require('path'),
      session = require('express-session'),
      port = process.env.PORT || 8000,
      app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));
app.use(parser.urlencoded({ extended: true }));
app.use(session({
  secret: 'itsasecret',
  resave: false,
  saveUninitialized: true,
}));

app.get('/', function(request, response) {
  if ( !request.session.number ) {
    // haven't generated a random number to guess, do it
    request.session.number = Math.floor(Math.random() * 100 + 1);
  }
  response.render('index', { number: request.session.number });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
