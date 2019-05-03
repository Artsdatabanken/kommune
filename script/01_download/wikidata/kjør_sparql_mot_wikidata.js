const wikidata = require("../../../wikidata");
const { io, log } = require("lastejobb");
const path = require("path");

const queries = io.findFiles("./script/01_download/wikidata", ".sparql");
function next() {
  const query = queries.pop();
  if (!query) return;
  log.info("Sparql: " + query);
  wikidata
    .queryFromFile(query, "sparql_" + path.parse(query).name)
    .then(r => next())
    .catch(err => {
      log.error(err.message);
      process.exit(1);
    });
}
next();
