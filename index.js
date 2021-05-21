const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const app = express();

// Logging with Morgan
app.use(morgan('common'));

let topMovies = [
  {
    title: 'The Shawshank Redemption',
    description: 'It tells the story of banker Andy Dufresne, who is sentenced to life in Shawshank State Penitentiary for the murders of his wife and her lover, despite his claims of innocence.',
    genre: 'Drama',
    director: 'Frank Darabont',
    image: 'https://en.wikipedia.org/wiki/The_Shawshank_Redemption#/media/File:ShawshankRedemptionMoviePoster.jpg',
  },
  {
    title: 'The Godfather',
    description: 'The story chronicles the Corleone family under patriarch Vito Corleone.',
    genre: 'Crime',
    director: 'Francis Ford Coppola',
    image: 'https://en.wikipedia.org/wiki/The_Godfather#/media/File:Godfather_ver1.jpg',
  },
  {
    title: 'The Dark Knight',
    description: 'Batman, Police Lieutenant James Gordon and District Attorney Harvey Dent form an alliance to dismantle organized crime in Gotham City.',
    genre: 'Superhero',
    director: 'Christopher Nolan',
    image: 'https://en.wikipedia.org/wiki/The_Dark_Knight_(film)#/media/File:Dark_Knight.jpg',
  },
  {
    title: '12 Angry Men',
    description: 'The film tells the story of a jury of 12 men',
    genre: 'Drama',
    director: 'Sidney Lumet',
    image: 'https://en.wikipedia.org/wiki/12_Angry_Men_(1957_film)#/media/File:12_Angry_Men_(1957_film_poster).jpg',
  },
  {
    title: 'Schindler\'s List',
    description: 'The film follows Oskar Schindler who saved more than a thousand mostly Polish-Jewish refugees from the Holocaust.',
    genre: 'Historical Drama',
    director: 'Steven Spielberg',
    image: 'https://en.wikipedia.org/wiki/Schindler%27s_List#/media/File:Schindler\'s_List_movie.jpg',
  },
  {
    title: 'Pulp Fiction',
    description: 'It tells several stories of criminal Los Angeles.',
    genre: 'Comedy crime',
    director: 'Quentin Tarantino',
    image: 'https://en.wikipedia.org/wiki/Pulp_Fiction#/media/File:Pulp_Fiction_(1994)_poster.jpg',
  },
  {
    title: 'The Good, The Bad And The Ugly',
    description: 'The plot revolves around three gunslingers competing to find a fortune.',
    genre: 'Western',
    director: 'Sergio Leone',
    image: 'https://en.wikipedia.org/wiki/The_Good,_the_Bad_and_the_Ugly#/media/File:Good_the_bad_and_the_ugly_poster.jpg',
  },
  {
    title: 'Fight Club',
    description: 'Edward Norton plays the unnamed narrator, who is discontented with his white-collar job.',
    genre: 'Drama',
    director: 'David Fincher',
    image: 'https://en.wikipedia.org/wiki/Fight_Club#/media/File:Fight_Club_poster.jpg',
  },
  {
    title: 'Forrest Gump',
    description: 'The story depicts several decades in the life of Forrest Gump.',
    genre: 'Drama',
    director: 'Robert Zemeckis',
    image: 'https://en.wikipedia.org/wiki/Forrest_Gump#/media/File:Forrest_Gump_poster.jpg',
  },
  {
    title: 'Inception',
    description: 'The film stars a professional thief who steals information by infiltrating the subconscious of his targets.',
    genre: 'Action',
    director: 'Christopher Nolan',
    image: 'https://en.wikipedia.org/wiki/Inception#/media/File:Inception_(2010)_theatrical_poster.jpg',
  },
]

// GET request
app.get('/', (req, res) => {
  res.send('Welcome to my top 10 Movie App!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/movies/:title', (req, res) => {
  res.json(topMovies.find( (topMovies) => {
    return topMovies.title === req.params.title
  }));
});

app.get('/movies/genres/:genre', (req, res) => {
  res.send('Here comes the genres');
});

app.get('/movies/directors/:name', (req, res) => {
  res.send('Here comes the directors');
});

app.post('/users', (req, res) => {
  res.send('Your registration was successful!');
});

app.put('/users/:username', (req, res) => {
  res.send(req.params.username + 'Your profile update was successful!');
});

app.post('/users/:username/favorites', (req, res) => {
  res.send(req.params.title + ' was successfully added to your favorites!');
});

app.delete('/users/:username/favorites/:title', (req, res) => {
  res.send(req.params.title + ' was successfully removed from your favorites!');
});

app.delete('/users/:username', (req, res) => {
  res.send('You successfully deleted your account!');
});

app.get('/actors', (req, res) => {
  res.send('Here comes the actors');
});

app.get('/actors/:name', (req, res) => {
  res.send('Here comes the details about one actor');
});

app.get('/movies/:title', (req, res) => {
  res.send('More info on the movie');
});

app.post('/users/:username/favorites/watchlist', (req, res) => {
  res.send(req.params.title + ' was successfully added to your watchlist!');
});

app.delete('/users/:username/favorites/watchlist/:title', (req, res) => {
  res.send(req.params.title + ' was successfully removed from your watchlist!');
});

// Set static file
app.use(express.static('public'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is not working!');
});

app.listen(8080, () => {
  console.log('My app is listening to Port 8080')
});
