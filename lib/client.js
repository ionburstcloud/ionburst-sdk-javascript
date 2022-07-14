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

  // authentication

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

  // GET - S6 and NKV

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

  async getSecrets(id, callback) {
    await this._checkinit();
    if (typeof callback !== 'function') {
      throw new Error('No callback given to get');
    }
    let res = await this._apiHandler.downloadSecrets(id);
    if (res.status === 200) {
      callback(null, res.data);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }

  async getSecretsAsync(id) {
    await this._checkinit();
    let res = await this._apiHandler.downloadSecrets(id);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
    }
  }

  // PUT - S6 and NKV

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

  async putSecrets(request, callback) {
    await this._checkinit();
    if (typeof callback !== 'function') {
      throw new Error('No callback given to put');
    }
    let res = await this._apiHandler.uploadSecrets(request);
    if (res.status === 200) {
      callback(null, res.data);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }

  async putSecretsAsync(request) {
    await this._checkinit();
    let res = await this._apiHandler.uploadSecrets(request);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
    }
  }

  // DELETE - S6 and NKV

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

  async deleteSecrets(id, callback) {
    await this._checkinit();
    if (typeof callback !== 'function') {
      throw new Error('No callback given to delete');
    }
    let res = await this._apiHandler.deleteSecrets(id);
    if (res.status === 200) {
      callback(null, res.data);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }

  async deleteSecretsAsync(id) {
    await this._checkinit();
    let res = await this._apiHandler.deleteSecrets(id);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
    }
  }

  // HEAD - S6 and NKV

  async head(id, callback) {
    await this._checkinit();
    if (typeof callback !== 'function') {
      throw new Error('No callback given to get');
    }
    let res = await this._apiHandler.headData(id);
    if (res.status === 200) {
      let headResponse = {exists: true, length: res.headers["x-original-length"]}
      callback(null, headResponse);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }

  async headAsync(id) {
    await this._checkinit();
    let res = await this._apiHandler.headData(id);
    if (res.status === 200) {
      let headResponse = {exists: true, length: res.headers["x-original-length"]}
      return headResponse;
    } else {
      throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
    }
  }

  async headSecrets(id, callback) {
    await this._checkinit();
    if (typeof callback !== 'function') {
      throw new Error('No callback given to get');
    }
    let res = await this._apiHandler.headSecrets(id);
    if (res.status === 200) {
      let headResponse = {exists: true, length: res.headers["x-original-length"]}
      callback(null, headResponse);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }

  async headSecretsAsync(id) {
    await this._checkinit();
    let res = await this._apiHandler.headSecrets(id);
    if (res.status === 200) {
      let headResponse = {exists: true, length: res.headers["x-original-length"]}
      return headResponse;
    } else {
      throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
    }
  }

  // classifications

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

  // deferred methods

  async startDeferredAction(request, callback) {
    if (typeof callback !== 'function') {
      throw new Error('No callback given to startDeferredAction');
    }
    await this._checkinit();
    if (!request.action) {
      callback(new Error(`action must be specified in the parameter for startDeferredAction, status: 400`));
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

  async startDeferredSecretsAction(request, callback) {
    if (typeof callback !== 'function') {
      throw new Error('No callback given to startDeferredSecretsAction');
    }
    await this._checkinit();
    if (!request.action) {
      callback(new Error(`action must be specified in the parameter for startDeferredSecretsAction, status: 400`));
      return;
    }
    let res;
    if (request.action === "GET") {
      res = await this._apiHandler.downloadSecrets(request.id, true);
    } else if (request.action === "PUT") {
      res = await this._apiHandler.uploadSecrets(request, true);
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

  async startDeferredSecretsActionAsync(request) {
    await this._checkinit();
    if (!request.action) {
      throw new Error(`action must be specified in the parameter for startDeferredSecretsActionAsync, status: 400`);
    }
    let res;
    if (request.action === "GET") {
      res = await this._apiHandler.downloadSecrets(request.id, true);
    } else if (request.action === "PUT") {
      res = await this._apiHandler.uploadSecrets(request, true);
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

  async checkDeferredSecrets(token, callback) {
    await this._checkinit();
    if (typeof callback !== 'function') {
      throw new Error('No callback given to checkDeferredSecrets');
    }
    let res = await this._apiHandler.checkDeferredSecrets(token);
    if (res.status === 200 || res.status === 202) {
      callback(null, res.data);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }

  async checkDeferredSecretsAsync(token) {
    await this._checkinit();
    let res;
    try {
      res = await this._apiHandler.checkDeferredSecrets(token);
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

  async fetchSecrets(token, callback) {
    await this._checkinit();
    if (typeof callback !== 'function') {
      throw new Error('No callback given to get');
    }
    let res = await this._apiHandler.fetchSecrets(token);
    if (res.status === 200) {
      callback(null, res.data);
    } else {
      callback(new Error(`${res.statusText}, status: ${res.status}. ${res.data}`));
    }
  }

  async fetchSecretsAsync(token) {
    await this._checkinit();
    let res = await this._apiHandler.fetchSecrets(token);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`${res.statusText}, status: ${res.status}. ${res.data}`);
    }
  }
}

module.exports = Client;