const { io, log, json, url } = require("lastejobb");
const { moveKey } = json;

const alt = {};

const kommuneNummerTilKode = nr =>
  "AO-TO-FL-" + nr.substring(0, 2) + "-" + nr.substring(2, 4);
const fylkeIsoTilKode = nr => "AO-TO-FL-" + nr.replace("NO-", "");

bygg("fylke", fylkeIsoTilKode);
bygg("kommune", kommuneNummerTilKode);

function bygg(nivå, autorkodeTilKode) {
  let kommune = io.lesDatafil(nivå + ".json").items;
  let basis = io.lesDatafil(nivå + "_meta.json").items;
  const other = json.arrayToObject(kommune, { uniqueKey: "code" });
  const tre = {};
  basis.forEach(b => {
    let ekstra = other[nivå == "fylke" ? "NO-" + b.autorkode : b.autorkode];
    if (!ekstra) {
      log.warn(`Mangler wikidata data for ${b.autorkode}`);
      ekstra = { nabo: [] };
    }
    const e = Object.assign(b, ekstra);
    const kode = autorkodeTilKode(e.autorkode);
    moveKey(e, "areal", "geografi.areal");
    moveKey(e, "bbox", "geografi.bbox");
    moveKey(e, "code", "kodeautor");
    if (e.itemLabel && e.itemLabel !== e.tittel.nob)
      log.warn(`Avvik i navn for ${e.kode}: ${e.itemLabel}<->${e.tittel.nob}`);
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
    tre[kode] = e;
    alt[kode] = e;
  });

  alt["AO-TO-FL"] = {
    url: "/Administrativ_grense/Territorialområde/Fastlands-Norge"
  };
  new url(alt).assignUrls();

  io.skrivBuildfil(nivå + ".json", tre);
}
