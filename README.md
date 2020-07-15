# Time To Leave API

AWS Lambda API to manipulate MongoDB Atlas for [time-to-leave](https://github.com/AnakinYuen/time-to-leave)

## Project setup

### 1. Install

```
npm install
```

### 2. Create an IAM User and config Serverless

Follow [this article](https://hackernoon.com/a-crash-course-on-serverless-with-node-js-632b37d58b44) to create an IAM User in AWS console and set up Serverless to access your AWS account.

### 3. Creating a database on MongoDB Atlas

[Here’s](https://hackernoon.com/building-a-serverless-rest-api-with-node-js-and-mongodb-2e0ed0638f47) a reference for an article which teach you how to create a database on MongoDB Atlas.

### 4. Save credentials to `secrets.json`

Add MongoDB connection URL and Json Web Token secret to `sample.secrets.json` and rename this to `secrets.json`

## Development

### Compiles and hot-reloads for development

```
npm start
```

### Compiles and deploy to AWS

```
npm run deploy
```
