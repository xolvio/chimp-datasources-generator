module.exports = (dataSourcePath) => {
  const split = dataSourcePath.split("#");

  if (split.length > 1) {
    return {
      importString: `import { ${split[1]} } from "${split[0]}"`,
      dataSourceName: split[1],
    };
  }
  return {
    importString: `import DataSource from "${split[0]}"`,
    dataSourceName: "DataSource",
  };
};
