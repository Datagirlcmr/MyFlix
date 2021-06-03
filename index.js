const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const passport = require('passport');
require('./passport');

const app = express();
app.use(bodyParser.json());
const Movies = Models.Movie;
const Users = Models.User;
const Actors = Models.Actor;
const Directors = Models.Director;
const Genres = Models.Genre;

let auth = require('./auth.js')(app);

mongoose.connect('mongodb://localhost:27017/MYmdb', { useNewUrlParser: true, useUnifiedTopology: true});

// Logging with Morgan
app.use(morgan('common'));

//Welcome message
app.get('/', (req, res) => {
  res.send('Welcome to MYmdb App!');
});

//Get all movies
app.get('/movies', passport.authenticate('jwt', {session:false}), (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Get movies by title
app.get('/movies/:Title', passport.authenticate('jwt', {session:false}), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Get genre info by name
app.get('/genre/:Name', passport.authenticate('jwt', {session:false}), (req, res) => {
  Genres.findOne({ Name: req.params.Name })
  .then((genre) => {
    res.json(genre.Description);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Get director info by name
app.get('/director/:Name', passport.authenticate('jwt', {session:false}), (req, res) => {
  Directors.findOne({ Name: req.params.Name })
  .then((director) => {
    res.json(director);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Get all users
app.get('/users', passport.authenticate('jwt', {session:false}), (req, res) => {
  Users.find().then((users) => {
    res.status(201).json(users);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

// Add user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username }).then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + ' already exists.');
    } else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Get user by username
app.get('/users/:Username', passport.authenticate('jwt', {session:false}), (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Updates user info
app.put('/users/:Username', passport.authenticate('jwt', {session:false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true}, (error, updatedUser) => {
    if(error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    } else {
      res.json(updatedUser);
    }
  });
});

//Adds favorite movie to a user
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', {session:false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true}, (error, updatedUser) => {
    if(error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    } else {
      res.json(updatedUser);
    }
  });
});

//Remove favorite movie from a user
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', {session:false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
  { new: true}, (error, updatedUser) => {
    if(error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    } else {
      res.json(updatedUser);
    }
  });
});

//Delete user
app.delete('/users/:Username', passport.authenticate('jwt', {session:false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user)  => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted');
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Get all actors
app.get('/actors', passport.authenticate('jwt', {session:false}), (req, res) => {
  Actors.find().then((actors) => {
    res.status(201).json(actors);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

// Get actor info by name
app.get('/actors/:Name', passport.authenticate('jwt', {session:false}), (req, res) => {
  Actors.findOne({ Name: req.params.Name })
  .then((actor) => {
    res.json(actor);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});
/*
app.post('/users/:username/favorites/watchlist', (req, res) => {
  res.send(req.params.title + ' was successfully added to your watchlist!');
});

app.delete('/users/:username/favorites/watchlist/:title', (req, res) => {
  res.send(req.params.title + ' was successfully removed from your watchlist!');
});*/

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
