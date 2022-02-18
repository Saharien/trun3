# trun3

Dashboard for monitoring the T.Run competition.

## Project setup & install

This installs all dependencies for the Vue App and Azure Functions

```
npm install
```

## Development

To start the local development the following three scripts are to be executed in different shells. The first script starts the backend (Azure Functions), the second script starts azurite and the third script starts the Vue app.

```
npm run start:api
```

```
npm run start:azurite
```

```
npm run start:app
```

The Vue app can then be accessed via http://localhost:8080.

To start the API on the local development environment, the file `local.settings.json` must be created in the `api` folder with the following content. The connection string to MongoDB must be entered as `<Mongo-Connection-String>`. In most cases this is the following: `mongodb://localhost:27017/trun`

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "CosmosDbConnectionString": "<Mongo-Connection-String>"
  }
}
```

## Deployment

Deployment to the Azure environment can be done via GitHub workflow. To do this, create the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret in the repository. The token can be retrieved from the Azure portal. Afterwards, the Azure Static Web Apps CI/CD workflow can be started manually, which deploys the current version to Azure.
