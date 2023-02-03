const { io, http, log } = require("@artsdatabanken/lastejobb");

// Leser kommuners navn fra SSB
// Ikke i bruk

var dato = new Date();
const from = dato.toISOString().substring(0, 10); // 2018-01-30
dato.setDate(dato.getDate() + 1);
const to = dato.toISOString().substring(0, 10); // 2018-01-31

const url = `http://data.ssb.no/api/klass/v1/classifications/131/codes.json?from=${from}&to=${to}`;
http.downloadJson(url, "inn_ssb.json");
