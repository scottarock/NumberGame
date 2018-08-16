const express = require('express'),
      parser = require('body-parser'),
      path = require('path'),
      session = require('express-session'),
      port = process.env.PORT || 8000,
      app = express();

let text = '',
    // color = 'red',
    guessed = false;

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
  response.render('index', {
    text: text,
    color: guessed ? 'green' : 'red',
    guessed: guessed,
  });
});

app.post('/process-guess', function(request, response) {
  if ( request.body.guess == request.session.number ) {
    // number is guessed, tell the user
    text = `${request.body.guess} was the number!`;
    // color = 'green';
    guessed = true;
  } else {
    // guess is incorrect, let user know if too high or too low
    if ( request.body.guess < request.session.number ) {
      text = 'Too low!'
    } else {
      text = 'Too high!'
    }
  }
  response.redirect('/');
});

app.post('/reset', function(request, response) {
  request.session.number = null;
  text = '';
  // color = 'red';
  guessed = false;
  response.redirect('/');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
