export const mockProperties: Record<string, MockProperty> = {
  "7534902": {
    cadAccountNumber: "7534902",
    address: "11823 Aliana Preserve Dr, Richmond, TX 77407",
    county: "Fort Bend",
    ownerName: "Demo Owner",
    cadValue: 550000,
    arguedValue: 471000,
    projectedSavings: 1672,
    neighborhood: "Aliana",
    sqft: 2950,
    yearBuilt: 2018,
    comps: [
      { address: "11801 Aliana Preserve Dr", cadValue: 538000, ppsf: 159.66 },
      { address: "11845 Aliana Preserve Dr", cadValue: 522000, ppsf: 155.82 },
      { address: "11789 Aliana Preserve Dr", cadValue: 545000, ppsf: 161.19 },
      { address: "11867 Aliana Preserve Dr", cadValue: 519000, ppsf: 154.93 },
      { address: "11756 Aliana Preserve Dr", cadValue: 531000, ppsf: 158.01 },
    ],
    medianPpsf: 158.01,
    subjectPpsf: 186.44,
    protestArgument: "Subject property assessed at $186.44/sqft versus neighborhood median of $158.01/sqft — a 18.0% premium unsupported by property characteristics.",
  },
  "R112233": {
    cadAccountNumber: "R112233",
    address: "2134 Lakemont Bend Ln, Richmond, TX 77406",
    county: "Fort Bend",
    ownerName: "Demo Owner",
    cadValue: 376000,
    arguedValue: 322000,
    projectedSavings: 1188,
    neighborhood: "Lakemont",
    sqft: 2100,
    yearBuilt: 2015,
    comps: [
      { address: "2118 Lakemont Bend Ln", cadValue: 368000, ppsf: 152.38 },
      { address: "2150 Lakemont Bend Ln", cadValue: 355000, ppsf: 149.16 },
      { address: "2098 Lakemont Bend Ln", cadValue: 371000, ppsf: 153.33 },
      { address: "2166 Lakemont Bend Ln", cadValue: 348000, ppsf: 147.62 },
      { address: "2082 Lakemont Bend Ln", cadValue: 362000, ppsf: 151.43 },
    ],
    medianPpsf: 151.43,
    subjectPpsf: 179.05,
    protestArgument: "Subject property assessed at $179.05/sqft versus neighborhood median of $151.43/sqft — a 18.2% premium not reflected in comparable properties.",
  },
  "0921754000023": {
    cadAccountNumber: "0921754000023",
    address: "14520 Shadowlake Dr, Houston, TX 77082",
    county: "Harris",
    ownerName: "Demo Owner",
    cadValue: 728000,
    arguedValue: 624000,
    projectedSavings: 2288,
    neighborhood: "Shadowlake",
    sqft: 3800,
    yearBuilt: 2012,
    comps: [
      { address: "14502 Shadowlake Dr", cadValue: 712000, ppsf: 163.16 },
      { address: "14538 Shadowlake Dr", cadValue: 698000, ppsf: 161.05 },
      { address: "14488 Shadowlake Dr", cadValue: 721000, ppsf: 164.74 },
      { address: "14556 Shadowlake Dr", cadValue: 689000, ppsf: 159.47 },
      { address: "14470 Shadowlake Dr", cadValue: 705000, ppsf: 161.84 },
    ],
    medianPpsf: 161.84,
    subjectPpsf: 191.58,
    protestArgument: "Subject property assessed at $191.58/sqft versus neighborhood median of $161.84/sqft — an 18.4% overassessment relative to comparable properties in the same CAD neighborhood.",
  },
};

export type MockProperty = {
  cadAccountNumber: string;
  address: string;
  county: string;
  ownerName: string;
  cadValue: number;
  arguedValue: number;
  projectedSavings: number;
  neighborhood: string;
  sqft: number;
  yearBuilt: number;
  comps: { address: string; cadValue: number; ppsf: number }[];
  medianPpsf: number;
  subjectPpsf: number;
  protestArgument: string;
};