const fs = require("fs");
const readline = require("readline");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

// Load DATABASE_URL from .env.local
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
let dbUrl = null;
for (const line of envContent.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (trimmed.startsWith("DATABASE_URL")) {
    dbUrl = trimmed.substring(trimmed.indexOf("=") + 1).trim();
    // strip surrounding quotes if present
    dbUrl = dbUrl.replace(/^["']|["']$/g, "");
    break;
  }
}
if (!dbUrl) {
  console.error("Could not find DATABASE_URL in .env.local");
  process.exit(1);
}
console.log("Connecting with user:", dbUrl.split("//")[1].split(":")[0]);
const sql = neon(dbUrl);

const CSV = path.join(__dirname, "hcad_filtered.csv");
const COUNTY = "Harris";
const BATCH_SIZE = 500;

async function run() {
  const rl = readline.createInterface({
    input: fs.createReadStream(CSV, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  let isHeader = true;
  let batch = [];
  let inserted = 0;

  async function flush() {
    if (batch.length === 0) return;
    // Build a multi-row insert
    const values = [];
    const params = [];
    let p = 1;
    for (const row of batch) {
      values.push(`($${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++})`);
      params.push(...row);
    }
    const query = `
      INSERT INTO properties (acct, site_addr_1, city, zip, owner_name, neighborhood_code, bld_ar, cur_appr_val, prior_appr_val, protested, county)
      VALUES ${values.join(",")}
      ON CONFLICT (acct) DO NOTHING
    `;
    await sql.query(query, params);
    inserted += batch.length;
    batch = [];
    if (inserted % 10000 === 0) {
      console.log(`Inserted ${inserted.toLocaleString()} rows...`);
    }
  }

  // Simple CSV parser (handles quoted fields)
  function parseCSV(line) {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') inQuotes = false;
        else cur += ch;
      } else {
        if (ch === '"') inQuotes = true;
        else if (ch === ",") { result.push(cur); cur = ""; }
        else cur += ch;
      }
    }
    result.push(cur);
    return result;
  }

  for await (const line of rl) {
    if (isHeader) { isHeader = false; continue; }
    if (!line.trim()) continue;

    const c = parseCSV(line);
    // CSV order: acct, site_addr_1, site_addr_2(city), site_addr_3(zip), mailto, Neighborhood_Code, bld_ar, tot_appr_val, prior_tot_appr_val, protested
    const bldAr = parseInt(c[6], 10) || null;
    const curVal = parseInt(c[7], 10) || null;
    const priorVal = parseInt(c[8], 10) || null;

    batch.push([
      c[0],           // acct
      c[1],           // site_addr_1
      c[2],           // city
      c[3],           // zip
      c[4],           // owner_name
      c[5],           // neighborhood_code
      bldAr,          // bld_ar
      curVal,         // cur_appr_val
      priorVal,       // prior_appr_val
      c[9],           // protested
      COUNTY,         // county
    ]);

    if (batch.length >= BATCH_SIZE) {
      await flush();
    }
  }
  await flush();

  console.log(`\nDONE. Inserted ${inserted.toLocaleString()} Harris County properties.`);
}

run().catch((err) => {
  console.error("Import error:", err.message);
  process.exit(1);
});