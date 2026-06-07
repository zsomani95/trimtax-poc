import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
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
  status: text("status").default("pending"),
  signatureImage: text("signature_image"),
  signedAt: timestamp("signed_at"),
  submittedAt: timestamp("submitted_at"),
  hearingScheduledAt: timestamp("hearing_scheduled_at"),
  hearingDate: timestamp("hearing_date"),
  resultedAt: timestamp("resulted_at"),
  resultedSavings: integer("resulted_savings"),
});

export const trackingNotes = pgTable("tracking_notes", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id").notNull(),
  note: text("note").notNull(),
  noteType: text("note_type"), // "status_update", "hearing_notice", "result", "user_note"
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: text("created_by"), // "system" or user email
});