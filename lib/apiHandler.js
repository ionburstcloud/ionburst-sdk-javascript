const axios = require('axios');
class APIHandler {
  constructor(config) {
    axios.defaults.maxBodyLength = 52428800;
    axios.defaults.maxContentLength = 52428800;
    this.ionburst_id = config.ionburst_id;
    this.ionburst_key = config.ionburst_key;
    this.ionburst_uri = config.ionburst_uri;
    if (this.ionburst_uri && !this.ionburst_uri.endsWith('/')) {
      this.ionburst_uri = this.ionburst_uri + '/';
    }
  }
  init(config) {
    this.ionburst_id = config.ionburst_id;
    this.ionburst_key = config.ionburst_key;
    this.ionburst_uri = config.ionburst_uri;
    if (this.ionburst_uri && !this.ionburst_uri.endsWith('/')) {
      this.ionburst_uri = this.ionburst_uri + '/';
    }
  }
  async GetJWT(request) {
    let req = {};
    if (!request) {
      req.Username = this.ionburst_id;
      req.Password = this.ionburst_key;
    } else {
      req = request;
    }
    try {
      let res = await axios.post(`${this.ionburst_uri}api/signin`, req, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.status === 200) {
        this.idToken = res.data.idToken;
        this.refreshToken = res.data.refreshToken;
      }
      return res;
    } catch (error) {
      return error.response;
    }
  }
  async RefreshJWT() {
    let param = {
      'Username': this.ionburst_id
    };
    if (this.refreshToken) {
      param.refreshToken = this.refreshToken;
    } else {
      param.Password = this.ionburst_key;
    }
    return await this.GetJWT(param);
  }
  async downloadData(id, deferred = false, depth = 0) {
    if (!id) {
      return { status: 400, statusText: "id must be specified to download data" }
    }
    let url = (deferred ? `${this.ionburst_uri}api/data/deferred/start/${id}` : `${this.ionburst_uri}api/data/${id}`);
    try {
      let res = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'Authorization': `Bearer ${this.idToken}`,
          'Content-Type': 'application/octet-stream'
        }
      });
      return res;
    } catch (error) {
      if (error.response.status === 401 && !depth) {
        let response = await this.RefreshJWT();
        if (response.status !== 200) {
          return response;
        }
        return await this.downloadData(id, deferred, 1);
      }
      return error.response;
    }
  }
  async downloadSecrets(id, deferred = false, depth = 0) {
    if (!id) {
      return { status: 400, statusText: "id must be specified to download secrets" }
    }
    let url = (deferred ? `${this.ionburst_uri}api/secrets/deferred/start/${id}` : `${this.ionburst_uri}api/secrets/${id}`);
    try {
      let res = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'Authorization': `Bearer ${this.idToken}`,
          'Content-Type': 'application/octet-stream'
        }
      });
      return res;
    } catch (error) {
      if (error.response.status === 401 && !depth) {
        let response = await this.RefreshJWT();
        if (response.status !== 200) {
          return response;
        }
        return await this.downloadSecrets(id, deferred, 1);
      }
      return error.response;
    }
  }
  async uploadData(request, deferred = false, depth = 0) {
    if (!request) {
      return { status: 400, statusText: "request parameter missing!" }
    }
    let { id, data, classstr } = request;
    if (!id) {
      return { status: 400, statusText: "id must be specified in the request parameter to upload data" }
    }
    if (!data) {
      return { status: 400, statusText: "data must be specified in the request parameter to upload data" }
    }
    let url = (deferred ? `${this.ionburst_uri}api/data/deferred/start/${id}` : `${this.ionburst_uri}api/data/${id}`);
    if (classstr) {
      url = `${url}?classstr=${classstr}`;
    }
    try {
      let res = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.idToken}`,
          'Content-Type': 'application/octet-stream',
          'Content-Length': data.length
        }
      });
      return res;
    } catch (error) {
      if (error.response.status === 401 && !depth) {
        let response = await this.RefreshJWT();
        if (response.status !== 200) {
          return response;
        }
        return await this.uploadData(request, deferred, 1);
      }
      return error.response;
    }
  }
  async uploadSecrets(request, deferred = false, depth = 0) {
    if (!request) {
      return { status: 400, statusText: "request parameter missing!" }
    }
    let { id, data, classstr } = request;
    if (!id) {
      return { status: 400, statusText: "id must be specified in the request parameter to upload secrets" }
    }
    if (!data) {
      return { status: 400, statusText: "data must be specified in the request parameter to upload secrets" }
    }
    let url = (deferred ? `${this.ionburst_uri}api/secrets/deferred/start/${id}` : `${this.ionburst_uri}api/secrets/${id}`);
    if (classstr) {
      url = `${url}?classstr=${classstr}`;
    }
    try {
      let res = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.idToken}`,
          'Content-Type': 'application/octet-stream',
          'Content-Length': data.length
        }
      });
      return res;
    } catch (error) {
      if (error.response.status === 401 && !depth) {
        let response = await this.RefreshJWT();
        if (response.status !== 200) {
          return response;
        }
        return await this.uploadSecrets(request, deferred, 1);
      }
      return error.response;
    }
  }
  async deleteData(id, depth = 0) {
    if (!id) {
      return { status: 400, statusText: "id must be specified to delete data" }
    }
    try {
      let res = await axios.delete(`${this.ionburst_uri}api/data/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.idToken}`,
          'Content-Type': 'application/octet-stream'
        }
      });
      return res;
    } catch (error) {
      if (error.response.status === 401 && !depth) {
        let response = await this.RefreshJWT();
        if (response.status !== 200) {
          return response;
        }
        return await this.deleteData(id, 1);
      }
      return error.response;
    }
  }
  async deleteSecrets(id, depth = 0) {
    if (!id) {
      return { status: 400, statusText: "id must be specified to delete secrets" }
    }
    try {
      let res = await axios.delete(`${this.ionburst_uri}api/secrets/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.idToken}`,
          'Content-Type': 'application/octet-stream'
        }
      });
      return res;
    } catch (error) {
      if (error.response.status === 401 && !depth) {
        let response = await this.RefreshJWT();
        if (response.status !== 200) {
          return response;
        }
        return await this.deleteSecrets(id, 1);
      }
      return error.response;
    }
  }
  async classifications(depth = 0) {
    try {
      let res = await axios.get(`${this.ionburst_uri}api/Classification`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.idToken}`
        }
      });
      return res;
    } catch (error) {
      if (error.response.status === 401 && !depth) {
        let response = await this.RefreshJWT();
        if (response.status !== 200) {
          return response;
        }
        return await this.classifications(1);
      }
      return error.response;
    }
  }
  async checkDeferred(token, depth = 0) {
    if (!token) {
      return { status: 400, statusText: "Deferred Token must be specified to Check Deferred Request" }
    }
    try {
      let res = await axios.get(`${this.ionburst_uri}api/data/deferred/check/${token}`, {
        headers: {
          'Authorization': `Bearer ${this.idToken}`,
          'Content-Type': 'application/json'
        }
      });
      return res;
    } catch (error) {
      console.log(error);
      if (error.response.status === 401 && !depth) {
        let response = await this.RefreshJWT();
        if (response.status !== 200) {
          return response;
        }
        return await this.checkDeferred(token, 1);
      }
      return error.response;
    }
  }
  async checkDeferredSecrets(token, depth = 0) {
    if (!token) {
      return { status: 400, statusText: "Deferred Token must be specified to Check Deferred Request" }
    }
    try {
      let res = await axios.get(`${this.ionburst_uri}api/secrets/deferred/check/${token}`, {
        headers: {
          'Authorization': `Bearer ${this.idToken}`,
          'Content-Type': 'application/json'
        }
      });
      return res;
    } catch (error) {
      console.log(error);
      if (error.response.status === 401 && !depth) {
        let response = await this.RefreshJWT();
        if (response.status !== 200) {
          return response;
        }
        return await this.checkDeferredSecrets(token, 1);
      }
      return error.response;
    }
  }
  async fetch(token, depth = 0) {
    if (!token) {
      return { status: 400, statusText: "Deferred Token must be specified to fetch" }
    }
    try {
      let res = await axios.get(`${this.ionburst_uri}api/data/deferred/fetch/${token}`, {
        responseType: 'arraybuffer',
        headers: {
          'Authorization': `Bearer ${this.idToken}`,
          'Content-Type': 'application/octet-stream'
        }
      });
      return res;
    } catch (error) {
      if (error.response.status === 401 && !depth) {
        let response = await this.RefreshJWT();
        if (response.status !== 200) {
          return response;
        }
        return await this.fetch(token, 1);
      }
      return error.response;
    }
  }
  async fetchSecrets(token, depth = 0) {
    if (!token) {
      return { status: 400, statusText: "Deferred Token must be specified to fetch" }
    }
    try {
      let res = await axios.get(`${this.ionburst_uri}api/secrets/deferred/fetch/${token}`, {
        responseType: 'arraybuffer',
        headers: {
          'Authorization': `Bearer ${this.idToken}`,
          'Content-Type': 'application/octet-stream'
        }
      });
      return res;
    } catch (error) {
      if (error.response.status === 401 && !depth) {
        let response = await this.RefreshJWT();
        if (response.status !== 200) {
          return response;
        }
        return await this.fetchSecrets(token, 1);
      }
      return error.response;
    }
  }
}

module.exports = APIHandler;