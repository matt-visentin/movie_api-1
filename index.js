const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

let topMovies = [
  {Title: 'Title', Director: 'Director\'s name', Year: 'Year'},
  {Title: 'Title', Director: 'Director\'s name', Year: 'Year'},
  {Title: 'Title', Director: 'Director\'s name', Year: 'Year'},
  {Title: 'Title', Director: 'Director\'s name', Year: 'Year'},
  {Title: 'Title', Director: 'Director\'s name', Year: 'Year'},
  {Title: 'Title', Director: 'Director\'s name', Year: 'Year'},
  {Title: 'Title', Director: 'Director\'s name', Year: 'Year'},
  {Title: 'Title', Director: 'Director\'s name', Year: 'Year'},
  {Title: 'Title', Director: 'Director\'s name', Year: 'Year'},
  {Title: 'Title', Director: 'Director\'s name', Year: 'Year'},
];

app.use(morgan('combined', {stream: accessLogStream}));

app.get('/', (req, res) => {
  res.send('Welcome Page');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use('/documentation.html', express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('A problem occured!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});