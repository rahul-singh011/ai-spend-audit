import { NextRequest , NextResponse } from "next/server";
import {Resend} from 'resend'
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY)


export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {email , companyName , role , teamSize , auditId , totalMonthlySavings} = body


        if (!email || !email.includes('@')) {
            return NextResponse.json(
                {error : 'Valid email required'},
                {status : 400}
            )
        }

        if (body.website) {
          console.log('honeypot triggered')
            return NextResponse.json({ success: true }) 
          }

          const { error: dbError } = await supabase
            .from('leads')
            .insert({
                audit_id: auditId,
                email,
                company_name: companyName || null,
                role: role || null,
                team_size: teamSize || null,
            })

          if (dbError){
            console.error('Lead save error: ',dbError)
            return NextResponse.json(
                {error : 'Failed to save'},
                {status : 500}
            )
          }

          const isHighSavings = totalMonthlySavings > 500

          try {
            await resend.emails.send({
                from: 'SpendLens <onboarding@resend.dev>',
                to : email,
                subject: `Your AI Spend Audit — $${totalMonthlySavings}/mo in potential savings`,
                html : `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h1 style="color: #111; font-size: 24px;">Your AI Spend Audit is ready</h1>
            <p style="color: #444; font-size: 16px;">
              We identified <strong style="color: #16a34a;">$${totalMonthlySavings}/month</strong> 
              in potential savings for your team ($${totalMonthlySavings * 12}/year).
            </p>
            ${isHighSavings ? `
              <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 16px; border-radius: 8px; margin: 24px 0;">
                <p style="color: #15803d; font-weight: bold; margin: 0 0 8px;">
                  💰 You qualify for a Credex consultation
                </p>
                <p style="color: #166534; margin: 0 0 12px; font-size: 14px;">
                  Based on your savings opportunity, our team will reach out to show you 
                  how Credex discounted AI credits can save you even more.
                </p>
                <a href="https://credex.rocks" style="background: #16a34a; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  Learn about Credex →
                </a>
              </div>
            ` : ''}
            <p style="color: #666; font-size: 14px; margin-top: 32px;">
              — The SpendLens Team
            </p>
          </div>
        `,
            })
          } catch(emailError){
            console.error('Email send error: ', emailError)
          }

          return NextResponse.json({success : true})
    } catch (err) {
        console.error('Leads API error: ', err)
        return NextResponse.json(
            {error : 'Internal server error: ',err},
            {status : 500}
        )
    }
}