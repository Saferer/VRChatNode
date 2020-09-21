class LimitedUser {
  constructor(client, obj) {
    this.client = client;
    obj && Object.assign(this, obj);
  }
}

class User extends LimitedUser {
  constructor(client, obj) {
    super(client, obj);
    obj && Object.assign(this, obj);
  }
}

class CurrentUser extends User {
  constructor(client, obj) {
    super(client, obj);
    oboj && Object.assign(this, obj);
  }
}
