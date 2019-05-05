const { http, io, log } = require("lastejobb");

// Laster ned geometri for kommuner i geojson format
http
  .downloadJson(
    "https://github.com/Artsdatabanken/kommune-kart/blob/master/kommune_meta.json",
    "kommune_meta.json"
  )
  .catch(err => {
    log.fatal(err);
  });
