import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 px-6 text-center max-w-md mx-auto space-y-3">
      {icon && <div className="flex justify-center text-slate-300">{icon}</div>}
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-slate-500 text-sm">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
