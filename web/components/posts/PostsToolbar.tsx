import React from 'react';
import { PostType } from '@/lib/types';

const TYPE_LABELS: Record<PostType, string> = {
  ItemAvailable: 'Item Available',
  PickupRequest: 'ASAP Pickup',
};

export interface PostsToolbarProps {
  filterType: PostType | 'All';
  searchArea: string;
  onFilterTypeChange: (type: PostType | 'All') => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
}

export function PostsToolbar({
  filterType,
  searchArea,
  onFilterTypeChange,
  onSearchChange,
  onClearSearch,
}: PostsToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-border shadow-sm">
      <div className="flex items-center gap-1.5 flex-wrap">
        {(['All', 'ItemAvailable', 'PickupRequest'] as const).map((t) => (
          <button
            key={t}
            onClick={() => onFilterTypeChange(t)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
              filterType === t
                ? 'bg-primary border-primary text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t === 'All' ? 'All Types' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="relative flex-1 max-w-sm">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center w-4 h-4">
          <svg className="w-4 h-4 shrink-0 overflow-visible" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
          </svg>
        </div>
        <input
          type="text"
          value={searchArea}
          onChange={onSearchChange}
          placeholder="Search pickup area (e.g. Kallio)..."
          className="w-full pl-10 pr-9 py-2.5 h-10 text-sm leading-normal rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-foreground"
        />
        {searchArea && (
          <button
            onClick={onClearSearch}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
