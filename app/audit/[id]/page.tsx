'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AuditResult, ToolRecommendation } from "@/types";

import { use } from 'react'
import { POST } from "@/app/api/audit/route";

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AuditPage({ params }: PageProps) {
  const { id } = use(params)

  const [audit, setAudit] = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  console.log('component rendered, id:', id)
  console.log('loading state:', loading)
  useEffect(() => {
    async function fetchAudit() {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setError("Audit not found");
        setLoading(false);
        return;
      }

      setAudit({
        id: data.id,
        formData: data.form_data,
        recommendations: data.recommendations,
        totalMonthlySavings: data.total_monthly_savings,
        totalAnnualSavings: data.total_annual_savings,
        aiSummary: data.ai_summary || "",
        createdAt: data.created_at,
      });

      if (!data.ai_summary){
        try {
          const summmaryRes = await fetch('/api/summary', {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              auditId: data.id,
              auditData: {
                formData: data.form_data,
                recommendations: data.recommendations,
                totalMonthlySavings: data.total_monthly_savings,
                totalAnnualSavings: data.total_annual_savings,
              }
            })
          })

          const summaryData = await summmaryRes.json()

          if (summaryData.summary) {
            setAudit(prev => prev ? { ...prev, aiSummary: summaryData.summary } : prev)
          }

        } catch(err){
          console.error('Summary generation failed: ',err)
        }
      }
      setLoading(false);
    }

    fetchAudit();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-400 text-lg animate-pulse">
          Analyzing your spend...
        </p>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-red-400 text-lg">
          {error || "Something went wrong"}
        </p>
      </div>
    );
  }

  const isHighSavings = audit.totalMonthlySavings > 500;
  const isLowSavings = audit.totalMonthlySavings < 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 max-w-6xl mx-auto">
        <span className="text-xl font-bold">SpendLens</span>
        <a
          href="/"
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← New Audit
        </a>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-gray-400 uppercase tracking-widest text-sm mb-3">
            Your AI Spend Audit
          </p>

          {audit.totalMonthlySavings > 0 ? (
            <>
              <h1 className="text-6xl font-bold text-green-400 mb-2">
                ${audit.totalMonthlySavings.toFixed(0)}
                <span className="text-3xl text-gray-400">/mo</span>
              </h1>
              <p className="text-gray-400 text-xl">
                potential savings — that's{" "}
                <span className="text-green-400 font-bold">
                  ${audit.totalAnnualSavings.toFixed(0)}/year
                </span>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold text-white mb-2">
                You are spending well ✓
              </h1>
              <p className="text-gray-400 text-xl">
                Your current AI tool stack look optimized.
              </p>
            </>
          )}
        </div>

        {isHighSavings && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8 text-center">
            <p className="text-green-400 font-bold text-lg mb-2">
              💰 You could save even more with Credex
            </p>
            <p className="text-gray-300 text-sm mb-4">
              Credix sells discounted AI credits for Cursor, Claude, and ChatGPT
              Enterprise - sourced from companies that overforecast. Get the
              same tools for less.
            </p>

            <a
              href="https://credex.rocks"
              target="_blank"
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-lg inline-block transition"
            >
              Book a Free Credex Consultation →
            </a>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Tool-by-tool breakdown</h2>
        <div className="flex flex-col gap-4 mb-10">
          {audit.recommendations.map((rec: ToolRecommendation) => (
            <RecommendationCard key={rec.toolId} rec={rec} />
          ))}
        </div>

        {audit.aiSummary && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-3">AI Analysis</h2>
            <p className="text-gray-300 leading-relaxed">{audit.aiSummary}</p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}
            className="bg-white/10 hover:bg-white/20 border boder-white/20 text-white px-6 py-3 rounded-lg transition"
          >
            📋 Copy Shareable Link
          </button>
        </div>

        {isLowSavings && (
          <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <p className="text-white font-semibold mb-2">
              Your stack looks optimized right now 👍
            </p>
            <p className="text-gray-400 text-sm">
              AI tool pricing changes frequently. We'll notify you when new
              savings apply to your stack.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: ToolRecommendation }) {
  const severityColors: Record<string, string> = {
    high: "border-red-500/40 bg-red-500/5",
    medium: "border-yellow-500/40 bg-yellow-500/5",
    low: "border-blue-500/40 bg-blue-500/5",
    optimal: "border-green-500/40 bg-green-500/5",
  };

  const severityBadge: Record<string, string> = {
    high: "bg-red-500/20 text-red-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    low: "bg-blue-500/20 text-blue-400",
    optimal: "bg-green-500/20 text-green-400",
  };

  return (
    <div className={`border rounded-xl p-5 ${severityColors[rec.severity]}`}>
      <div className="flex items-center justify-betweeen mb-3">
        <h3 className="font-bold text-white">{rec.toolName}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${severityBadge[rec.severity]}`}
        >
          {rec.severity === "optimal"
            ? "✓ Optimal"
            : `⚠ ${rec.severity} priority`}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-3 text-sm">
        <div>
          <p className="text-gray-500">Current</p>
          <p className="text-white font-semibold">${rec.currentSpend}/mo</p>
        </div>
        {rec.monthlySavings > 0 && (
          <>
            <div className="text-gray-600">→</div>
            <div>
              <p className="text-gray-500">Recommended</p>
              <p className="text-green-400 font-semibold">
                ${rec.projectedSpend}/mo
              </p>
            </div>
            <div>
              <p className="text-gray-500">Savings</p>
              <p className="text-green-400 font-bold">
                ${rec.monthlySavings}/mo · ${rec.annualSavings}/yr
              </p>
            </div>
          </>
        )}
      </div>

      {rec.monthlySavings > 0 && (
        <p className="text-sm text-blue-400 font-medium mb-2">
          → {rec.recommendedAction}
        </p>
      )}

      
      <p className="text-gray-400 text-sm">{rec.reason}</p>

    </div>
  );
}
