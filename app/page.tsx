'use client'

import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import SpendForm from '@/components/form/SpendForm'

const SUPPORTED_TOOLS = [
  'Cursor' , 'GitHub Copilot' , 'Claude' ,
  'ChatGPT' , 'Anthropic API' , 'OpenAI API',
  'Gemini' , 'Windsurf'
]

export default function Home(){
  return (
    <div className = "min-h-screen bg-[#0a0a0a] text-white ">
     <nav className = "flex items-center justify-between px-6 py-4 border-b border-white/10 max-w-6xl mx-auto  ">
     
     <div className= "flex items-center gap-2">
      <span className= "text-xl font-bold text white " >SpendLens</span>
      <Badge variant="secondary" className= "text-xs" >Free</Badge>
     </div>

    
      <Button className="bg-white text-black hover:bg-gray-200">
          Start Free Audit
        </Button>
     </nav>

     <section className="flex flex-col items-center text-center px-6 py-24 max-w-4xl mx-auto ">
     <span className="text-sm text-gray-400 mb-4 uppercase tracking-widest">
          Free AI Tool Spend Audit
      </span>

      <h1 className= "text-5xl font-bold leading-tight mb-6">
        Are you overpaying for{' '}
       <span className = "text-green-400">AI tools?</span>
      </h1>

      <p className = "text-xl text-gray-400 mb-10 max-w-2xl">
        Enter what you pay for Cursor, Claude, ChatGPT, Copiolt and more.
        Get an instant audit showing exactly where you can save money.
      </p>

      <Button 
        size="lg"
        className = "bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-6 text-lg "
      > 
      Audit My AI  Spend — It&apos;s Free
      </Button>

      <p className="text-gray-400 text-sm mt-4">
          No login required. Results in 30 seconds.
        </p>
    </section>

    <section className = "border-t border-white/10 px-8 py-6">
        <p className="text-center text-gray-400 text-sm mb-6">
          Audits spending on
        </p>
        
        <div className= "flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {SUPPORTED_TOOLS.map((tool) =>(
            <Badge 
              key={tool}
              variant ="outline"
              className = "text-gray-400 border-white/20 px-3 py-1">
                {tool}
              </Badge>
          ))}
        </div>
        </section>
        <SpendForm />

    </div> 
  )
}
