const { io, log } = require("lastejobb");

const lesSparqlOutput = fil => io.lesDatafil(fil).results.bindings;

const r = lesElementer();
flettNaboer(r);
flettMedBilder(r);
const medNummerSomNøkkel = mapTilNummerSomNøkkel(r);
io.skrivBuildfil("kommune", medNummerSomNøkkel);

function mapTilNummerSomNøkkel(r) {
  return Object.keys(r).reduce((acc, key) => {
    const e = r[key];
    if (e.dissolved < new Date()) return acc;
    if (e.inception > new Date()) return acc;
    acc[e.code] = e;
    delete e.code;
    return acc;
  }, {});
}

function lesElementer() {
  const elementer = lesSparqlOutput("kommune");
  const r = {};
  elementer.forEach(e => {
    const k = {
      wikidata: e.item.value,
      bilde: { image: [], banner: [] }
    };
    add(k, "label", e.itemLabel);
    add(k, "inception", e.inception);
    add(k, "dissolved", e.dissolved);
    add(k, "code", e.code);
    add(k, "wikipedia", e.article);
    add(k, "elevation", e.elevation);
    add(k, "url", e.url);
    add(k.bilde, "coa", e.coa);

    r[k.wikidata] = k;
  });
  return r;
}

function add(o, key, field) {
  if (!field) return;
  let value = field.value;
  if (field.datatype === "http://www.w3.org/2001/XMLSchema#dateTime")
    value = new Date(value);
  if (value) o[key] = value;
}

function flettNaboer(r) {
  const nabo = lesSparqlOutput("kommunenabo");
  nabo.forEach(e => {
    const id = e.kommune.value;
    const fra = r[id];
    const til = r[value(e.shares_border_with)];
    if (!til) return; // kommunen ligger ikke i Norge

    fra.naboer = [...(fra.naboer || []), til.code];
  });
}

function flettMedBilder(r) {
  const bilde = lesSparqlOutput("kommunebilde");
  bilde.forEach(e => {
    const id = e.kommune.value;
    const fra = r[id];
    const bilder = fra.bilde;
    const image = value(e.image);
    if (image) bilder.image.push(image);
    const banner = value(e.banner);
    if (banner) bilder.banner.push(banner);
  });
}

function value(e) {
  if (!e) return null;
  return e.value;
}
