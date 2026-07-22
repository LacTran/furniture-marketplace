import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function HeroSection() {
  return (
    <div className="text-center max-w-2xl mx-auto space-y-6">
      <Badge variant="purple" className="px-3 py-1.5 text-xs font-semibold tracking-wide">
        Urban Furniture Rescue &amp; Rehoming
      </Badge>
      <h1 className="hero-title">
        Give furniture a second home — <br />
        <span className="text-primary">fast, affordable urban delivery.</span>
      </h1>
      <p className="hero-subtitle">
        Kyydissä connects people rehoming secondhand furniture with local drivers who have spare trunk space and are already travelling that way.
      </p>
      <div className="flex justify-center gap-4 pt-2">
        <a href="/register">
          <Button variant="primary" size="lg">Start Rehoming Today</Button>
        </a>
        <a href="/posts">
          <Button variant="secondary" size="lg">Browse Open Listings</Button>
        </a>
      </div>
    </div>
  );
}
