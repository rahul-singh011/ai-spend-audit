"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import ToolCard from "./ToolCard";

interface ToolEntry {
  id: string;
  toolName: string;
  plan: string;
  seats: number;
  monthlySpend: number;
}

interface FormData {
  tools: ToolEntry[];
  teamSize: number;
  useCase: string;
  email : string
}

const ALL_TOOLS = [
  { value: "cursor", label: "Cursor" },
  { value: "github-copilot", label: "Github Copilot" },
  { value: "claude", label: "Claude" },
  { value: "anthropic-api", label: "Anthropic API" },
  { value: "openai-api", label: "OpenAI API" },
  { value: "gemini", label: "Gemini" },
  { value: "windsurf", label: "Windsurf" },
];

const USE_CASES = ["coding", "writing", "data", "research", "mixed"];

const DEFAULT_FORM: FormData = {
  tools: [],
  teamSize: 1,
  useCase: "coding",
  email: '',
};

export default function SpendForm() {
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window === "undefined") return DEFAULT_FORM;
    try {
      const saved = localStorage.getItem("spendlens-form");
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_FORM, ...parsed, email: parsed.email || '' };
      }
      return DEFAULT_FORM;
    } catch {
      return DEFAULT_FORM;
    }
  });
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    localStorage.setItem("spendlens-form", JSON.stringify(formData));
  }, [formData]);



  function addTool(toolName: string) {
    const newTool: ToolEntry = {
      id: crypto.randomUUID(),
      toolName,
      plan: "pro",
      seats: 1,
      monthlySpend: 0,
    };
    setFormData((prev) => ({
      ...prev,
      tools: [...prev.tools, newTool],
    }));
  }

  function updateTool(id: string, field: string, value: string | number) {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.map((tool) =>
        tool.id === id ? { ...tool, [field]: value } : tool,
      ),
    }));
  }

  function removeTool(id: string) {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((tool) => tool.id !== id),
    }));
  }

  const availableTools = ALL_TOOLS.filter(
    (t) => !formData.tools.find((added) => added.toolName === t.value),
  );

  async function handleSubmit() {
    if (formData.tools.length === 0) {
      alert("Please add at least one tool");
      return;
    } 
    setIsLoading(true);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          email: formData.email || null
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      window.location.href = `/audit/${result.id}`;
    } catch (err) {
      console.error(err);
      alert("Something went wrong, Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-white mb-2">
        Audit Your AI Spend
      </h2>
      <p className="text-gray-400 mb-8">
        Add the AI tools your team pays for and we will find where you can save.
      </p>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
        <h3 className="text-white font-semibold mb-4">Team Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="team-size"
              className="text-gray-400 text-sm mb-1 block"
            >
              Team Size
            </label>
            <input
              id="team-size"
              type="number"
              min="1"
              value={formData.teamSize}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  teamSize: parseInt(e.target.value) || 1,
                }))
              }
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="use-case"
              className="text-gray-400 text-sm mb-1 block"
            >
              Primary Use Case
            </label>
            <select
              id="use-case"
              value={formData.useCase}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, useCase: e.target.value }))
              }
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              {USE_CASES.map((uc) => (
                <option key={uc} value={uc} className="bg-gray-900">
                  {uc.charAt(0).toUpperCase() + uc.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label
              htmlFor="email"
              className="text-gray-500 text-sm mb-1 block">
                Email <span className="text-gray-500">( optional - get notified when prices change)</span>
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="you@company.com"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
          />

        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6"
            suppressHydrationWarning 
          >
        {formData.tools.map((tool) => (
          <ToolCard
            key={tool.id}
            toolEntry={tool}
            onUpdate={updateTool}
            onRemove={removeTool}
          />
        ))}
      </div>

      {availableTools.length > 0 && (
        <div className="mb-8">
          <p className="text-gray-400 text-sm mb-2">Add a tool:</p>
          <div className="flex flex-wrap gap-2">
            {availableTools.map((tool) => (
              <button
                key={tool.value}
                onClick={() => addTool(tool.value)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                + {tool.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isLoading || formData.tools.length === 0}
        className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-6 text-lg"
      >
        {isLoading ? "Analyzing..." : "Get My Free Audit →"}
      </Button>
    </div>
  );
}
