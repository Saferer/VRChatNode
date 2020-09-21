const got = require("got");
const { CookieJar } = require("tough-cookie");
const vrcnodeError = require("./error.js");

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
    const headers = options.headers || {};
    let searchParams = options.searchParams || {};
    const json = options.json || method === "GET" ? undefined : {};
    if (auth && !this.authSet) {
      throw new vrcnodeError.AuthNotSet(
        "Calls requiring authentication requires set_auth to be called"
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
    try {
      let res = await this.api(path, {
        headers,
        searchParams,
        method,
        json,
      });
      res = { status: res.statusCode, body: res.body };
      return res;
    } catch (error) {
      console.log(error);
      checkError(error.response.body);
    }
  };
}

module.exports = {
  Call: Call,
};
