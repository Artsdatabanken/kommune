const { io, log, json, url } = require("@artsdatabanken/lastejobb");
const { moveKey } = json;

const alt = {};

const kommuneNummerTilKode = nr =>
  "AO-TO-FL-" + nr.substring(0, 2) + "-" + nr.substring(2, 4);
const fylkeIsoTilKode = nr => "AO-TO-FL-" + nr.replace("NO-", "");

bygg("fylke", fylkeIsoTilKode);
bygg("kommune", kommuneNummerTilKode);

function bygg(nivå, autorkodeTilKode) {
  let kommune = io.lesTempJson(nivå + "_mapped.json");
  let basis = io.lesTempJson(nivå + "_meta.json").items;
  const other = json.arrayToObject(kommune, { uniqueKey: "code" });
  const tre = {};
  basis.forEach(b => {
    let ekstra = other[nivå == "fylke" ? "NO-" + b.autorkode : b.autorkode];
    if (!ekstra) {
      log.warn(`Mangler wikidata data for ${b.autorkode}`);
      ekstra = {};
    }
    ekstra.nabo = ekstra.nabo || [];
    const e = Object.assign(b, ekstra);
    if (!e.autorkode) debugger;
    const kode = autorkodeTilKode(e.autorkode);
    moveKey(e, "areal", "geografi.areal");
    moveKey(e, "bbox", "geografi.bbox");
    moveKey(e, "code", "kodeautor");
    if (e.itemLabel && e.itemLabel !== e.tittel.nob)
      log.warn(`Avvik i navn for ${e.kode}: ${e.itemLabel}<->${e.tittel.nob}`);
    delete e.itemLabel;
    if (!e.nabo) debugger;
    e.nabo = e.nabo.filter(Boolean).map(nabo => autorkodeTilKode(nabo));
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
