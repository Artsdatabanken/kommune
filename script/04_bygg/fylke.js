const { io, json } = require("lastejobb");
const { moveKey } = json;

const fylkeNummerTilKode = knr => knr.replace("NO", "AO");

let fylke = io.lesDatafil("fylke.json").items;

const r = [];
fylke.forEach(e => {
  e.kode = fylkeNummerTilKode(e.code);
  moveKey(e, "code", "kodeautor");
  moveKey(e, "itemLabel", "navn.nor");
  e.nabo = e.nabo.map(nabo => fylkeNummerTilKode(nabo));
  moveKey(e, "url", "lenke.offisiell");
  moveKey(e, "article", "lenke.wikipedia");
  moveKey(e, "item", "lenke.wikidata");
  moveKey(e, "url", "lenke.offisiell");
  moveKey(e, "image", "bilde.image");
  moveKey(e, "banners", "bilde.banner");
  moveKey(e, "images", "bilde.foto");
  moveKey(e, "coa", "bilde.coa");
  moveKey(e, "flag", "bilde.flagg");
  r.push(e);
});

io.skrivBuildfil("fylke.json", r);
