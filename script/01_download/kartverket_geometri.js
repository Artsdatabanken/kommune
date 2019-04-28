const { http, io, log } = require("lastejobb");

// Laster ned geometri for kommuner i geojson format
http
  .downloadBinary(
    "https://nedlasting.geonorge.no/geonorge/Basisdata/Kommuner/GeoJSON/Basisdata_0000_Norge_25833_Kommuner_GEOJSON.zip",
    "kartverket_geometri.zip"
  )
  .catch(err => {
    log.fatal(err);
  });
