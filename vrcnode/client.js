const got = require("got");
const { CookieJar } = require("tough-cookie");
const { Call } = require("./call");
const { LimitedUser, User, CurrentUser, Avatar, World } = require("./objects");
const vrcnodeError = require("./error.js");

module.exports = class Client {
  constructor() {
    this.api = new Call();
    this.loggedIn = false;
    this.me;
  }

  login = async (username, password) => {
    const base = Buffer.from(username + ":" + password).toString("base64");
    const options = {
      headers: {
        Authorization: "Basic " + base,
      },
    };
    this.api.setAuth(base);
    const res = await this.api.call("auth/user", "GET", options);
    this.loggedIn = true;

    this.me = new CurrentUser(this, res.body);
    return this.me;
  };

  logout = async () => {
    if (this.loggedIn) {
      const res = await this.api.call("logout", "PUT", {});
      this.loggedIn = false;
      console.log(res);
    }
  };

  fetchMe = async () => {
    const res = await this.api.call("auth/user", "GET");
    this.me = new CurrentUser(this, res.body);
    return this.me;
  };

  fetchFriends = async (n = 0, offset = 0, offline = false) => {
    let friends = [];
    while (1) {
      let max = 100;
      if (n !== 0 && n - friends.length < 100) {
        max -= friends.length;
      }

      let index = 0;
      const res = await this.api.call("auth/user/friends", "GET", {
        searchParams: {
          offset,
          n,
          offline,
        },
      });
      res.body.forEach((friend) => {
        friends.push(new LimitedUser(this, friend));
        index++;
      });

      if (index < 100) {
        break;
      }
      offset += 100;
    }
    return friends;
  };

  fetchAvatar = async (id) => {
    const res = await this.api.call(`avatars/${id}`, "GET");
    return new Avatar(this, res.body);
  };

  fetchWorld = async (id) => {
    const res = await this.api.call(`worlds/${id}`, "GET");
    console.log(res);
    return new World(this, res.body);
  };
};
