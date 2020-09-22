## Chimp DataSources Generator

## What

A helper that autogenerates DataSource compatible APIs per controller in a given microservice, based on OpenAPI/Swagger specification.

## Why

It's error-prone, slow and boring to create all those connectors manually. Most people either skip typing them, or type them manually (which is again error-prone, slow and boring). Having them generated makes the Developer Experience much nicer and the whole system significantly more maintainable.

## Usage
```
Usage: chimp-datasources-generator [options] 
[command]

Commands:
  create <directory> <api-location> [custom-data-source-import]  Create the datasources for api, pass either a URL or a yaml/json file. 
   Use http/https when pointing to a URL and relative location when pointing to a file 
     Examples: 
       chimp-datasources-generator create ./generated/external-apis https://domain.com/v3/api-docs.yaml
       chimp-datasources-generator create ./generated/external-apis ./api-docs.yaml
   You can also specify your own custom data source import:
  chimp-datasources-generator create ./generated/external-apis ./api-docs.yaml "@app/apis/DataSource#DataSource"   "@app/apis/DataSource#DataSource" will use an import of:
       import { DataSource } from "@app/apis/DataSource"
     For a default import just use the path:
       "@app/apis/BaseDataSource"

```

In your code create dataSources.ts file like this one:

```typescript
import { Controllers } from "@generated/external-apis";

export const dataSources = () => ({
  todoListsApi: new Controllers("http://localhost:8090/"),
});

export type DataSources = ReturnType<typeof dataSources>;

```

Add the dataSources to your ApolloServer configuration
```typescript
new ApolloServer({
    schema,
    dataSources,
  });
```

Make sure to add the DataSources to the GqlContext type in ./src/context.ts

```typescript
import { DataSources } from "@app/dataSources";

export type GqlContext = { dataSources: DataSources };
```

## How

We are using the swagger-codegen-cli with custom templates and a bit of extra scripting. 
