const validateEmail = function(email, users) {
  for (let usersKey in users) {
    if (users[usersKey].email === email) {
      return true;
    }
  } return false;
};

function findUser(users, email) {
  for (id in users) {
    const user = users[id];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}


//Finding the URLS that belong to that specific user
function urlsForUser(id, urlDatabase) {
  let userURL = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      userURL[key] = urlDatabase[key].longURL;
    }
  } return userURL;
}


module.exports = { findUser, validateEmail, urlsForUser };