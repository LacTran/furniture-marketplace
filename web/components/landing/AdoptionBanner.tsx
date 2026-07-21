import React from 'react';
import { Button } from '@/components/ui/Button';

export function AdoptionBanner() {
  return (
    <div className="cta-banner">
      <h2 className="text-2xl font-bold text-slate-900">Have a piece of furniture waiting to be moved?</h2>
      <p className="text-slate-600 text-sm max-w-lg mx-auto">
        Join the Kyydissä community to post your delivery request in less than two minutes.
      </p>
      <div>
        <a href="/register">
          <Button variant="primary">Create Your Account</Button>
        </a>
      </div>
    </div>
  );
}
