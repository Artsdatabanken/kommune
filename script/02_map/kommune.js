const { io, log } = require("lastejobb");

const lesSparqlOutput = fil => io.lesDatafil(fil).results.bindings;

const r = lesKommunerFraWikidata();
flettMedNabokommuner(r);
flettMedBilder(r);
io.skrivBuildfil("kommune", r);

function lesKommunerFraWikidata() {
  const kommune = lesSparqlOutput("kommune");
  const r = {};
  kommune.forEach(e => {
    const k = {
      kommunenr: e.knr.value,
      wikipedia: value(e.article),
      wikidata: e.item.value,
      url: value(e.url),
      bilde: { coa: value(e.coa) }
    };

    r[k.wikidata] = k;
  });
  return r;
}

function flettMedNabokommuner(r) {
  const nabo = lesSparqlOutput("kommunenabo");
  nabo.forEach(e => {
    const id = e.kommune.value;
    const fra = r[id];
    const til = r[value(e.shares_border_with)];
    if (!til) return; // kommunen ligger ikke i Norge

    fra.naboer = [...(fra.naboer || []), til.kommunenr];
  });
}

function flettMedBilder(r) {
  const bilde = lesSparqlOutput("kommunebilde");
  bilde.forEach(e => {
    const id = e.kommune.value;
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
