const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const { http } = require("lastejobb");

// Query-verktøy på https://query.wikidata.org/

const endpointUrl = "https://query.wikidata.org/sparql";

async function query(sparqlQuery, destFile) {
  const fullUrl = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
  debugger;
  return await http.downloadJson2File(fullUrl, destFile);
}

function queryFromFile(sparqlFilePath, destFile) {
  const queryText = fs.readFileSync(sparqlFilePath);
  return query(
    queryText,
    destFile
  ); /*.then(json => {
    fs.writeFileSync(destPath, JSON.stringify(json));
  });*/
}

module.exports = { query, queryFromFile };
