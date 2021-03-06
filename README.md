![npm](https://img.shields.io/npm/v/ionburst-sdk-javascript?color=fb6a26&style=flat-square)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/ionburst-sdk-javascript?color=fb6a26&style=flat-square)
![Gitlab pipeline status](https://img.shields.io/gitlab/pipeline/ionburst/ionburst-sdk-javascript/main?color=fb6a26&style=flat-square)
[![slack](https://img.shields.io/badge/Slack-4A154B?style=flat-square&logo=slack&logoColor=white)](https://join.slack.com/t/ionburst-cloud/shared_invite/zt-panjkslf-Z5DOpU1OOeNPkXgklD~Cpg)

# Ionburst SDK for JavaScript 

The **Ionburst SDK for Javascript** enables developers to easily integrate with [Ionburst Cloud][ionburst-cloud], building in ultra-secure and private object storage to their applications.

* [API Docs][docs-api]
* [SDK Docs][sdk-website]
* [Issues][sdk-issues]
* [SDK Samples](https://ionburst.cloud/docs/sdk/nodejs)

## Getting Started

### Installation

```sh
npm i ionburst-sdk-javascript
```

### Configuration

The Ionburst SDK can get its configuration (ionburst_id, ionburst_key, ionburst_uri) from the following three files.

If `ionburst_id` and `ionburst_key` are not specified by environment variable, they are obtained from the credentials file with information from the `config.json` file.

If `ionburst_uri` is not specified in Ionburst constructor, it'll first check `config.json`, and then the credentials file.

#### Environment Variables

```sh
IONBURST_ID=IB******************
IONBURST_KEY=eW91aGF2ZXRvb211Y2h0aW1lb255b3VyaGFuZHMh
```

#### config.json file

```json
{
  "Ionburst": {
    "Profile": "test",
    "IonburstUri": "https://api.example.ionburst.cloud/",
    "TraceCredentialsFile": "OFF"
  }
}
```

#### Credentials file

```sh
[example]
ionburst_id=IB******************
ionburst_key=eW91aGF2ZXRvb211Y2h0aW1lb255b3VyaGFuZHMh
ionburst_uri=https://api.example.ionburst.cloud/
```

### Usage

#### Initialise

```sh
const Ionburst = require('ionburst-sdk')
var ionburst = Ionburst();
```

or

```sh
const Ionburst = require('ionburst-sdk')
var ionburst = Ionburst("https://api.example.ionburst.cloud/");
```

#### Upload Data

With Callback:

```sh
ionburst.put({
  id: '...',
  data: '...',
  classstr: '...' // Not Required
}, function(err, data) {
  ...
});
```

With async/await:

```sh
let data = await ionburst.putAsync({
  id: '...',
  data: '...',
  classstr: '...'  // Not Required
});
```

#### Download Data

With Callback:

```sh
ionburst.get(id, function(err, data) {
  ...
});
```

With async/await:

```sh
let data = await ionburst.getAsync(id);
```

#### Delete Data

With Callback:

```sh
ionburst.delete(id, function(err, data) {
  ...
});
```

With async/await:

```sh
let data = await ionburst.deleteAsync(id);
```

#### Upload Data Deferred

With Callback:

```sh
ionburst.startDeferredAction({
  action: 'PUT',
  id: '...',
  data: '...',
  classstr: '...'  // Not Required
}, function(err, token) {
  ...
});
```

With async/await:

```sh
let token = await ionburst.startDeferredActionAsync({
  action: 'PUT',
  id: '...',
  data: '...',
  classstr: '...'  // Not Required
});
```

#### Download Data Deferred

With Callback:

```sh
ionburst.startDeferredAction({
  action: 'GET',
  id: '...'
}, function(err, token) {
  ...
});
```

With async/await:

```sh
let token = await ionburst.startDeferredActionAsync({
  action: 'GET',
  id: '...'
});
```

#### Check Data Deferred

With Callback:

```sh
ionburst.checkDeferred(token, function(err, token) {
  ...
});

```

With async/await:

```sh
let result = await ionburst.checkDeferredAsync(token);
```

#### Fetch Data Deferred

With Callback:

```sh
ionburst.fetch(token, function(err, result) {
  ...
});
```

With async/await:

```sh
let result = await ionburst.fetchAsync(token);
```

#### Get Classifcations

With Callback:

```sh
ionburst.getClassifications(function(err, data) {
  ...
});
```

With async/await:

```sh
let data = await ionburst.getClassificationsAsync();
```

## Getting Help

Please use the following community resources for support. We use [GitLab issues][sdk-issues] to track bugs and feature requests.

* Join the Ionburst Cloud community on [Slack](https://join.slack.com/t/ionburst-cloud/shared_invite/zt-panjkslf-Z5DOpU1OOeNPkXgklD~Cpg)
* Get in touch with [Ionburst Support](https://ionburst.cloud/contact)
* If you have found a bug, please open an [issue][sdk-issues]

### Opening Issues

If you find a bug, or have an issue with the Ionburst SDK for JavaScript we would like to hear about it. Check the existing [issues][sdk-issues] and try to make sure your problem doesn???t already exist before opening a new issue. It???s helpful if you include the version of Ionburst SDK JavaScript and the OS you???re using. Please include a stack trace and steps to reproduce the issue.

The [GitLab issues][sdk-issues] are intended for bug reports and feature requests. For help and questions with using the Ionburst SDK for JavaScript please make use of the resources listed in the Getting Help section. There are limited resources available for handling issues and by keeping the list of open issues clean we can respond in a timely manner.

## SDK Changelog

The changelog for the SDK can be found in the [CHANGELOG file.](CHANGELOG.md)

## Contributors

A massive thanks to [Costin Botez](https://github.com/costibotez) for developing this SDK.

## Dependencies

* [axios](https://www.npmjs.com/package/axios)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [fs](https://www.npmjs.com/package/fs)
* [ini](https://www.npmjs.com/package/ini)
* [path](https://www.npmjs.com/package/path)

[ionburst]: https://ionburst.io
[ionburst-cloud]: https://ionburst.cloud
[sdk-website]: https://ionburst.cloud/docs/sdk/
[sdk-source]: https://gitlab.com/ionburst/ionburst-sdk-javascript
[sdk-issues]: https://gitlab.com/ionburst/ionburst-sdk-javascript/issues
[sdk-license]: https://gitlab.com/ionburst/ionburst-sdk-javascript/-/blob/main/LICENSE
[docs-api]: https://ionburst.cloud/docs/api/
