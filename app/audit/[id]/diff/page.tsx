'use client'

import { useEffect , useState } from "react"
import {use} from 'react'
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface DiffPageProps {
  params : Promise<{id : string}>
}

interface PricingChange {
  toolName : string
  plan : string
  oldPrice : number
  newPrice : number
}

interface Recommendation {
  toolName : string
  currentPlan : string
  currentSpend : number
  recommendedAction : string
  projectedSpend : number
  monthlySavings : number
  annualSavings: number
  reason: string
  severity: string
}

interface DiffData {
  auditId: string
  changes: PricingChange[]
  oldRecommendations: Recommendation[]
  newRecommendations: Recommendation[]
  oldTotalSavings: number
  newTotalSavings: number
  createdAt: string
}

export default function DiffPage({ params }: DiffPageProps)  {
  const {id} = use(params)
  const [diff, setDiff] = useState<DiffData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{
    async function fetchDiff() {
      const { data, error } = await supabase
        .from('pricing_change_logs')
        .select('*')
        .eq('audit_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single() 

        if (error || !data){
          setError("No prcing changes found for this audits")
          setLoading(false)
          return
        }

        setDiff({
          auditId: data.audit_id,
          changes: data.changes,
          oldRecommendations: data.old_recommendations,
          newRecommendations: data.new_recommendations,
          oldTotalSavings: data.old_total_savings,
          newTotalSavings: data.new_total_savings,
          createdAt: data.created_at,
        })
        setLoading(false)
    }

    fetchDiff()
  }, [id])

  if (loading){
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center ">
        <p className="text-gray-400 animate-pulse">Loading diff...</p>
      </div>
    )
  }

  if (error || !diff){
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center ">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href={`/audit/${id}`} className="text-green-400 hover:underline">
            ← Back to audit
          </Link>
        </div>
      </div>
    )
  }
  const savingsDelta = diff.newTotalSavings - diff.oldTotalSavings

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 max-w-6xl mx-auto">
        <span className="text-xl font-bold">SpendLens</span>
        <Link
          href={`/audit/${id}`}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← Back to audit
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
          <p className="text-gray-400 uppercase tracking-widest text-sm mb-3">
            Pricing Change Detected
          </p>
          <h1 className="text-4xl font-bold text-white mb-2">
            What Changed
          </h1>
          <p className="text-gray-400">
            Detected on {new Date(diff.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className={`rounded-xl p-6 mb-8 text-center border ${
          savingsDelta > 0
            ? 'bg-green-500/10 border-green-500/30'
            : savingsDelta < 0
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-white/5 border-white/10'
        }`}>
          <p className="text-gray-400 text-sm mb-2">Savings opportunity change</p>
          <p className={`text-4xl font-bold ${
            savingsDelta > 0 ? 'text-green-400' :
            savingsDelta < 0 ? 'text-red-400' : 'text-white'
          }`}>
            {savingsDelta > 0 ? '+' : ''}{savingsDelta.toFixed(0)}/mo
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Was ${diff.oldTotalSavings}/mo → Now ${diff.newTotalSavings}/mo
          </p>
        </div>

        <h2 className="text-lg font-bold mb-4"> Price changes detected</h2>
        <div className="flex flex-col gap-3 mb-10">
          {diff.changes.map((change, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-white font-semibold capitalize">
                  {change.toolName} — {change.plan}
                </p>
                <p className="text-gray-400 text-sm">
                  Official price changed
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 line-through text-sm">
                  ${change.oldPrice}/mo
                </p>
                <p className={`font-bold ${
                  change.newPrice > change.oldPrice
                    ? 'text-red-400'
                    : 'text-green-400'
                }`}>
                  ${change.newPrice}/mo
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <h2 className="text-lg font-bold mb-4">
          Recommendations - before vs after
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <p className="text-gray-400 text-sm mb-3 uppercase tracking-wide">
              Previous audit
            </p>
            <div className="flex flex-col gap-3">
              {diff.oldRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <p className="text-white font-semibold mb-1">{rec.toolName}</p>
                  <p className="text-gray-400 text-sm mb-2">{rec.recommendedAction}</p>
                  <p className="text-green-400 text-sm font-medium">
                    ${rec.monthlySavings}/mo savings
                  </p>
                </div>
              ))}
            </div>
        </div>

        <div>
            <p className="text-gray-400 text-sm mb-3 uppercase tracking-wide">
              Updated audit
            </p>
            <div className="flex flex-col gap-3">
              {diff.newRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className="bg-green-500/5 border border-green-500/20 rounded-xl p-4"
                >
                  <p className="text-white font-semibold mb-1">{rec.toolName}</p>
                  <p className="text-gray-400 text-sm mb-2">{rec.recommendedAction}</p>
                  <p className="text-green-400 text-sm font-medium">
                    ${rec.monthlySavings}/mo savings
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
        
        <div className="mt-10 text-center">
          <Link
          href={`/`}
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3 rounded-lg inline-block transition"
          >
            Re-run Audit with Current Prices →
          </Link>
        </div>
        
      </main>
    </div>
  )
}