const fs = require("fs");
const { http } = require("lastejobb");

// Query-verktøy på https://query.wikidata.org/

const endpointUrl = "https://query.wikidata.org/sparql";

async function query(sparqlQuery, destFile) {
  const fullUrl = endpointUrl + "?query=" + sparqlQuery;
  return await http.downloadJson(fullUrl, destFile);
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
