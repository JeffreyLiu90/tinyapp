const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); // make it readable
app.use(bodyParser.urlencoded({ extended: true }));
const morgan = require('morgan');

var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.set('view engine', 'ejs'); // set the view to ejs
app.use(morgan('dev'));


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3eoGr: { longURL: "https://www.google.ca", userID: "ffffW" },
  i3weoGr: { longURL: "https://www.900ogle.ca", userID: "aJ48lW" },
  i323Gr: { longURL: "https://www.yahoo.ca", userID: "ffffW" },
  i355Gr: { longURL: "https://www.random.ca", userID: "aJ48lW" }
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

const validateEmail = function (email) {
  for (let usersKey in users) {
    if (users[usersKey].email === email) {
      return true
    }
  } return false
}

const validatePassword = function (email, password) {
  for (let userKey in users) {
    if (users[userKey].email === email) {
      if (users[userKey].password === password) {
        return users[userKey] // returns the specific object of user
      }
    }
  } return false
}



function urlsForUser(id) {
  let userURL = {}
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      userURL[key] = urlDatabase[key].longURL
    }
  } return userURL
}

console.log(urlsForUser("ffffW"))

app.set("view engine", "ejs");

//The original database, that can be added and deleted with the buttons below

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "jeffrey.liu90@gmail.com",
    password: "123"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}



// "b2xVn2": "http://www.lighthouselabs.ca",
// "9sm5xK": "http://www.google.com"



// Going to root, you will see Hello!
app.get("/", (req, res) => {
  res.send("Hello!");
});

//listen on which port, which is defined above
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// returns the object version of database
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
})


// exports the username cookies input to urls_index so it can also view the display name. Also the database. This will be shown on the URLS page (main page)
app.get("/urls", (req, res) => {
  if (!users[req.cookies["user_id"]]) {
    res.redirect("/login") // if the user is not logged in, redirect to login page
  } else {
    // let longURL = urlDatabase.id
    let userURLs = urlsForUser(req.cookies["user_id"]) // apply the function, input the current user's id in, match
    let templateVars = {
      urls: userURLs, // show the specific user's id and urls
      user: users[req.cookies["user_id"]]
      // user_id: req.cookies["user_id"]
    }
    res.render("urls_index", templateVars); // goes to folder views, ejs file named urls_index and display the info
  }
});


// exports the display name onto the page where you are creating a new username
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
    // user_id: req.cookies["user_id"]
  }

  if (!users[req.cookies["user_id"]]) {
    res.redirect("/urls")
  } else {
    res.render("urls_new", templateVars);
  }
});


// exports the displayname, and also the key and values
app.get("/urls/:shortURL", (req, res) => {
  if (req.cookies["user_id"] !== urlDatabase[req.params.shortURL].userID) {
    res.sendStatus(401);
    return
  } else {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]]
    // user_id: req.cookies["user_id"]

  }; // the shortURL is the path name and what is after 
  res.render("urls_show", templateVars);
 // goes to folder views, ejs file named urls_index and display the info
  }
});// throws in the templateVars which define variables into the urls_show

// 
app.post("/urls", (req, res) => {
  // console.log(req.body); // log the POST request body to console
  let newShortURL = generateRandomString()
  urlDatabase[newShortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"]
  }
  res.redirect(`/urls`) // redirects to main urls page
})


app.get("/u/:shortURL", (req, res) => { // the short URL is clickable, so clicking it directs to the following code
  
  const longURL = urlDatabase[req.params.shortURL].longURL; // go into the object and find the long link
  res.redirect(longURL); // redirect to the original link
});


// deletes the database function
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.cookies["user_id"] !== urlDatabase[req.params.shortURL].userID) {
    res.sendStatus(401); 
  } else {
    delete urlDatabase[req.params.shortURL];
    // res.redirect("/urls")

  }}
)



app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"]
  }
  res.redirect("/urls")
})



//goes to logout page, where it clears cookies, and then directs back to main page
app.post("/logout", (req, res) => {

  // res.clearCookie("user", req.body.username)
  res.clearCookie("user_id") // clear the whole user object cookie
  res.redirect('/urls')


})

app.get("/register", (req, res) => {

  let templateVars = {
    // username: req.cookies["username"],
    user: users[req.cookies["user_id"]]
  }
  res.render("register", templateVars);
});


app.get("/login", (req, res) => {

  let templateVars = {
    // username: req.cookies["username"],
    user: users[req.cookies["user_id"]]
  }

  res.render("login", templateVars);
});


app.post("/login", (req, res) => {
  // console.log(users)
  const { email, password } = req.body;
  var user;
  if (validateEmail(email) === false) {
    res.statusCode = 403
    res.send(res.statusCode)
  } else if (user = validatePassword(email, password)) { // let user be the user object that was returned
    res.cookie("user_id", user.id) // request the cookie from the id of that specific user
    res.redirect("/urls")
    console.log(user)

  } else {


    res.statusCode = 403
    res.send(res.statusCode)
  }
})




app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.statusCode = 400
    res.send(res.statusCode)
  } else if (validateEmail(email)) {
    res.statusCode = 400
    res.send(res.statusCode)
  } else {
    let id = generateRandomString()
    users[id] = {
      id,
      email,
      password
    }
    res.cookie("user_id", id)

    // console.log(users[id])
    res.redirect("/urls")
  }
})


