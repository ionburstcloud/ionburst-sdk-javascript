var Settings = require('./settings'),
  APIHandler = require('./apiHandler');

class Client {
  constructor(severUri) {
    this.settings = new Settings(severUri);
    this._apiHandler = new APIHandler(this.settings);
  }
  async initAsync() {
    await this.settings.init();
    await this.createClient();
  }
  async createClient() {
    if (this.settings.CredentialsSet) {
      this._apiHandler.init(this.settings);
      let res = await this._apiHandler.GetJWT();
      if (res.status !== 200) {
        throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
      }
    }
  }
  async _checkinit() {
    if (!this.settings.ionburst_key || !this.settings.ionburst_id || !this.settings.ionburst_uri) {
      await this.initAsync();
    }
  }
  async get(id, callback) {
    await this._checkinit();
    if (typeof callback !== 'function') {
      throw new Error('No callback given to get');
    }
    let res = await this._apiHandler.downloadData(id);
    if (res.status === 200) {
      callback(null, res.data);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }
  async getAsync(id) {
    await this._checkinit();
    let res = await this._apiHandler.downloadData(id);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
    }
  }
  async put(request, callback) {
    await this._checkinit();
    if (typeof callback !== 'function') {
      throw new Error('No callback given to put');
    }
    let res = await this._apiHandler.uploadData(request);
    if (res.status === 200) {
      callback(null, res.data);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }
  async putAsync(request) {
    await this._checkinit();
    let res = await this._apiHandler.uploadData(request);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
    }
  }
  async delete(id, callback) {
    await this._checkinit();
    if (typeof callback !== 'function') {
      throw new Error('No callback given to delete');
    }
    let res = await this._apiHandler.deleteData(id);
    if (res.status === 200) {
      callback(null, res.data);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }
  async deleteAsync(id) {
    await this._checkinit();
    let res = await this._apiHandler.deleteData(id);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
    }
  }
  async getClassifications(callback) {
    await this._checkinit();
    if (typeof callback !== 'function') {
      throw new Error('No callback given to getClassifications');
    }
    let res = await this._apiHandler.classifications();
    if (res.status === 200) {
      callback(null, res.data);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }
  async getClassificationsAsync() {
    await this._checkinit();
    let res = await this._apiHandler.classifications();
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
    }
  }
  async startDeferredAction(request, callback) {
    if (typeof callback !== 'function') {
      throw new Error('No callback given to getClassifications');
    }
    await this._checkinit();
    if (!request.action) {
      callback(new Error(`action must be specified in the parameter for startDeferredActionAsync, status: 400`));
      return;
    }
    let res;
    if (request.action === "GET") {
      res = await this._apiHandler.downloadData(request.id, true);
    } else if (request.action === "PUT") {
      res = await this._apiHandler.uploadData(request, true);
    } else {
      callback(new Error(`Deferred action only available for PUT or GET, status: 400`));
      return;
    }
    if (res.status === 200) {
      callback(null, res.data);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }
  async startDeferredActionAsync(request) {
    await this._checkinit();
    if (!request.action) {
      throw new Error(`action must be specified in the parameter for startDeferredActionAsync, status: 400`);
    }
    let res;
    if (request.action === "GET") {
      res = await this._apiHandler.downloadData(request.id, true);
    } else if (request.action === "PUT") {
      res = await this._apiHandler.uploadData(request, true);
    } else {
      throw new Error(`Deferred action only available for PUT or GET, status: 400`);
    }
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
    }
  }
  async checkDeferred(token, callback) {
    await this._checkinit();
    if (typeof callback !== 'function') {
      throw new Error('No callback given to checkDeferred');
    }
    let res = await this._apiHandler.checkDeferred(token);
    if (res.status === 200 || res.status === 202) {
      callback(null, res.data);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }
  async checkDeferredAsync(token) {
    await this._checkinit();
    let res;
    try {
      res = await this._apiHandler.checkDeferred(token);
    } catch (error) {
      throw new Error(`${error.response.statusText}, status: ${error.response.status}. ${error.response.data}`);
    }

    if (res.status === 200 || res.status === 202) {
      return res.data;
    } else {
      throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
    }
  }
  async fetch(token, callback) {
    await this._checkinit();
    if (typeof callback !== 'function') {
      throw new Error('No callback given to get');
    }
    let res = await this._apiHandler.fetch(token);
    if (res.status === 200) {
      callback(null, res.data);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }
  async fetchAsync(token) {
    await this._checkinit();
    let res = await this._apiHandler.fetch(token);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
    }
  }
}

module.exports = Client;