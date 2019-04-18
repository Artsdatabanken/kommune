const { io, log } = require("lastejobb");

const lesSparqlOutput = fil => io.lesDatafil(fil).results.bindings;

const r = lesFylkerFraWikidata();
flettMedNabofylker(r);
flettMedBilder(r);
io.skrivBuildfil("fylke", r);

function lesFylkerFraWikidata() {
  const fylke = lesSparqlOutput("fylke");
  const r = {};
  fylke.forEach(e => {
    const k = {
      label: value(e.itemLabel),
      inception: value(e.inception),
      dissolved: value(e.dissolved),
      fylkenr: value(e.code),
      wikipedia: value(e.article),
      wikidata: e.item.value,
      url: value(e.url),
      bilde: { coa: value(e.coa) }
    };
    if (k.dissolved) debugger;
    r[k.wikidata] = k;
  });
  return r;
}

function flettMedNabofylker(r) {
  const nabo = lesSparqlOutput("fylkenabo");
  nabo.forEach(e => {
    const id = e.fylke.value;
    const fra = r[id];
    const til = r[value(e.shares_border_with)];
    if (!til) return; // fylken ligger ikke i Norge

    fra.naboer = [...(fra.naboer || []), til.fylkenr];
  });
}

function flettMedBilder(r) {
  const bilde = lesSparqlOutput("fylkebilde");
  bilde.forEach(e => {
    const id = e.fylke.value;
    const fra = r[id];
    const bilder = fra.bilde;
    bilder.image = [...(bilder.image || []), value(e.image)];
    bilder.banner = [...(bilder.banner || []), value(e.banner)];
  });
}

function value(e) {
  if (!e) return null;
  return e.value;
}
