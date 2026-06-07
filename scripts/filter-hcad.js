const fs = require("fs");
const readline = require("readline");
const path = require("path");

// CONFIG — adjust paths if your Downloads location differs
const INPUT = "C:\\Users\\adver\\Downloads\\Real_acct_owner\\real_acct.txt";
const OUTPUT = path.join(__dirname, "hcad_filtered.csv");
const MAX_VALUE = 1000000; // homes under $1M

// Columns we want to keep (must match header names exactly)
const WANTED = [
  "acct",
  "site_addr_1",
  "site_addr_2",
  "site_addr_3",
  "mailto",
  "Neighborhood_Code",
  "bld_ar",
  "tot_appr_val",
  "prior_tot_appr_val",
  "protested",
];

async function run() {
  const rl = readline.createInterface({
    input: fs.createReadStream(INPUT, { encoding: "latin1" }),
    crlfDelay: Infinity,
  });

  const out = fs.createWriteStream(OUTPUT, { encoding: "utf8" });

  let header = null;
  let colIndex = {};
  let kept = 0;
  let total = 0;

  for await (const line of rl) {
    const cols = line.split("\t");

    // First line = header
    if (!header) {
      header = cols;
      header.forEach((name, i) => {
        colIndex[name.trim()] = i;
      });
      // Write our CSV header
      out.write(WANTED.join(",") + "\n");
      continue;
    }

    total++;

    // Filter 1: residential only (state_class starts with "A")
    const stateClass = (cols[colIndex["state_class"]] || "").trim();
    if (!stateClass.startsWith("A")) continue;

    // Filter 2: appraised value under $1M
    const apprVal = parseInt(cols[colIndex["tot_appr_val"]] || "0", 10);
    if (isNaN(apprVal) || apprVal <= 0 || apprVal >= MAX_VALUE) continue;

    // Build the output row
    const row = WANTED.map((name) => {
      let val = (cols[colIndex[name]] || "").trim();
      // Escape commas/quotes for CSV
      if (val.includes(",") || val.includes('"')) {
        val = '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    });

    out.write(row.join(",") + "\n");
    kept++;

    if (kept % 50000 === 0) {
      console.log(`Kept ${kept.toLocaleString()} of ${total.toLocaleString()} scanned...`);
    }
  }

  out.end();
  console.log(`\nDONE. Kept ${kept.toLocaleString()} residential homes under $1M out of ${total.toLocaleString()} total properties.`);
  console.log(`Output: ${OUTPUT}`);
}

run().catch(console.error);