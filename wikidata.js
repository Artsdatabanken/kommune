const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// Query-verktøy på https://query.wikidata.org/

const endpointUrl = "https://query.wikidata.org/sparql";

function query(sparqlQuery) {
  const fullUrl = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);
  const headers = { Accept: "application/sparql-results+json" };

  return fetch(fullUrl, { headers }).then(body => body.json());
}

function queryFromFile(sparqlFilePath) {
  const queryText = fs.readFileSync(sparqlFilePath);
  const destPath = sparqlFilePath
    .replace("./query", "./build")
    .replace("sparql", "json");
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  query(queryText).then(json => {
    fs.writeFileSync(destPath, JSON.stringify(json));
  });
}

module.exports = { query, queryFromFile };
