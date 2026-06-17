import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors'; // CORS middleware
import {check, validationResult} from 'express-validator'; // validation middleware

/** Authentication-related imports **/
import passport from 'passport';                              // authentication middleware
import LocalStrategy from 'passport-local';                   // authentication strategy (username and password)

import session from 'express-session';

import UserDao from "./dao-user.js";
import StationDao from "./dao-station.js";
import ConnectionDao from "./dao-connection.js";
import EventDao from "./dao-event.js";
import GameService from "./game-service.js";

const userDao = new UserDao();
const stationDao = new StationDao();
const connectionDao = new ConnectionDao();
const eventDao = new EventDao();

const gameService = new GameService(stationDao, connectionDao, eventDao, userDao); //game logic

/*** init express and set up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());


/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true 
};
app.use(cors(corsOptions));


/*** Passport ***/



/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUserByCredentials().
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUserByCredentials(username, password)
    if(!user)
        return callback(null, false, 'Incorrect username or password');

    return callback(null, user); //user info in the session
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { 
    callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is userId + username
    return callback(null, user); // this will be available in req.user

    // In this method, if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
    // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));
});


/** Creating the session */

app.use(session({
  secret: "It's a secret!!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}


/*** Utility Functions ***/

// This function is used to handle validation errors
const onValidationErrors = (validationResult, res) => {
    const errors = validationResult.formatWith(errorFormatter);
    return res.status(422).json({validationErrors: errors.mapped()});
};

// Only keep the error message in the response
const errorFormatter = ({msg}) => {
    return msg;
};

/*** Users APIs ***/

// POST /api/sessions
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json({ error: info});
        }
        // success, perform the login and extablish a login session
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUserByCredentials() in LocalStratecy Verify Function
            return res.json(req.user);
        });
    })(req, res, next);
  });

  // GET /api/sessions/current
  // This route checks whether the user is logged in or not.
  app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.status(200).json(req.user);}
    else
      res.status(401).json({error: 'Not authenticated'});
  });

  // DELETE /api/session/current
  // This route is used for loggin out the current user.
  app.delete('/api/sessions/current', (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }

        res.status(200).end();
    });
  });

//POST /api/games
//starts new game for logged in user
app.post('/api/games', isLoggedIn, async (req, res, next) => {
    try {
        const game = await gameService.startNewGame();

        req.session.currentGame = game.gameSession;

        return res.status(200).json(game.clientGame);
    } catch(err) {
        return next(err);
    }
});

// POST /api/games/current/route
//submits the route selected by the user, validates it, selects events and returns them and the result

app.post('/api/games/current/route', isLoggedIn, async (req, res, next) => {
    const connectionIds = req.body.connectionIds;

    //connection Ids validity checks
    if(!Array.isArray(connectionIds) || connectionIds.length === 0) 
        return res.status(422).json({error: 'connectionIds should be a non empty array'});

    if(!connectionIds.every(id => Number.isInteger(id) && id > 0)) {
        return res.status(422).json({error: 'ceach connection should have an id that is an integer equal or greater than one'});
    }

    try{
        const result = await gameService.submitRoute(req.user.userId, req.session.currentGame, connectionIds);
        delete req.session.currentGame; //current game has ended

        return res.json(result);

    } catch(err) {
        return next(err);
    }
});

//GET /api/ranking
//returns rank of users that have played at least one game
app.get('api/ranking', isLoggedIn, async (req, res, next) => {
    try{
        const ranking = await userDao.getRanking();
        return res.json(ranking);
    } catch(err) {
        return next(err);
    }
});
