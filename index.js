const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      uuid = require('uuid');

app.use(bodyParser.json());

let users = [
  {
    "Id": 1,
    "Name": "User1",
    "Favorites": []
  },
  {
    "Id": 2,
    "Name": "User2",
    "Favorites": ["A Marrige Story"]
  }
]

let movies = [
  {
      "Title": "Eternal Sunshine Of A Spottles Mind",
      "Description": "Description",
      "Genre": {
          "Name": "Name",
          "Description": "Description"
      },
      "Director": {
          "Name": "Director's name",
          "Bio": "Bio",
          "Born": "Date of Birth",
          "Dead": "Date of death"
      },
      "Year": "Year",
      "Image": "#"
  },
  {
      "Title": "A Marrige Story",
      "Description": "Description",
      "Genre": {
          "Name": "Name",
          "Description": "Description"
      },
      "Director": {
          "Name": "Director's name2",
          "Bio": "Bio",
          "Born": "Date of Birth",
          "Dead": "Date of death"
      },
      "Year": "Year",
      "Image": "#"
  }
];

// READ Get all movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
})

// READ Get single movie by Title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title);

  if (movie) {
    return res.status(200).json(movie);
  } else {
    res.status(400).send('No movie in the list mathces the title you provided!');
  }
});

// READ Get genre of a movie by Title
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    return res.status(200).json(genre);
  } else {
    res.status(400).send('No genre mathces your input! Please try with a different genre.');
  }
});

// READ Get director of a movie by director's name
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName).Director;

  if (director) {
    return res.status(200).json(director);
  } else {
    res.status(400).send('No Director mathces your input! Please try with a different genre.');
  }
});

// CREAT Post new user
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.Name) {
    newUser.Id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('User needs a name!');
  }
});

// UPDATE user's detail
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updateUser = req.body;

  let user = users.find( user => user.Id == id);

  if (user) {
    user.Name = updateUser.Name;
    res.status(200).json(user);
  } else {
    res.status(400).send('User not found');
  }

});

// CREATE Add movie to list of favorites
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.Id == id);

  if (user) {
    user.Favorites.push(movieTitle);
    res.status(200).send(movieTitle + ' has been succesfully added to your favorites!');
  } else {
    res.status(400).send(movieTitle + ' has not been added to your favorite do to an unexpected error.');
  }
});

// DELETE Remove movie form list of favorites
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.Id == id);

  if (user) {
    user.Favorites = user.Favorites.filter( Title => Title !== movieTitle)
    res.status(200).send(movieTitle + ' has been succesfully deleted from your favorites!');
  } else {
    res.status(400).send(movieTitle + ' has not been removed from your favorite do to an unexpected error.');
  }
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.Id == id);

  if (user) {
    users = users.filter(user => user.Id != id);
    res.status(200).send('User ' + user.Id + ' has been succesfully removed!');
  } else {
    res.status(400).send(movieTitle + ' has not been removed from your favorite do to an unexpected error.');
  }
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});