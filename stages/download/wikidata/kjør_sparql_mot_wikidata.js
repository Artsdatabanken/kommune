const { io, log, sparql } = require("lastejobb");
const path = require("path");

const queries = io.findFiles("./stages/download/wikidata", ".sparql");
function next() {
  const query = queries.pop();
  log.info(query);
  if (!query) return;
  log.info("Sparql: " + query);
  sparql
    .queryFromFile(query, "sparql_" + path.parse(query).name)
    .then(() => next())
    .catch(err => {
      log.error(err.message);
      process.exit(1);
    });
}
next();
