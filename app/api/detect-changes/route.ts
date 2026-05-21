import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { OFFICIAL_PRICING, runAudit } from "@/lib/auditEngine";
import { AuditFormData } from "@/types";
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { data: audits, error } = await supabase
      .from('audits')
      .select('*')
      .not('user_email', 'is', null)
      .not('pricing_snapshot', 'is', null)

    if (error) {
      console.error('Fetch audits error: ', error)
      return NextResponse.json({ error: 'Failed to fetch audits' }, { status: 500 })
    }

    if (!audits || audits.length === 0) {
      return NextResponse.json({ message: 'No audits to check', changes: [] })
    }

    const changedAudits: Array<{
      auditId: string
      userEmail: string
      changes: unknown[]
    }> = []

    for (const audit of audits) {
      const snapshot = audit.pricing_snapshot as Record<string, Record<string, number>>
      const formData = audit.form_data as AuditFormData

      const pricingChanges: Array<{
        toolName: string
        plan: string
        oldPrice: number
        newPrice: number
      }> = []

      for (const tool of formData.tools) {
        const storedToolPricing = snapshot[tool.toolName]
        const currentToolPricing = OFFICIAL_PRICING[tool.toolName]

        if (!storedToolPricing || !currentToolPricing) continue

        const storedPrice = storedToolPricing[tool.plan]
        const currentPrice = currentToolPricing[tool.plan]

        if (
          storedPrice !== undefined &&
          currentPrice !== undefined &&
          storedPrice !== currentPrice
        ) {
          pricingChanges.push({
            toolName: tool.toolName,
            plan: tool.plan,
            oldPrice: storedPrice,
            newPrice: currentPrice,
          })
        }
      }

      if (pricingChanges.length > 0) {
        const newAuditResult = runAudit(formData)

        const { error: logError } = await supabase
          .from('pricing_change_logs')
          .insert({
            audit_id: audit.id,
            user_email: audit.user_email,
            changes: pricingChanges,
            old_recommendations: audit.recommendations,
            new_recommendations: newAuditResult.recommendations,
            old_total_savings: audit.total_monthly_savings,
            new_total_savings: newAuditResult.totalMonthlySavings,
            email_sent: false,
          })

        if (logError) {
          console.error('Log error: ', logError)
        } else {
        
          try {
            await resend.emails.send({
              from: 'SpendLens <onboarding@resend.dev>',
              to: 'rahulsingh22x22x@gmail.com', 
              subject: `Your AI spend audit is outdated — prices changed`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                  <h1 style="color: #111; font-size: 24px;">
                    Pricing changed since your last audit
                  </h1>
                  <p style="color: #444;">
                    The following tools you audited have had price changes:
                  </p>
                  <ul>
                    ${pricingChanges.map(change => `
                      <li style="margin-bottom: 8px;">
                        <strong>${change.toolName}</strong> (${change.plan}):
                        $${change.oldPrice}/mo → $${change.newPrice}/mo
                      </li>
                    `).join('')}
                  </ul>
                  <p style="color: #444;">
                    Your previous savings estimate may no longer be accurate.
                    Click below to see what changed.
                  </p>
                  
                    href="${process.env.NEXT_PUBLIC_APP_URL}/audit/${audit.id}/diff"
                    style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 16px;"
                  >
                    View What Changed →
                  </a>
                  <p style="color: #666; font-size: 14px; margin-top: 32px;">
                    — The SpendLens Team
                  </p>
                </div>
              `,
            })

            
            await supabase
              .from('pricing_change_logs')
              .update({ email_sent: true })
              .eq('audit_id', audit.id)

          } catch (emailError) {
            console.error('Email error:', emailError)
          }

          changedAudits.push({
            auditId: audit.id,
            userEmail: audit.user_email,
            changes: pricingChanges,
          })
        }
      }
    }

    return NextResponse.json({
      message: `Checked ${audits.length} audits, found ${changedAudits.length} with pricing changes`,
      changes: changedAudits,
    })

  } catch (err) {
    console.error('Detect changes error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}