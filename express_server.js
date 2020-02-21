const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); // make it readable
app.use(bodyParser.urlencoded({ extended: true }));
const morgan = require('morgan');
const bcrypt = require('bcrypt');
var cookieSession = require('cookie-session');
app.listen(PORT, () => {  //listen on which port, which is defined above
  console.log(`Example app listening on port ${PORT}!`);
});


const { findUser, validateEmail, urlsForUser} = require("./helpers");

app.use(cookieSession({
  name: 'session',
  secret: 'lighthouse',
  maxAge: 24 * 60 * 60 * 1000 // // Cookie Options, 24 hours
}));

// set the view to ejs
app.set('view engine', 'ejs');
app.use(morgan('dev'));

//example urlDatabase
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
};

//Generates a random number with 6 digits
function generateRandomString() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 7; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function validateUserPassword(password, user) {
  return bcrypt.compareSync(password, user.hashedPassword);
}

function getUserId(user) {
  return user.id;
}

//The users, with an example inside
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    hashedPassword: "purple-monkey-dinosaur"
  }
};

/*
Happy Path
1. find user
2. compare passwords
3. return id
*/
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let user = findUser(users, email);
  if (user && validateUserPassword(password, user)) {
    let userId = getUserId(user);
    req.session.user_id = userId;
    res.redirect("/urls");
  } else {
    res.sendStatus(401);
  }
});


// exports the username cookies input to urls_index so it can also view the display name. Also the database. This will be shown on the URLS page (main page)
app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  if (!users[userId]) {
    res.redirect("/login"); // if the user is not logged in, redirect to login page
  } else {
    // let longURL = urlDatabase.id
    let userURLs = urlsForUser(userId, urlDatabase); // apply the function, input the current user's id in, match
    let templateVars = {
      urls: userURLs, // show the specific user's id and urls
      user: users[userId]
    };
    res.render("urls_index", templateVars); // goes to folder views, ejs file named urls_index and display the info
  }
});

// exports the display name onto the page where you are creating a new username
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (!users[req.session.user_id]) {
    res.redirect("/urls");
  } else {
    res.render("urls_new", templateVars);
  }
});

// exports the displayname, and also the key and values
app.get("/urls/:shortURL", (req, res) => {
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    res.sendStatus(401);
    return;
  } else {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id]
    };// the shortURL is the path name and what is after
    res.render("urls_show", templateVars);
    // goes to folder views, ejs file named urls_index and display the info
  }
});// throws in the templateVars which define variables into the urls_show

app.post("/urls", (req, res) => {
  // console.log(req.body); // log the POST request body to console
  let newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls`); // redirects to main urls page
});

app.get("/u/:shortURL", (req, res) => { // the short URL is clickable, so clicking it directs to the following code

  const longURL = urlDatabase[req.params.shortURL].longURL; // go into the object and find the long link
  res.redirect(longURL); // redirect to the original link
});

// deletes the database function
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(urlDatabase[req.params.shortURL]);
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    res.sendStatus(401);
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect("/urls");
});


//goes to logout page, where it clears cookies, and then directs back to main page
app.post("/logout", (req, res) => {

  // res.clearCookie("user", req.body.username)
  req.session = null;// clear the whole user object cookie
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render("login", templateVars);
});

function generateHashedPassword(password) {
  return bcrypt.hashSync(password, 10);
}

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.statusCode = 400;
    res.send(res.statusCode);
  } else if (validateEmail(email, users)) {
    res.statusCode = 400;
    res.send(res.statusCode);
  } else {
    let id = generateRandomString();
    let hashedPassword = generateHashedPassword(password);
    users[id] = {
      id,
      email,
      hashedPassword
    };
    req.session.user_id = id;
    res.redirect("/urls");
  }
});


