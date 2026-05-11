export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export type ToolName =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf'

export interface ToolEntry {
  id: string
  toolName: ToolName
  plan: string
  seats: number
  monthlySpend: number
}

export interface AuditFormData {
  tools: ToolEntry[]
  teamSize: number
  useCase: UseCase
}

export interface ToolRecommendation {
  toolId: string
  toolName: string
  currentPlan: string
  currentSpend: number
  recommendedAction: string
  recommendedPlan: string | null
  projectedSpend: number
  monthlySavings: number
  annualSavings: number
  reason: string
  severity: 'high' | 'medium' | 'low' | 'optimal'
}

export interface AuditResult {
  id: string
  formData: AuditFormData
  recommendations: ToolRecommendation[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  aiSummary: string
  createdAt: string
}