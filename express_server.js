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





//Generates a random number with 6 digits
function generateRandomString() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 7; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const validateEmail = function(email) {
  for(let usersKey in users) {
    if(users[usersKey].email === email){
      return true
    }
  }return false
}



app.set("view engine", "ejs");

//The original database, that can be added and deleted with the buttons below
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const users = { 
  "userRandomID": {
    id: "id", 
    email: "jeffrey.liu90@gmail.com", 
    password: "123"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


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
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"],
  };
  res.render("urls_index", templateVars); // goes to folder views, ejs file named urls_index and display the info
});


// exports the display name onto the page where you are creating a new username
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
  }
  res.render("urls_new", templateVars);
});


// exports the displayname, and also the key and values
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  }; // the shortURL is the path name and what is after 
  res.render("urls_show", templateVars);
  return // goes to folder views, ejs file named urls_index and display the info
});// throws in the templateVars which define variables into the urls_show

// 
app.post("/urls", (req, res) => {
  // console.log(req.body); // log the POST request body to console
  let newShortURL = generateRandomString()
  urlDatabase[newShortURL] = req.body.longURL
  res.redirect(`/urls`) // redirects to main urls page
})


app.get("/u/:shortURL", (req, res) => { // the short URL is clickable, so clicking it directs to the following code
  const longURL = urlDatabase[req.params.shortURL]; // go into the object and find the long link
  res.redirect(longURL); // redirect to the original link
});

// deletes the database function
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")

})


app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls")
})

// goes to log in page, once enter info, remembers cookies
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username)

  res.redirect('/urls')
})

//goes to logout page, where it clears cookies, and then directs back to main page
app.post("/logout", (req, res) => {
  res.clearCookie("username", req.body.username)

  res.redirect('/urls')

  
})

app.get("/register", (req, res) => {
  
  let templateVars = {
    username: req.cookies["username"],
  }
  res.render("register",templateVars);
});



app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if(email === "" || password === ""){
    res.statusCode = 400
    res.send(res.statusCode)
  } else if(validateEmail(email)){
res.statusCode = 400
res.send(res.statusCode)
  } else {
let id = generateRandomString()
users[id] = {
  id,
  email, 
  password
}



res.cookie("user_id", id )
console.log(id)
console.log(users[id])
res.redirect("/urls")
}})

// res.cookies["user_id"]