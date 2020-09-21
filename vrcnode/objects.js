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
    obj && Object.assign(this, obj);
  }
}

class Avatar {
  constructor(client, obj) {
    obj && Object.assign(this, obj);
  }
}

module.exports = {
  LimitedUser: LimitedUser,
  User: User,
  CurrentUser: CurrentUser,
  Avatar: Avatar,
};
