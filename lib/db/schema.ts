import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  ownerName: text("owner_name").notNull(),
  ownerEmail: text("owner_email").notNull(),
  ownerPhone: text("owner_phone").notNull(),
  propertyAddress: text("property_address").notNull(),
  county: text("county").notNull(),
  cadAccountNumber: text("cad_account_number").notNull(),
  cadValue: integer("cad_value"),
  arguedValue: integer("argued_value"),
  projectedSavings: integer("projected_savings"),
  status: text("status").default("new"),
  signatureImage: text("signature_image"),
  signedAt: timestamp("signed_at"),
});