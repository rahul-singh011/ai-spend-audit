import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { supabase } from "@/lib/supabase";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { auditId, auditData } = await request.json();

    const prompt = `You are a financial advisor specializing in AI tool costs for startups.

    A startup has completed an AI spend audit. Here are the results:

    Team size: ${auditData.formData.teamSize} people
    Primary use case: ${auditData.formData.useCase}
    Total monthly savings identified: $${auditData.totalMonthlySavings}
    Total annual savings identified: $${auditData.totalAnnualSavings}

Tool breakdown:
${auditData.recommendations
  .map(
    (rec: {
      toolName: string
      currentSpend: number
      recommendedAction: string
      monthlySavings: number
      reason: string
    }) =>
      `- ${rec.toolName}: paying $${rec.currentSpend}/mo, recommended action: ${rec.recommendedAction}, saves $${rec.monthlySavings}/mo. Reason: ${rec.reason}`,
  )
  .join("\n")}

    Write a personalized 80-100 word summary paragraph for this startup. Be specific, mention their actual tools and numbers, and be honest. If savings are low, acknowledge they're spending well. If savings are high, emphasize the opportunity. Do not use bullet points. Write in second person. Do not add a heading.`;

    let aiSummary = "";

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile", 
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      });

      aiSummary = completion.choices[0]?.message?.content || "";
      console.log("AI summary generated:", aiSummary);
    } catch (apiError) {
      
      console.error("Groq API error:", apiError);
      const toolCount = auditData.recommendations?.length || 0;
      aiSummary = `Your team of ${auditData.formData.teamSize} is spending on ${toolCount} AI tool(s). ${
        auditData.totalMonthlySavings > 0
          ? `We identified $${auditData.totalMonthlySavings}/month in potential savings ($${auditData.totalAnnualSavings}/year). Review the recommendations above to optimize your AI spend.`
          : `Your current AI tool stack appears well-optimized for your team size and use case. Keep monitoring as pricing changes frequently.`
      }`;
    }

    await supabase
      .from("audits")
      .update({ ai_summary: aiSummary })
      .eq("id", auditId);

    return NextResponse.json({ summary: aiSummary });
  } catch (err) {
    console.error("Summary API error:", err);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 },
    );
  }
}
