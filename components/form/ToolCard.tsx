'use client'

interface ToolcardProps {
    toolEntry: {
        id : string
        toolName : string
        plan : string
        seats : number
        monthlySpend : number
    }

    onUpdate :(id : string , field : string, value: string | number) => void
    onRemove : (id : string) => void
}

const PLANS: Record<string, string[]> = {
    cursor : ['hooby' , 'pro' , 'pro+' , 'ultra' , 'teams' , 'enterprise'],
    'github-copilot' : ['individual' , 'business' , 'enterprise'],
    claude : ['free' , 'pro' , 'max' , 'team' , 'enterprise' , 'api-direct'],
    chatgpt : ['plus' , 'team' , 'enterprise' , 'api-direct'],
    'anthropic-api': ['api-direct'],
    'openai-api': ['api-direct'],
    gemini: ['free', 'pro', 'ultra', 'api-direct'],
    windsurf: ['free', 'pro', 'team'],
}

const TOOL_LABELS : Record<string, string> = {
    cursor : 'Cursor',
    'github-copilot': 'GitHub Copilot',
    claude : 'Claude',
    chatgpt : 'ChatGPT',
    'anthropic-api' : 'Anthropic API',
    'oepnai-api' : 'OpenAI API',
    gemini : 'Gemini',
    windsurf : 'Windsurf',
}

export default function ToolCard({toolEntry , onUpdate , onRemove}: ToolcardProps){
    return (
        <div className = "bg-white/5 border border-white/10 rounded-xl p-5 relative">

            <button  onClick = {() => onRemove(toolEntry.id)}
                     className= "absolute top-3 right-3 text-gray-500 hover:text-red-400 text-xl">
                    ×
            </button>

            <h3 className = "text-white font-semibold mb-4">
                {TOOL_LABELS[toolEntry.toolName] || toolEntry.toolName}
            </h3>

            <div className = "grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                    <label className = "text-gray-400 text-sm  mb-1 block">Plan</label>
                    <select 
                      value={toolEntry.plan}
                      onChange={(e) => onUpdate(toolEntry.id, 'plan', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
                        {(PLANS[toolEntry.toolName] || []).map((plan)=> (
                            <option key= {plan} value={plan} className="bg-gray-900">
                                {plan.charAt(0).toUpperCase() + plan.slice(1)}
                            </option>
                        ))}
                      </select>
                </div>

                <div>
                    <label className = "text-gray-400 text-sm mb-1 block">Seats</label> 
                    <input 
                        type="number"
                        min= "1"
                        value={toolEntry.seats}
                        onChange={(e) => onUpdate(toolEntry.id, 'seats', parseInt(e.target.value) || 1)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
         
                        />
                </div>

                <div> 
                    <label className= "text-gray-400 text-sm mb-1 block ">Monthly Spend ($) </label>
                    <input 
                        type = "number"
                        min= "0"
                        value={toolEntry.monthlySpend}
                        onChange={(e) => onUpdate(toolEntry.id , 'monthlySpend', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                
            </div>
        </div>
    )
}