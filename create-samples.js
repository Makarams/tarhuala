#!/usr/bin/env node

// Generate sample .docx chapter files for testing.
// Run: node create-samples.js

const fs = require("fs");
const path = require("path");

// Minimal valid .docx using adm-zip
function makeDocx(paragraphs) {
  const AdmZip = require("adm-zip");
  const zip = new AdmZip();
  const ct = '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
  const rels = '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
  const wrels = '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>';
  const body = paragraphs.map(p => '<w:p><w:r><w:t xml:space="preserve">' + p.replace(/&/g,"&amp;").replace(/</g,"&lt;") + '</w:t></w:r></w:p>').join("");
  const doc = '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + body + '</w:body></w:document>';
  zip.addFile("[Content_Types].xml", Buffer.from(ct));
  zip.addFile("_rels/.rels", Buffer.from(rels));
  zip.addFile("word/_rels/document.xml.rels", Buffer.from(wrels));
  zip.addFile("word/document.xml", Buffer.from(doc));
  return zip.toBuffer();
}

const text = [
  "The sky was a bruised canvas of violet and ash, stretching endlessly over the ruins of what had once been a thriving city.",
  "He pressed forward through the rubble, every step a calculated risk. The ground beneath was treacherous — cracked asphalt giving way to sinkholes that could swallow a man whole.",
  "The mutation had taken root three days ago. He could feel it in his bones, a low hum like electricity running through his marrow.",
  '"You shouldn\'t be out here alone," a voice called from the shadows. He spun, hand reaching for the blade at his hip.',
  "The woman who emerged was covered in dust and dried blood. Her eyes, however, were sharp — calculating. A survivor, like him. Maybe worse.",
  '"Nobody should be anywhere," he replied flatly. "And yet, here we are."',
  "She studied him for a long moment, then nodded toward the collapsed overpass to the east.",
  '"There\'s a settlement beyond the ridge. Thirty, maybe forty people. They have water."',
  "Water. The word hit him like a physical blow. He hadn't had clean water in two days.",
  "But settlements meant rules. Rules meant hierarchy. And hierarchy, in this new world, meant someone at the top willing to crush anyone below.",
  "He'd been crushed enough. This time, he would be the one doing the crushing.",
  "The ground trembled. Somewhere in the distance, another building surrendered to gravity. The sound rolled across the wasteland like thunder from a dead god.",
];

const novels = {
  "Mutation of the Apocalypse": [
    "The_Last_Dawn", "Aberrant_Awakening", "Flesh_and_Ruin",
    "The_Hollow_March", "Crimson_Spores"
  ],
  "Monarch of Depravity": [
    "The_Gutter_King", "A_Crown_of_Filth", "The_First_Betrayal",
    "Whispers_of_Ascent", "The_Art_of_Cruelty"
  ]
};

async function main() {
  try { require("adm-zip"); } catch {
    console.log("Installing adm-zip...");
    require("child_process").execSync("npm install adm-zip --save-dev", { stdio: "inherit" });
  }

  for (const [folder, chapters] of Object.entries(novels)) {
    const dir = path.join(__dirname, "novels", folder);
    fs.mkdirSync(dir, { recursive: true });
    for (let i = 0; i < chapters.length; i++) {
      const fn = "Chapter_" + (i + 1) + "_" + chapters[i] + ".docx";
      const fp = path.join(dir, fn);
      if (fs.existsSync(fp)) { console.log("  skip:", fn); continue; }
      fs.writeFileSync(fp, makeDocx(text));
      console.log("  created:", fn);
    }
  }
  console.log("\nDone! Now run: npm start");
}

main().catch(console.error);
