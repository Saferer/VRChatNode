const got = require("got");
const { CookieJar } = require("tough-cookie");
const vrcnodeError = require("./error.js");

//TODO: Check most common errors and throw them.
checkError = (res) => {
  throw new Error(res.error.status_code + ":" + res.error.message);
};

class Call {
  constructor() {
    this.cookieJar = new CookieJar();
    this.api = got.extend({
      prefixUrl: "https://api.vrchat.cloud/api/1/",
      cookieJar: this.cookieJar,
      responseType: "json",
    });
    this.authSet;
    this.apiKey;
  }

  setAuth = (base64Auth) => {
    this.authSet = base64Auth;
  };

  resetAuth = () => {
    this.authSet = undefined;
  };

  call = async (path, method = "GET", options = {}, auth = true) => {
    options = options || {};
    let searchParams = options.searchParams || {};
    const headers = options.headers || {};
    const json = options.json || (method === "GET" ? undefined : {});
    if (auth && !this.authSet) {
      throw new vrcnodeError.AuthNotSet(
        "Calls requiring authentication requires client to be logged in to be called"
      );
    }
    if (!this.apiKey) {
      try {
        const apiKeyRes = await this.api("config");
        this.apiKey = apiKeyRes.body.apiKey;
      } catch (error) {
        console.log(error);
        throw new vrcnodeError.APIKeyError("API key could not be retrieved");
      }
    }
    searchParams.apiKey = this.apiKey;
    let res;
    try {
      res = await this.api(path, {
        headers,
        searchParams,
        method,
        json,
      });
    } catch (error) {
      checkError(error.response.body);
    }
    res = { status: res.statusCode, body: res.body };
    return res;
  };
}

module.exports = {
  Call: Call,
};
