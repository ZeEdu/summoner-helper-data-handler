const path = require("path");
const fs = require("fs");

let directoryPath = path.join(__dirname, "input");

function main() {
  initializeSequence("championFull.json");
  initializeSequence("item.json");
  initializeSequence("summoner.json");
  initializeSequence("runesReforged.json");
}

function initializeSequence(filename) {
  extractData(filename);
}

function extractData(filename) {
  console.log(`Extracting data from ${filename}`);
  const rawDataFilepath = path.join(directoryPath, filename);
  fs.readFile(rawDataFilepath, (err, fileData) => {
    if (err) console.error(`Something went wrong: ${err}`);
    processSwitch(filename, JSON.parse(fileData));
  });
}

function processSwitch(filename, data) {
  console.log(`Restructuring the content of ${filename}`);
  switch (filename) {
    case "championFull.json":
      processChampionFull(filename, data);
      break;
    case "item.json":
      processItem(filename, data);
      break;
    case "summoner.json":
      processSummoner(filename, data);
      break;
    case "runesReforged.json":
      processRunes(data);
      break;
    default:
      console.error(`Sorry, no instructions for ${filename}`);
  }
}

function processRunes(content) {
  const styles = content.map((style) => {
    const { id, key, icon, name } = style;
    return {
      id: id,
      key: key,
      icon: icon,
      name: name,
    };
  });
  let runes = [];
  content.forEach((style) => {
    const { id, slots } = style;
    slots.forEach((slot, slotId) => {
      const runeRow = Object.values(slot);
      runeRow.forEach((row) => {
        const r = row.map((rune) => {
          const slot = slotId;
          const styleId = id;
          return {
            id: rune.id,
            key: rune.key,
            icon: rune.icon,
            name: rune.name,
            shortDesc: rune.shortDesc,
            longDesc: rune.longDesc,
            slot: slot,
            styleId: styleId,
          };
        });
        runes = [...runes, ...r];
      });
    });
  });
  writeData("styles.json", styles);
  writeData("runes.json", runes);
}

function processSummoner(filename, content) {
  const values = Object.values(content.data);
  writeData(filename, values);
}

function processChampionFull(filename, content) {
  const values = Object.values(content.data);
  writeData(filename, values);
}

function processItem(filename, content) {
  const { data } = content;
  const keys = Object.keys(content.data);
  for (let i = 0; i < keys.length; i++) {
    data[keys[i]].key = keys[i];
  }
  writeData(filename, Object.values(data));
}

function writeData(filename, data) {
  console.log("Writing to disk.");
  const outputFilename = path.join(__dirname, `output/${filename}`);
  try {
    if (fs.existsSync(outputFilename)) {
      fs.unlinkSync(outputFilename);
    }
    fs.writeFileSync(outputFilename, JSON.stringify(data));
    console.log("New file can be found in the output folder as", filename);
  } catch (err) {
    console.error(err);
  }
}

main();
