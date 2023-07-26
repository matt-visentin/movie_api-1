const express = require('express'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      mongoose = require('mongoose'),
      Models = require('./models.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Direcotr;

mongoose.connect('mongodb://localhost:27017/myFlix', { useNewUrlParser: true, useUnifiedTopology: true});

// let users = [
//   {
//     "Id": 1,
//     "Name": "User1",
//     "Favorites": []
//   },
//   {
//     "Id": 2,
//     "Name": "User2",
//     "Favorites": ["A Marrige Story"]
//   }
// ]

// let movies = [
//   {
//       "Title": "Eternal Sunshine Of A Spottles Mind",
//       "Description": "Description",
//       "Genre": {
//           "Name": "Name",
//           "Description": "Description"
//       },
//       "Director": {
//           "Name": "Director's name",
//           "Bio": "Bio",
//           "Born": "Date of Birth",
//           "Dead": "Date of death"
//       },
//       "Year": "Year",
//       "Image": "#"
//   },
//   {
//       "Title": "A Marrige Story",
//       "Description": "Description",
//       "Genre": {
//           "Name": "Name",
//           "Description": "Description"
//       },
//       "Director": {
//           "Name": "Director's name2",
//           "Bio": "Bio",
//           "Born": "Date of Birth",
//           "Dead": "Date of death"
//       },
//       "Year": "Year",
//       "Image": "#"
//   }
// ];

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
/*app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});*/

// READ Get single movie by Title
app.get('/movies/:MovieTitle', async (req, res) => {
  await Movies.findOne({ Title: req.params.MovieTitle})
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
/*app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title);

  if (movie) {
    return res.status(200).json(movie);
  } else {
    res.status(400).send('No movie in the list mathces the title you provided!');
  }
});*/

// READ Get genre of a movie by its name
app.get('/movies/genre/:GenreName', async (req, res) => {
  await Movies.findOne({ "Genre.Name" : req.params.GenreName})
    .then((movie) => {
    res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ Get director of a movie by director's name
app.get('/movies/director/:directorName', async (req, res) => {
  await Movies.findOne({ "Director.Name" : req.params.directorName})
    .then((movie) => {
    res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/* app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName).Director;

  if (director) {
    return res.status(200).json(director);
  } else {
    res.status(400).send('No Director mathces your input! Please try with a different genre.');
  }
}); */

// CREAT Post new user
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exist');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
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
/*app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.Name) {
    newUser.Id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('User needs a name!');
  }
});*/

// READ Get all users
app.get('/users', async (req,res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error: ' + err);
    });
});

//READ Get user by username
app.get('/users/:Username', async (req, res) => {
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
app.put('/users/:Username', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username },
    { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
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
/*app.put('/users/:userId', (req, res) => {
  const { userId } = req.params;
  const updateUser = req.body;

  let user = users.find( user => user.Id == userId);

  if (user) {
    user.Name = updateUser.Name;
    res.status(200).json(user);
  } else {
    res.status(400).send('User not found');
  }
});*/

// POST Add movie to list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
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

/*app.patch('/users/:userId/favorites/:movieTitle', (req, res) => {
  const { userId, movieTitle } = req.params;

  let user = users.find( user => user.Id == userId);

  if (user) {
    user.Favorites.push(movieTitle);
    res.status(200).send(movieTitle + ' has been succesfully added to your favorites!');
  } else {
    res.status(400).send(movieTitle + ' has not been added to your favorite do to an unexpected error.');
  }
});*/

// DELETE Remove movie form list of favorites
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
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
/*app.delete('/users/:userId/favorites/:movieTitle', (req, res) => {
  const { userId, movieTitle } = req.params;

  let user = users.find( user => user.Id == userId);

  if (user) {
    user.Favorites = user.Favorites.filter( Title => Title !== movieTitle);
    res.status(200).send(movieTitle + ' has been succesfully removed from your favorites!');
  } else {
    res.status(400).send(movieTitle + ' has not been removed from your favorite do to an unexpected error.');
  }
});*/

// DELETE user
app.delete('/users/:Username', async (req, res) => {
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

/*app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.Id == id);

  if (user) {
    users = users.filter(user => user.Id != id);
    res.status(200).send('User ' + user.Id + ' has been succesfully removed!');
  } else {
    res.status(400).send(movieTitle + ' has not been removed from your favorite do to an unexpected error.');
  }
});*/

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});