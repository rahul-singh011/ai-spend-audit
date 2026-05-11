import { NextRequest , NextResponse } from "next/server";
import { runAudit } from "@/lib/auditEngine";
import {AuditFormData} from '@/types'
import { supabase } from "@/lib/supabase";


export async function POST(request: NextRequest){
    try{
        const formData : AuditFormData = await request.json()

        if(!formData.tools || formData.tools.length === 0){
            return NextResponse.json(
                {error : "No tools provided"},
                {status : 400}
            )
        }

        const auditResult = runAudit(formData)
        
        const { data } = await supabase
        .from('audits')
        .insert({
            form_data : formData,
            recommandations : auditResult.recommandations,
            total_monthly_savings : auditResult.totalMonthlySavings,
            total_annual_savings : auditResult.totalAnnualSavings,
            ai_summary: '',
        })
        .select('id')
        .single()

        if (error){
            console.error('Supabase error: ', error)
            return NextResponse.json(
                {error : 'Failed to save audit'},
                {status : 500}
            )
        }

        return NextResponse.json({
            id: data.id,
            ...auditResult,
        })
    }catch(err){
        console.error("Audit API error: ",err)
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        )
    }

}


