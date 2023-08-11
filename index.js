const express = require('express'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      mongoose = require('mongoose'),
      Models = require('./models.js');

const app = express();
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1){
      let message = 'The CORS policy for this application doesn\'t allow access from origin: ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth.js')(app);

const passport = require('passport');
require('./passport.js');

const Movies = Models.Movie;
const Users = Models.User;

/* mongoose.connect('mongodb://localhost:27017/myFlix', { useNewUrlParser: true, useUnifiedTopology: true}); */

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true});


// Default
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// READ Get all movies
app.get('/movies', async (req,res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ Get single movie by Title
app.get('/movies/:MovieTitle', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.MovieTitle})
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ Get genre of a movie by its name
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Genre.Name" : req.params.genreName})
    .then((movie) => {
    res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ Get director of a movie by director's name
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Director.Name" : req.params.directorName})
    .then((movie) => {
    res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// CREAT Post new user
app.post('/users', [
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non aplhanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Passwor is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail(),
  check('Birthday', 'Birthday format is incorrect. Please follow this date-format: YYYY-MM-DD').isDate()
],
async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exist');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) =>{res.status(201).json(user)})
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// READ Get all users
app.get('/users',  passport.authenticate('jwt', { session: false }), async (req,res) => {

  await Users.find()
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error: ' + err);
    });
});

//READ Get user by username
app.get('/users/:Username',  passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOne({ Username: req.params.Username})
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// UPDATE Update a user's info, by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), [
  check('Username', 'Username must be at least 5 characters').isLength({min: 5}),
  check('Username', 'Username contains non aplhanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Passwor is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail(),
  check('Birthday', 'Birthday format is incorrect. Please follow this date-format: YYYY-MM-DD').isDate()
],
async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array });
  }
  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permision denied.')
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOneAndUpdate({ Username: req.params.Username },
  { $set:
  {
    Username: req.body.Username,
    Password: hashedPassword,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  }},
  { new: true})
  .then((updatedUser) =>{
    res.status(200).json(updatedUser);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error: ' + err);
  })
});

// POST Add movie to list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permision denied.')
  }
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { Favorites: req.params.MovieID }
   },
   { new: true })
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// DELETE Remove movie form list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permision denied.')
  }
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { Favorites: req.params.MovieID }
   },
   { new: true })
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// DELETE user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permision denied.')
  }
  await Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found.');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.')
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.listen(port, '0.0.0.0.', () => {
  console.log('Listening port: ' + port);
});