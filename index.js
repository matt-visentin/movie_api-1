const express = require('express'),
  morgan = require('morgan');
  // fs = require('fs'),
  // path = require('path');

const app = express();

let movies = [
  {Title: 'Eternal Sunshine Of A Spottles Mind', Description: 'Description', Genre: 'Genre', Director: [{Name: 'Director\'s name', Bio: 'Bio', Born: 'Date of Birth', Dead: 'Date of death'}], Year: 'Year', Image: 'Image URL'},
  {Title: 'A Marrige Story', Description: 'Description', Genre: 'Genre', Director: [{Name: 'Director\'s name', Bio: 'Bio', Born: 'Date of Birth', Dead: 'Date of death'}], Year: 'Year', Image: 'Image URL'},
  {Title: '', Description: 'Description', Genre: 'Genre', Director: [{Name: 'Director\'s name', Bio: 'Bio', Born: 'Date of Birth', Dead: 'Date of death'}], Year: 'Year', Image: 'Image URL'},
  {Title: 'Title', Description: 'Description', Genre: 'Genre', Director: [{Name: 'Director\'s name', Bio: 'Bio', Born: 'Date of Birth', Dead: 'Date of death'}], Year: 'Year', Image: 'Image URL'},
  {Title: 'Title', Description: 'Description', Genre: 'Genre', Director: [{Name: 'Director\'s name', Bio: 'Bio', Born: 'Date of Birth', Dead: 'Date of death'}], Year: 'Year', Image: 'Image URL'}
];

// app.use(morgan('combined', {stream: accessLogStream}));
app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome Page');
});

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('A problem occured!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});