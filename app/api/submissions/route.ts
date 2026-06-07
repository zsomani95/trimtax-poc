import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      owner_name,
      owner_email,
      owner_phone,
      property_address,
      county,
      cad_account_number,
      cad_value,
      argued_value,
      projected_savings,
      status,
    } = body;

    const [submission] = await db
      .insert(submissions)
      .values({
        ownerName: owner_name,
        ownerEmail: owner_email,
        ownerPhone: owner_phone,
        propertyAddress: property_address,
        county,
        cadAccountNumber: cad_account_number,
        cadValue: cad_value,
        arguedValue: argued_value,
        projectedSavings: projected_savings,
        status: status ?? "new",
      })
      .returning();

    return NextResponse.json({ id: submission.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}