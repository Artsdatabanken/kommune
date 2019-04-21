const path = require("path");
const { io, http, log } = require("lastejobb");

// Leser fylkers navn fra SSB
function mapFylker(kilde) {
  let r = {};
  kilde.classificationItems.forEach(ci => {
    const origName = ci.name;
    if (ci.code !== "99") {
      r[ci.code] = {
        tittel: { nb: ci.name }
      };
    }
  });
  return r;
}

async function importFylker() {
  let fylker = await http.downloadJson2File(
    "https://data.ssb.no/api/klass/v1/versions/916.json?language=nb",
    "ssb_fylke_rå.json"
  );
  return mapFylker(fylker);
}

importFylker()
  .then(r => {
    io.skrivDatafil(__filename, r);
  })
  .catch(err => {
    log.fatal(err);
    process.exit(1);
  });
