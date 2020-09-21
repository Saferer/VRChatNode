const got = require("got");
const { CookieJar } = require("tough-cookie");
const { Call } = require("./call");
module.exports = class Client {
  constructor() {
    this.api = new Call();
    this.loggedIn = false;
  }

  login = async (username, password) => {
    try {
      const base = Buffer.from(username + ":" + password).toString("base64");
      const options = {
        headers: {
          Authorization: "Basic " + base,
        },
        auth: true,
      };
      this.api.setAuth(base);
      const res = await this.api.call("auth/user", "GET", options);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  logout = async (req) => {
    try {
      const res = await this.api.call("logout", "PUT");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  me = async (req) => {
    try {
      const res = await this.api.call("auth/user", "GET");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
};
