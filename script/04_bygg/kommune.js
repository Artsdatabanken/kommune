const { io, json } = require("lastejobb");
const { moveKey } = json;

const kommuneNummerTilKode = knr =>
  "AO-" + knr.substring(0, 2) + "-" + knr.substring(2, 4);

let kommune = io.lesDatafil("kommune.json").items;

const r = [];
kommune.forEach(e => {
  e.kode = kommuneNummerTilKode(e.code);
  moveKey(e, "code", "kodeautor");
  moveKey(e, "itemLabel", "navn.nor");
  e.nabo = e.nabo.map(nabo => kommuneNummerTilKode(nabo));
  moveKey(e, "url", "lenke.offisiell");
  moveKey(e, "article", "lenke.wikipedia");
  moveKey(e, "item", "lenke.wikidata");
  moveKey(e, "url", "lenke.offisiell");
  moveKey(e, "image", "bilde.image");
  moveKey(e, "banners", "bilde.banner");
  moveKey(e, "images", "bilde.foto");
  moveKey(e, "coa", "bilde.coa");
  r.push(e);
});

io.skrivBuildfil("kommune.json", r);
