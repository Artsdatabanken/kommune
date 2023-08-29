const { io, log } = require("@artsdatabanken/lastejobb");

// Inkluder områder som var gyldige på gitt dato
const currentDate = new Date()

const lesSparqlOutput = fil => io.lesTempJson(fil).results.bindings;

function konverter(nivå) {
  const r = lesElementer(nivå, "item");
  settNivå(r, nivå);
  flettKoder(r, nivå);
  flettNaboer(r, nivå);
  flettMedBilder(r, nivå);
  const arr = mapTilArray(r);
  arr.sort((a, b) => (a.code > b.code ? 1 : -1));
  const dok = {
    items: arr,
    meta: {
      url: `https://github.com/Artsdatabanken/kommune/blob/master/${nivå}.json`
    }
  };
  io.skrivDatafil(nivå + "_mapped", dok);
}

const today = new Date();

function mapTilArray(r) {
  const values = Object.values(r);
  return values.reduce((acc, e) => {
    if (e.dissolved < today) return acc;
    if (e.inception > today) return acc;
    if (!e.code) return acc;
    acc.push(e);
    return acc;
  }, []);
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
  if (r.osm) r.osm = "https://www.openstreetmap.org/relation/" + r.osm;
  return r;
}

function value(e) {
  if (!e) return null;
  switch (e.datatype) {
    case "http://www.w3.org/2001/XMLSchema#dateTime":
      return new Date(e.value);
    case "http://www.w3.org/2001/XMLSchema#decimal":
      return parseFloat(e.value);
    default:
      return e.value;
  }
}

function flettKoder(r, nivå) {
  if (nivå !== "kommune") return;
  const nummer = lesSparqlOutput(nivå + "nummer");
  nummer.forEach(e => {
    const id = e.kommune.value;
    const item = r[id];
    if (!item) return log.warn("Finner ikke item " + id);
    const fra = value(e.start_time);
    const til = value(e.end_time);
    if (fra && fra > currentDate) return;
    if (til && til < currentDate) return;

    item.code = value(e.code);
  });
}

function flettNaboer(r, nivå) {
  const nabo = lesSparqlOutput(nivå + "nabo");
  nabo.forEach(e => {
    const idFra = e.item.value;
    const idTil = e.shares_border_with.value;
    const startTime = value(e.start_time)
    const endTime = value(e.end_time)
    if (startTime && startTime > currentDate) 
      return;
    if (endTime && endTime < currentDate) 
      return;
    const fra = r[idFra];
    if (!fra)
      return log.warn(`Finner nabo, men finner ikke artikkelen for ${idFra}.`);
    const til = r[idTil];
    if (!til)
      return log.info(`Hopper over grense mellom ${fra?.itemLabel} ${idFra} og ${idTil} fordi den er utenlands.`);
    fra.nabo = [...(fra.nabo || []), til.code].sort();
  });
}

function flettMedBilder(r, nivå) {
  const bilde = lesSparqlOutput(nivå + "bilde");
  bilde.forEach(e => {
    const id = e.item.value;
    const fra = r[id];
    if (!fra) debugger;
    if (!fra) return log.warn("Har bilde for ukjent " + id);
    fra.foto = fra.foto || [];
    fra.banners = fra.banners || [];
    const image = value(e.image);
    if (image) fra.foto.push(image);
    const banner = value(e.banner);
    if (banner) fra.banners.push(banner);
  });
}

function settNivå(r, nivå) {
  Object.values(r).forEach(e => (e.nivå = nivå));
}

module.exports = { konverter };
