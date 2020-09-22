const extractor = require("./customDataSourceExtractor");

test("named import", () => {
  const dataSourcePath = "@app/apis/DataSource#CustomDataSource";
  expect(extractor(dataSourcePath)).toEqual({
    importString: 'import { CustomDataSource } from "@app/apis/DataSource"',
    dataSourceName: "CustomDataSource",
  });
});

test("default import", () => {
  const dataSourcePath = "@app/MyDataSource";
  expect(extractor(dataSourcePath)).toEqual({
    importString: 'import DataSource from "@app/MyDataSource"',
    dataSourceName: "DataSource",
  });
});
