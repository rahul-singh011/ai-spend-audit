"use client";

import { useState } from "react";
import { Button } from "../ui/button";

interface LeadCaptureModalProps {
  auditId: string;
  totalMonthlySavings: number;
  onClose: () => void;
}

export default function LeadCaptureModal({
  auditId,
  totalMonthlySavings,
  onClose,
}: LeadCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const cleanEmail = email.trim()

    if (! cleanEmail || !cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid email"); 
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email : cleanEmail,
          companyName,
          role,
          auditId,
          totalMonthlySavings,
          website: "",
        }),
      });

      const data = await response.json()
      console.log('leads response:', data)

      if (!response.ok) throw new Error("Failed to save");
      setIsDone(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#111] border border-white/20 rounded-2xl p-8 max-w-md w-full">
        {isDone ? (
         
          <div className="text-center">
            <div className="text-4xl mb-4">📤</div>
            <h2 className="text-xl font-bold text-white mb-2">Report sent!</h2>
            <p className="text-gray-400 text-sm mb-6">
              Check your inbox for your audit summary.
              {totalMonthlySavings > 500 && (
                <span className="text-green-400">
                  {" "}
                  Our team will reach out about your savings opportunity.
                </span>
              )}
            </p>
            <Button
              onClick={onClose}
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              Back to Results
            </Button>
          </div>
        ) : (
       
          <>
            <h2 className="text-xl font-bold text-white mb-1">
              Save your audit report
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Get your results emailed to you.
              {totalMonthlySavings > 500 && (
                <span className="text-green-400">
                  {" "}
                  High savings detected — Credex will reach out.
                </span>
              )}
            </p>

            <div className="flex flex-col gap-3">
             
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>

             
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Company name <span className="text-gray-600">(optional)</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Inc."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>

            
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Your role <span className="text-gray-600">(optional)</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="CTO, Engineering Manager..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>


              <input
                type="text"
                name="website"
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 mt-2"
              >
                {isLoading ? "Sending..." : "Email me my report →"}
              </Button>

              <button
                onClick={onClose}
                className="text-gray-500 text-sm hover:text-gray-400 text-center"
              >
                No thanks, I will just view it here
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
