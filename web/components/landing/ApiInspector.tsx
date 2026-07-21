import React, { useState } from 'react';

export interface ApiInspectorProps {
  meData: unknown;
  error: string | null;
}

export function ApiInspector({ meData, error }: ApiInspectorProps) {
  const [showRawApi, setShowRawApi] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
      <button
        onClick={() => setShowRawApi(!showRawApi)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200/60 transition-colors cursor-pointer"
      >
        <span>Portfolio Inspection: /api/auth/me response</span>
        <span>{showRawApi ? 'Hide' : 'Show'}</span>
      </button>
      
      {showRawApi && (
        <div className="p-4 border-t border-slate-200 bg-slate-950 text-slate-200 font-mono text-xs overflow-auto max-h-60">
          {error ? (
            <p className="text-rose-400">{error}</p>
          ) : meData ? (
            <pre>{JSON.stringify(meData, null, 2)}</pre>
          ) : (
            <p className="text-slate-400">Loading token check...</p>
          )}
        </div>
      )}
    </div>
  );
}
