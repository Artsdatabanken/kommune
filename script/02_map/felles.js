const { io, log } = require("lastejobb");

const lesSparqlOutput = fil => io.lesDatafil(fil).items.results.bindings;

function konverter(nivå) {
  const r = lesElementer(nivå, "item");
  flettNaboer(r, nivå);
  flettMedBilder(r, nivå);
  const medNummerSomNøkkel = mapTilNummerSomNøkkel(r);
  io.skrivBuildfil(nivå, medNummerSomNøkkel);
}

function mapTilNummerSomNøkkel(r) {
  const values = Object.values(r);
  return values.reduce((acc, e) => {
    if (e.dissolved < new Date()) return acc;
    if (e.inception > new Date()) return acc;
    acc[e.code] = e;
    delete e.code;
    return acc;
  }, {});
}

function lesElementer(filnavn, nøkkelfelt) {
  const elementer = lesSparqlOutput(filnavn);
  const r = {};
  elementer.forEach(e => {
    const k = map(e);
    const nøkkel = k[nøkkelfelt];
    r[nøkkel] = k;
  });
  return r;
}

function map(e) {
  const r = {};
  Object.entries(e).forEach(([key, v]) => {
    r[key] = value(v);
  });
  return r;
}

function value(e) {
  if (!e) return null;
  if (e.datatype === "http://www.w3.org/2001/XMLSchema#dateTime")
    return new Date(e.value);
  return e.value;
}

function flettNaboer(r, nivå) {
  const nabo = lesSparqlOutput(nivå + "nabo");
  nabo.forEach(e => {
    const id = e.item.value;
    const fra = r[id];
    const til = r[value(e.shares_border_with)];
    if (!til) return; // ligger ikke i Norge

    fra.naboer = [...(fra.naboer || []), til.code];
  });
}

function flettMedBilder(r, nivå) {
  const bilde = lesSparqlOutput(nivå + "bilde");
  bilde.forEach(e => {
    const id = e.item.value;
    const fra = r[id];
    fra.bilde = fra.bilde || { image: [], banner: [] };
    const bilder = fra.bilde;
    const image = value(e.image);
    if (image) bilder.image.push(image);
    const banner = value(e.banner);
    if (banner) bilder.banner.push(banner);
  });
}

module.exports = { konverter };
