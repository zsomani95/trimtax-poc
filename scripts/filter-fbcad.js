const fs = require("fs");
const readline = require("readline");
const path = require("path");

// CONFIG
const OWNER_INPUT = "C:\\Users\\adver\\Downloads\\6-2-2026_PropertyDataExport\\Owner_extracted\\PropertyDataExport4645044.txt";
const PROPERTY_INPUT = "C:\\Users\\adver\\Downloads\\6-2-2026_PropertyDataExport\\Property_extracted\\PropertyDataExport4645043.txt";
const OUTPUT = path.join(__dirname, "fbcad_filtered.csv");
const MAX_VALUE = 1000000; // homes under $1M

async function run() {
  console.log("Loading owner file into memory...");
  
  // Build PropertyID → OwnerName map from owner file
  const ownerMap = new Map();
  const ownerRl = readline.createInterface({
    input: fs.createReadStream(OWNER_INPUT, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  let isOwnerHeader = true;
  let ownerColIndex = {};

  for await (const line of ownerRl) {
    const cols = parseCSV(line);
    
    if (isOwnerHeader) {
      isOwnerHeader = false;
      cols.forEach((name, i) => {
        ownerColIndex[name.trim()] = i;
      });
      continue;
    }

    const propId = (cols[ownerColIndex["PropertyID"]] || "").trim();
    const ownerName = (cols[ownerColIndex["OwnerName"]] || "").trim();
    if (propId) {
      ownerMap.set(propId, ownerName);
    }
  }

  console.log(`Loaded ${ownerMap.size} owner records.\n`);

  // Now stream property file and filter/join
  console.log("Filtering property file...");
  const propRl = readline.createInterface({
    input: fs.createReadStream(PROPERTY_INPUT, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  const out = fs.createWriteStream(OUTPUT, { encoding: "utf8" });

  let isPropHeader = true;
  let propColIndex = {};
  let kept = 0;
  let total = 0;

  for await (const line of propRl) {
    const cols = parseCSV(line);

    if (isPropHeader) {
      isPropHeader = false;
      cols.forEach((name, i) => {
        propColIndex[name.trim()] = i;
      });
      // Write CSV header
      out.write("acct,site_addr,city,zip,owner_name,bld_ar,cur_appr_val,county\n");
      continue;
    }

    total++;

    // Filter: residential only (LegalDesc should start with "S" for single-family, or similar)
    // FBCAD doesn't have state_class like HCAD, so we filter on appraised value > 0 as a proxy
    const apprVal = parseInt(cols[propColIndex["CurrAssessedValue"]] || "0", 10);
    if (isNaN(apprVal) || apprVal <= 0 || apprVal >= MAX_VALUE) continue;

    const propId = (cols[propColIndex["PropertyID"]] || "").trim();
    const ownerName = ownerMap.get(propId) || "";

    // Build address from components
    const streetNum = (cols[propColIndex["SitusStreetNumber"]] || "").trim();
    const streetName = (cols[propColIndex["SitusStreetName"]] || "").trim();
    const streetSuffix = (cols[propColIndex["SitusStreetSuffix"]] || "").trim();
    const siteAddr = `${streetNum} ${streetName} ${streetSuffix}`.trim();
    // Skip if no valid address (filters out utility/commercial properties)
    if (!siteAddr || siteAddr.trim().length < 3) continue;

    const city = (cols[propColIndex["SitusCity"]] || "").trim();
    const zip = (cols[propColIndex["SitusZip"]] || "").trim();
    const bldAr = parseInt(cols[propColIndex["SquareFootage"]] || "0", 10) || null;

    const row = [
      propId,
      siteAddr,
      city,
      zip,
      ownerName,
      bldAr || "",
      apprVal,
      "Fort Bend",
    ];

    // Escape CSV
    const csvRow = row.map((val) => {
      const str = String(val);
      if (str.includes(",") || str.includes('"')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    }).join(",");

    out.write(csvRow + "\n");
    kept++;

    if (kept % 10000 === 0) {
      console.log(`Kept ${kept.toLocaleString()} of ${total.toLocaleString()} properties scanned...`);
    }
  }

  out.end();
  console.log(`\nDONE. Kept ${kept.toLocaleString()} Fort Bend residential homes under $1M.`);
  console.log(`Output: ${OUTPUT}`);
}

// Simple CSV parser (handles quoted fields)
function parseCSV(line) {
  const result = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  result.push(cur);
  return result;
}

run().catch(console.error);