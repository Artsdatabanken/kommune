const { io, log, json } = require("lastejobb");
const { moveKey } = json;

const kommuneNummerTilKode = nr =>
  "AO-FY-" + nr.substring(0, 2) + "-" + nr.substring(2, 4);
const fylkeIsoTilKode = nr => "AO-FY-" + nr.replace("NO-", "");

bygg("fylke", fylkeIsoTilKode);
bygg("kommune", kommuneNummerTilKode);

function bygg(nivå, autorkodeTilKode) {
  let kommune = io.lesDatafil(nivå + ".json").items;
  let basis = io.lesDatafil(nivå + "_meta.json").items;
  const other = json.arrayToObject(kommune, { uniqueKey: "code" });
  const r = [];
  basis.forEach(b => {
    let ekstra = other[nivå == "fylke" ? "NO-" + b.autorkode : b.autorkode];
    if (!ekstra) {
      log.warn(`Mangler wikidata data for ${b.autorkode}`);
      ekstra = { nabo: [] };
    }
    const e = Object.assign(b, ekstra);
    e.kode = autorkodeTilKode(e.autorkode);
    moveKey(e, "areal", "geografi.areal");
    moveKey(e, "bbox", "geografi.bbox");
    moveKey(e, "code", "kodeautor");
    if (e.itemLabel && e.itemLabel !== e.navn.nob)
      log.warn(`Avvik i navn for ${e.kode}: ${e.itemLabel}<->${e.navn.nob}`);
    delete e.itemLabel;
    e.nabo = e.nabo.map(nabo => autorkodeTilKode(nabo));
    moveKey(e, "nabo", "geografi.nabo");
    moveKey(e, "url", "lenke.offisiell");
    moveKey(e, "article", "lenke.wikipedia");
    moveKey(e, "item", "lenke.wikidata");
    moveKey(e, "url", "lenke.offisiell");
    moveKey(e, "foto", "mediakilde.foto");
    moveKey(e, "banners", "mediakilde.banner");
    moveKey(e, "coa", "mediakilde.logo");
    moveKey(e, "flag", "mediakilde.flagg");
    r.push(e);
  });

  io.skrivBuildfil(nivå + ".json", r);
}
