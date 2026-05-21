import { NextRequest, NextResponse } from "next/server";
import { runAudit, OFFICIAL_PRICING } from "@/lib/auditEngine";
import { AuditFormData } from "@/types";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const formData: AuditFormData = body.formData || body;
    const email: string | null = body.email || null;

    if (!formData.tools || formData.tools.length === 0) {
      return NextResponse.json({ error: "No tools provided" }, { status: 400 });
    }

    const auditResult = runAudit(formData);

    const pricingSnapshot = formData.tools.reduce((acc, tool) => {
      acc[tool.toolName] = OFFICIAL_PRICING[tool.toolName] || {}
      return acc
    }, {} as Record<string, Record<string, number>>)

    const { data, error: supabaseError } = await supabase
      .from("audits")
      .insert({
        form_data: formData,
        recommendations: auditResult.recommendations,
        total_monthly_savings: auditResult.totalMonthlySavings,
        total_annual_savings: auditResult.totalAnnualSavings,
        ai_summary: "",
        pricing_snapshot: pricingSnapshot,
        user_email: email,
      })
      .select("id")
      .single();

    if (supabaseError) {
      console.error("Supabase error: ", supabaseError);
      return NextResponse.json(
        { error: "Failed to save audit" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      id: data.id,
      ...auditResult,
    });
  } catch (err) {
    console.error("Audit API error: ", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}