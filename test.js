const wikidata = require("./wikidata");

const sparqlQuery = `SELECT ?kommune ?image  WHERE {
  ?kommune wdt:P31 wd:Q755707;
    wdt:P18 ?image.
}
ORDER BY ?kommune`;

wikidata.query(sparqlQuery).then(x => console.log(JSON.stringify(x)));
