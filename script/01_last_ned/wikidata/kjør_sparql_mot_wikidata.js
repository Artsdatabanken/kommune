const wikidata = require("../../../wikidata");
const log = require("log-less-fancy")();
const { io } = require("lastejobb");
const path = require("path");

const queries = io.findFiles("./script/01_last_ned/wikidata", ".sparql");
function next() {
  const query = queries.pop();
  if (!query) return;
  log.info("Sparql: " + query);
  wikidata
    .queryFromFile(query, path.basename(query))
    .then(r => next())
    .catch(err => {
      log.error(err.message);
      process.exit(1);
    });
}
next();
