require('dotenv').config()
const fs = require('fs'),
    ini = require('ini'),
    path = require('path'),
    util = require('util');

const readFileASync = util.promisify(fs.readFile);

class Settings {
    constructor(server_uri) {
        this.ionburst_uri = server_uri;
        this.ionburst_id = process.env.IONBURST_ID;
        this.ionburst_key = process.env.IONBURST_KEY;
        this.CredentialsSet = false;
    }
    async init() {
        await this.manage_config_file();
       
        if (!this.ionburst_uri || !this.ionburst_id || !this.ionburst_key) {
            await this.manage_credentials();
        }
        this.CredentialsSet = this.check_configs();
    }
    async init_uri() {
        await this.manage_config_file();
       
        if (!this.ionburst_uri) {
            await this.manage_credentials();
        }
        if (!this.ionburst_uri) {
            throw new Error("ionburst_uri is missing!");
        }
    }
    _getRoot() {
        return path.dirname(require.main.filename || process.mainModule.filename);
    }
    async manage_config_file() {
        let config_file = this._getRoot() + "/config.json";
        let obj = {};
        if (fs.existsSync(config_file)) {
            let _this = this;
            let data;
            try {
                data = await readFileASync(config_file, 'utf8');
            } catch(error) {
                throw error;
            }
            if (data && data.length) {
                obj = JSON.parse(data); //now it an object
            }
            if (!obj.Ionburst) {
                obj.Ionburst = {};
            } else {
                // Get all information from config.json
                if (obj.Ionburst.TraceCredentialsFile && obj.Ionburst.TraceCredentialsFile.toUpperCase() === "ON") {
                    _this.TraceCredentialsFile = true;
                }
                _this.ProfilesLocation = obj.Ionburst.ProfilesLocation;
                _this.Profile = obj.Ionburst.Profile;
                if (!_this.ionburst_uri) {
                    _this.ionburst_uri = obj.Ionburst.IonBurstUri;
                }
            }
            
        }
    }
    async manage_credentials() {
        let home_directory;
        if (!this.Profile) {
            throw new Error("Profile is not defined in config.json");
        }
        if (this.TraceCredentialsFile){
            console.log("Start of credentials file parse");
        }
        if (process.platform === "win32") {
            // Windows Environment
            home_directory = process.env.USERPROFILE;
        } else {
            // Linux/MacOS Environment
            home_directory = process.env.HOME;
        }

        let credentials_file = this.ProfilesLocation;
        if (!credentials_file) {
            credentials_file = home_directory + '/.ionburst/credentials';
        }
        if (this.TraceCredentialsFile){
            console.log("Credentials file path: ", credentials_file);
        }
        let data = '';
        try {
            data = await readFileASync(credentials_file, 'utf8');
        } catch(error) {
            throw error;
        }
        let profileList = data.match(/\[(.*?)\]/g);
        // Invoke the next step here however you like
        if (this.TraceCredentialsFile){
            console.log("Profile List: ", profileList);
        } 
        if (this.TraceCredentialsFile){
            console.log("Current Profile: ", this.Profile);
        }
        if (profileList.includes(`[${this.Profile}]`)) {
            let ini_config = ini.parse(data);
            let config;
            eval(`config = ini_config.${this.Profile};`);
            if (this.TraceCredentialsFile){
                console.log("Config for current profile: ", config);
            }
            if (!this.ionburst_id) {
                this.ionburst_id = config.ionburst_id;
            }
            if (!this.ionburst_key) {
                this.ionburst_key = config.ionburst_key;
            }
            if (!this.ionburst_uri) {
                this.ionburst_uri = config.ionburst_uri;
            }
        } else {
            throw new Error(`Profile(${this.Profile}) does not exist in credentials file`);
        }
    }
    check_configs() {
        if (!this.ionburst_id) {
            throw new Error("ionburst_id is missing!");
            return false;
        }
        if (!this.ionburst_key) {
            throw new Error("ionburst_key is missing!");
            return false;
        }
        if (!this.ionburst_uri) {
            throw new Error("ionburst_uri is missing!");
            return false;
        }
        return true;
    }
}

module.exports = Settings;