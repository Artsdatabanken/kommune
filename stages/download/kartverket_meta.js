const { http, log } = require("@artsdatabanken/lastejobb");

download("fylke");
download("kommune");

function download(nivå) {
  // Metadata fra kartet
  http
    .downloadJson(
      `https://raw.githubusercontent.com/Artsdatabanken/kommune-kart/master/${nivå}_meta.json`,
      `${nivå}_meta.json`
    )
    .catch(err => {
      log.fatal(err);
    });
}
