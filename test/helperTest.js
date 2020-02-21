const { assert } = require('chai');

const { findUser, validateEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('findUser', function() {
  it('should return a user with valid email', function() {
    const user = findUser(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    assert.equal(user.id, expectedOutput);
  });
});

describe('validateEmail', function() {
  it('should return a true statement if there is a valid email', function() {
    const user = validateEmail("user@example.com", testUsers);
    const expectedOutput = true;
    console.log(user.email);
    assert.equal(user, expectedOutput);
  });
});
