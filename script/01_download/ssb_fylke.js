const { io, http, log } = require("lastejobb");

// Ikke i bruk
async function importFylker() {
  let fylker = await http.downloadJson(
    "https://data.ssb.no/api/klass/v1/versions/916.json?language=nb",
    "ssb_fylke_rå.json"
  );
  return fylker;
}

importFylker()
  .then(r => {
    io.skrivDatafil(__filename, r);
  })
  .catch(err => {
    log.fatal(err);
    process.exit(1);
  });
