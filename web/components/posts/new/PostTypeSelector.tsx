import React from 'react';
import { PostType } from '@/lib/types';

export interface PostTypeSelectorProps {
  selectedType: PostType;
  onSelectType: (type: PostType) => void;
}

export function PostTypeSelector({ selectedType, onSelectType }: PostTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-foreground">Post Type</label>
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onSelectType('ItemAvailable')}
          className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-colors cursor-pointer ${
            selectedType === 'ItemAvailable'
              ? 'border-primary bg-background ring-1 ring-primary/20'
              : 'border-border bg-white hover:bg-slate-50'
          }`}
        >
          <div className="p-2 rounded-lg bg-muted text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <span className="block font-bold text-foreground text-sm">Item Available</span>
            <span className="block text-slate-500 text-xs mt-1">
              Item is available for flexible pickup scheduling by local drivers.
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectType('PickupRequest')}
          className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-colors cursor-pointer ${
            selectedType === 'PickupRequest'
              ? 'border-primary bg-background ring-1 ring-primary/20'
              : 'border-border bg-white hover:bg-slate-50'
          }`}
        >
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <span className="block font-bold text-foreground text-sm">ASAP Delivery</span>
            <span className="block text-slate-500 text-xs mt-1">
              Urgent pickup request needing immediate transport.
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
