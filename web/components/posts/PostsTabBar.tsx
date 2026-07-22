import React from 'react';

export type ViewTab = 'market' | 'favorites' | 'mine';

export interface PostsTabBarProps {
  activeTab: ViewTab;
  favoritedCount: number;
  onSelectTab: (tab: ViewTab) => void;
}

export function PostsTabBar({ activeTab, favoritedCount, onSelectTab }: PostsTabBarProps) {
  return (
    <div className="flex border-b border-border">
      <button
        onClick={() => onSelectTab('market')}
        className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
          activeTab === 'market'
            ? 'border-primary text-primary'
            : 'border-transparent text-slate-500 hover:text-slate-800'
        }`}
      >
        Open Market
      </button>
      <button
        onClick={() => onSelectTab('favorites')}
        className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
          activeTab === 'favorites'
            ? 'border-primary text-primary'
            : 'border-transparent text-slate-500 hover:text-slate-800'
        }`}
      >
        Saved ({favoritedCount})
      </button>
      <button
        onClick={() => onSelectTab('mine')}
        className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
          activeTab === 'mine'
            ? 'border-primary text-primary'
            : 'border-transparent text-slate-500 hover:text-slate-800'
        }`}
      >
        My Postings
      </button>
    </div>
  );
}
