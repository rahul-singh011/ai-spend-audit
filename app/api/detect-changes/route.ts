import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { OFFICIAL_PRICING, runAudit } from "@/lib/auditEngine";
import { AuditFormData } from "@/types";

export async function POST(request: NextRequest) {
    try{
        const { data: audits, error} = await supabase
        .from('audits')
        .select('*')
        .not('user_email' , 'is' , null)
        .not('pricing_snapshot', 'is', null)

        if(error){
            console.error('Fetch audits error: ', error)
            return NextResponse.json({error: 'Failed to fetch audits'}, {status : 500})
        }
        if (!audits || audits.length === 0) {
            return NextResponse.json({ message: 'No audits to check', changes: [] })
        }

        const changeAudits = []

        for(const audit of audits){
            const snapshot = audit.pricing_snapshot as Record<string, Record<string, number>>
            const formData = audit.form_data as AuditFormData

            const pricingChanges: Array<{
                toolName: string
                plan: string
                oldPrice : number,
                newPrice: number
            }> = []

            for (const tool of formData.tools) {
                const storedToolPricing = snapshot[tool.toolName]
                const currentToolPricing = OFFICIAL_PRICING[tool.toolName]

                if(!storedToolPricing || !currentToolPricing) continue

                const storedPrice = storedToolPricing[tool.plan]
                const currentPrice = storedToolPricing[tool.plan]

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
             }else{
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
    
    } catch (err){
        console.error('Detect changes error: ', err)
        return NextResponse.json({error : 'Internal server error'} , {status : 500})
    }

}