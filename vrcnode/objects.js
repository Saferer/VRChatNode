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

  updateMe = async (params) => {
    const res = await this.client.api.call(`users/${this.id}`, "PUT", {
      json: params,
    });
    Object.assign(this, res.body);
    return this;
  };
}

class Avatar {
  constructor(client, obj) {
    this.client = client;
    obj && Object.assign(this, obj);
  }
}

class LimitedWorld {
  constructor(client, obj) {
    this.client = client;
    obj && Object.assign(this, obj);
  }
}

class World extends LimitedWorld {
  constructor(client, obj) {
    super(client, obj);
    obj && Object.assign(this, obj);
  }
}

module.exports = {
  LimitedUser: LimitedUser,
  User: User,
  CurrentUser: CurrentUser,
  Avatar: Avatar,
  World: World,
  LimitedWorld: LimitedWorld,
};
