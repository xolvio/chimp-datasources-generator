#!/usr/bin/env node

const shelljs = require("shelljs");
const program = require("commander");
const path = require("path");
const extractor = require("./helpers/customDataSourceExtractor");

// import { BaseDataSource } from "@app/apis/BaseDataSource";
program
  .command("create <directory> <api-location> [custom-data-source-import]")
  .description(
    "Create the datasources for api, pass either a URL or a yaml/json file. \n" +
      " Use http/https when pointing to a URL and relative location when pointing to a file \n" +
      "   Examples: \n" +
      "     chimp-datasources-generator create ./generated/external-apis https://domain.com/v3/api-docs.yaml\n" +
      "     chimp-datasources-generator create ./generated/external-apis ./api-docs.yaml\n" +
      " You can also specify your own custom data source import:\n" +
      'chimp-datasources-generator create ./generated/external-apis ./api-docs.yaml "@app/apis/DataSource#DataSource"' +
      '   "@app/apis/DataSource#DataSource" will use an import of:\n' +
      '     import { DataSource } from "@app/apis/DataSource"\n' +
      "   For a default import just use the path:\n" +
      '     "@app/apis/BaseDataSource"' +
      ""
  )
  .action(function (directory, location, dataSourceImport) {
    const API_DIR = directory;
    const API_URL = location;

    const resolvedPath = path.join(process.cwd(), API_DIR);

    const resolvedAPI = API_URL.match(/http(s)?:/)
      ? API_URL
      : path.join(process.cwd(), API_URL);

    const pathToSwagger = path.join(__dirname, "./swagger-codegen-cli.jar");
    const pathToTemplate = path.join(__dirname, "./typescript-fetch");
    // // shelljs.rm("-rf", API_DIR);
    shelljs.mkdir("-p", resolvedPath);
    shelljs.exec(
      `java -jar ${pathToSwagger} generate -l typescript-fetch --template-dir ${pathToTemplate} -i ${resolvedAPI} -o ${resolvedPath}`
    );

    shelljs.sed("-i", /this.DELETE/, "this.delete", `${resolvedPath}/api.ts`);
    shelljs.sed("-i", /this.GET/, "this.get", `${resolvedPath}/api.ts`);
    shelljs.sed("-i", /this.POST/, "this.post", `${resolvedPath}/api.ts`);
    shelljs.sed("-i", /this.UPDATE/, "this.update", `${resolvedPath}/api.ts`);
    shelljs.sed("-i", /this.PUT/, "this.put", `${resolvedPath}/api.ts`);

    if (dataSourceImport) {
      const { dataSourceName, importString } = extractor(dataSourceImport);

      shelljs.sed(
        "-i",
        /\/\/ {\$CustomDataSourcePlaceholder}/,
        importString,
        `${resolvedPath}/api.ts`
      );
      shelljs.sed(
        "-i",
        /extends RESTDataSource/,
        `extends ${dataSourceName}`,
        `${resolvedPath}/api.ts`
      );
    }
  });

program.parse(process.argv);

// rm -rf __generated_api__ && mkdir __generated_api__ && java -jar ../swagger-codegen-cli.jar generate -l typescript-fetch -i http://localhost:8091/v3/api-docs.yaml -o __generated_api__
