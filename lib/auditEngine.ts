
import { AuditFormData , AuditResult , ToolRecommendation} from '@/types'

export const OFFICIAL_PRICING: Record<string ,Record<string, number>> = {

    cursor:{
        hobby:0,
        pro: 25,
        'pro+': 60,
        ultra: 200,
        teams: 40,
        enterprise: 40,
    },

    'github-copilot': {
        individual: 10,
        business: 19,
        enterprise: 39,
    },

    claude: {
        free: 0,
        pro: 20,
        max: 100,
        team: 30,
        enterprise: 30,
        'api-direct': 0,
    },

    chatgpt: {
        free: 0,
        pro: 20,
        max: 100,
        team: 30,
        enterprise: 30,
        'api-direct': 0,
    },

    'anthropic-api': {
        'api-direct': 0,
    },

    'openai-api': {
        'api-direct': 0,
   },

   gemini: {
     free: 0,
     pro: 20.67,
     Plus: 4.23,
    'api-direct': 0,
  },

  windsurf: {
    free: 0,
    pro: 20,
    team: 40,
  },

}

const TOOL_LABELS: Record<string, string> = {
    cursor: 'Cursor',
    'github-copilot': 'GitHub Copilot',
    claude: 'Claude',
    chatgpt: 'ChatGPT',
    'anthropic-api': 'Anthropic API',
    'openai-api': 'OpenAI API',
    gemini: 'Gemini',
    windsurf: 'Windsurf',
}

function auditSingleTool(
    tool: AuditFormData['tools'][0],
    teamSize: number,
    useCase: string
): ToolRecommendation {

    const toolPricing = OFFICIAL_PRICING[tool.toolName]
    const currentPricePerSeat = toolPricing?.[tool.plan] ?? 0
    const officialMonthlyTotal = currentPricePerSeat * tool.seats
       
    if (tool.monthlySpend > officialMonthlyTotal && officialMonthlyTotal > 0) {
        const savings = tool.monthlySpend - officialMonthlyTotal
        return {
          toolId: tool.id,
          toolName: TOOL_LABELS[tool.toolName],
          currentPlan: tool.plan,
          currentSpend: tool.monthlySpend,
          recommendedAction: 'Reduce to official price',
          recommendedPlan: tool.plan,
          projectedSpend: officialMonthlyTotal,
          monthlySavings: savings,
          annualSavings: savings * 12,
          reason: `You're paying $${tool.monthlySpend}/mo but the official ${tool.plan} plan for ${tool.seats} seat(s) costs $${officialMonthlyTotal}/mo. You may be on a legacy plan or overpaying.`,
          severity: savings > 100 ? 'high' : 'medium',
        }
      }
      
      const isTeamPlan = ['teams', 'team', 'business', 'enterprise'].includes(tool.plan)
  const isSmallTeam = tool.seats <= 2

  if (isTeamPlan && isSmallTeam) {
  
    const proAlternatives: Record<string, string> = {
      cursor: 'pro',
      'github-copilot': 'individual',
      claude: 'pro',
      chatgpt: 'plus',
      windsurf: 'pro',
    }
    const betterPlan = proAlternatives[tool.toolName]
    const betterPlanPrice = betterPlan ? toolPricing[betterPlan] : null

    if (betterPlan && betterPlanPrice !== undefined && betterPlanPrice !== null) {
      const projectedSpend = betterPlanPrice * tool.seats
      const savings = tool.monthlySpend - projectedSpend

      if (savings > 0) {
        return {
          toolId: tool.id,
          toolName: TOOL_LABELS[tool.toolName],
          currentPlan: tool.plan,
          currentSpend: tool.monthlySpend,
          recommendedAction: `Downgrade to ${betterPlan}`,
          recommendedPlan: betterPlan,
          projectedSpend,
          monthlySavings: savings,
          annualSavings: savings * 12,
          reason: `With only ${tool.seats} seat(s), the ${tool.plan} plan is overkill. The ${betterPlan} plan at $${betterPlanPrice}/user covers all your needs and saves $${savings}/mo.`,
          severity: savings > 50 ? 'high' : 'medium',
        }
      }
    }
  }

  if (
    tool.toolName === 'github-copilot' &&
    useCase === 'coding' &&
    tool.monthlySpend > 0
  ) {
    const cursorProCost = 20 * tool.seats
    if (cursorProCost < tool.monthlySpend) {
      const savings = tool.monthlySpend - cursorProCost
      return {
        toolId: tool.id,
        toolName: TOOL_LABELS[tool.toolName],
        currentPlan: tool.plan,
        currentSpend: tool.monthlySpend,
        recommendedAction: 'Switch to Cursor Pro',
        recommendedPlan: 'cursor-pro',
        projectedSpend: cursorProCost,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `For coding use cases, Cursor Pro ($20/user) offers superior AI coding features vs GitHub Copilot ${tool.plan} at your current spend of $${tool.monthlySpend}/mo.`,
        severity: 'medium',
      }
    }
  }

  return {
    toolId: tool.id,
    toolName: TOOL_LABELS[tool.toolName],
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendedAction: 'No change needed',
    recommendedPlan: null,
    projectedSpend: tool.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: `Your ${tool.plan} plan at $${tool.monthlySpend}/mo is appropriate for your team size and use case.`,
    severity: 'optimal',
  }
}

export function runAudit(formData: AuditFormData): Omit<AuditResult, 'id' | 'aiSummary' | 'createdAt'> {

    
    const recommendations = formData.tools.map(tool =>
      auditSingleTool(tool, formData.teamSize, formData.useCase)
    )
  
   
    const totalMonthlySavings = recommendations.reduce(
      (sum, rec) => sum + rec.monthlySavings, 0
    )
  
    return {
      formData,
      recommendations,
      totalMonthlySavings,
      totalAnnualSavings: totalMonthlySavings * 12,
    }
  }
