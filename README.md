# CrispMetrics &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lifechurch/CrispMetrics/blob/master/LICENSE)[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://google.com)

## Description

This project will allow you to pull statistics out of Crisp, and synch it into a database for calculation and display on a dashboard. We are planning to use it to monitor our KPIs in the helpdesk teams.

## Documentation

### Authentication

First thing you need to do is to authenticate the app, you should only need to do this once.

```
curl -H "Content-Type: application/json" -X POST -d '{"email":"YOUR_ACCOUNT_EMAIL","password":"YOUR_ACCOUNT_PASSWORD"}' https://api.crisp.chat/v1/user/session/login
```

Copy the user_id, identifier and key values and put them in an auth object in a file named __config.json__ in your root directory. This file is in the ___.gitignore___ so it keeps it out of source control.

```
{
  "auth": {
    "user_id": "xxxx",
    "identifier": "yyyy",
    "key": "zzzz"
  }
}
```

### Development

Running this in dev mode will watch the files in the src directory and rerun them on change.

```
npm run dev
```

#### Postgres Docker

An easy way to give this a DB for development is to use the provided docker-compose file like this:

```
docker-compose up
```

You can them use the web UI on http://localhost:8080

## Contributing

The main purpose of this repository is to continue to grow CrispMetrics, making it faster and easier to use and more robust. Development of CrispMetrics happens in the open on GitHub, and we look forward to working with many talented developers on this project. Read below to learn how you can take part in improving CrispMetrics.

### Contributing Guide

Read our [contribution guide](./CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to CrispMetrics.

### License

CrispMetrics is [MIT licensed](./LICENSE).

## Open Digerati

This project is part of the Open Digerati initiative at [Life.Church](https://life.church). It's our belief that we can move faster together and that starts with irrational generosity so we are opening up our code to the community. 

To find more projects like this one, or join the initiative, checkout our website at [opendigerati.com](https://www.opendigerati.com/).

