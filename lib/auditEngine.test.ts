import { runAudit } from './auditEngine'

describe('Audit Engine', () => {

  
  it('should detect overpaying vs official price', () => {
    const result = runAudit({
      teamSize: 2,
      useCase: 'coding',
      tools: [{
        id: '1',
        toolName: 'cursor',
        plan: 'pro',
        seats: 2,
        monthlySpend: 60,
      }]
    })

    expect(result.recommendations[0].monthlySavings).toBe(20)
    expect(result.recommendations[0].severity).toBe('medium')
  })

  it('should flag team plan overkill for 2 users', () => {
    const result = runAudit({
      teamSize: 2,
      useCase: 'mixed',
      tools: [{
        id: '2',
        toolName: 'cursor',
        plan: 'teams',
        seats: 2,
        monthlySpend: 80, 
      }]
    })
    expect(result.recommendations[0].recommendedPlan).toBe('pro')
    expect(result.recommendations[0].monthlySavings).toBe(40)
  })

  it('should mark spend as optimal when correctly priced', () => {
    const result = runAudit({
      teamSize: 1,
      useCase: 'writing',
      tools: [{
        id: '3',
        toolName: 'claude',
        plan: 'pro',
        seats: 1,
        monthlySpend: 20, 
      }]
    })
    expect(result.recommendations[0].severity).toBe('optimal')
    expect(result.recommendations[0].monthlySavings).toBe(0)
  })

  it('should correctly sum total monthly savings', () => {
    const result = runAudit({
      teamSize: 3,
      useCase: 'coding',
      tools: [
        {
          id: '4',
          toolName: 'cursor',
          plan: 'pro',
          seats: 2,
          monthlySpend: 60, 
        },
        {
          id: '5',
          toolName: 'claude',
          plan: 'pro',
          seats: 1,
          monthlySpend: 30, 
        }
      ]
    })
    expect(result.totalMonthlySavings).toBe(30)
    expect(result.totalAnnualSavings).toBe(360)
  })

  it('should suggest Cursor over GitHub Copilot for coding use case', () => {
    const result = runAudit({
      teamSize: 3,
      useCase: 'coding',
      tools: [{
        id: '6',
        toolName: 'github-copilot',
        plan: 'enterprise',
        seats: 3,
        monthlySpend: 117, 
      }]
    })
    expect(result.recommendations[0].recommendedAction).toBe('Switch to Cursor Pro')
  })

})