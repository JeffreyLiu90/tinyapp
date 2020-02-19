const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const morgan = require('morgan');

var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.set('view engine', 'ejs');
app.use(morgan('dev'));




  function generateRandomString() {
    var result           = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
       for ( var i = 0; i < 7; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
 }



app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

//listen on which port, which is defined above
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
})

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
    username: req.cookies["username"],
                
  };
  res.render("urls_index", templateVars); // goes to folder views, ejs file named urls_index and display the info
});

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"],
  }

  res.render("urls_new", templateVars);
});



app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL:urlDatabase[req.params.shortURL],
    username: req.cookies["username"]}; // the shortURL is the path name and what is after 
  res.render("urls_show", templateVars);
  return // goes to folder views, ejs file named urls_index and display the info
});// throws in the templateVars which define variables into the urls_show


app.post("/urls", (req, res) => {
  // console.log(req.body); // log the POST request body to console
  let newShortURL = generateRandomString()
  urlDatabase[newShortURL] = req.body.longURL
  res.redirect(`/urls/${newShortURL}`) // redirects to shortURL above, with the new generated code
  })
  
  app.get("/u/:shortURL", (req, res) => { // the short URL is clickable, so clicking it directs to the following code
    const longURL = urlDatabase[req.params.shortURL]; // go into the object and find the long link
    res.redirect(longURL); // redirect to the original link
  });

  app.post("/urls/:shortURL/delete", (req, res) =>{
delete urlDatabase[req.params.shortURL];
res.redirect("/urls")

  })


  app.post("/urls/:shortURL", (req, res) => {
    urlDatabase[req.params.shortURL] = req.body.longURL
    res.redirect("/urls")
  })


  app.post("/login", (req, res) => {
    res.cookie("username", req.body.username)
  
    res.redirect('/urls')
  })
  
  app.post("/logout", (req, res) => {
res.clearCookie("username", req.body.username)
  
res.redirect('/urls')

  })