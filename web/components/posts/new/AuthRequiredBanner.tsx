import React from 'react';
import { Button } from '@/components/ui/Button';

export function AuthRequiredBanner() {
  return (
    <div className="max-w-md mx-auto py-12 text-center space-y-4">
      <div className="flex justify-center text-slate-400 mb-2">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Authentication Required</h1>
      <p className="text-slate-500 text-sm">
        Please sign in or create an account before posting a delivery request.
      </p>
      <div className="pt-4">
        <a href="/login">
          <Button variant="primary">Sign In Now</Button>
        </a>
      </div>
    </div>
  );
}
