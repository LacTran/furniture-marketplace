import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';

export function FeatureGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card hoverEffect>
        <div className="icon-badge-purple">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <CardTitle className="mb-2 text-foreground">Rescue &amp; Rehome</CardTitle>
        <CardDescription>
          Bought a chair on Tori.fi or Kierrätyskeskus? Post what needs moving, set your price, and let a neighbor pick it up.
        </CardDescription>
      </Card>

      <Card hoverEffect>
        <div className="icon-badge-purple">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <CardTitle className="mb-2 text-foreground">Commuter Trunk Sharing</CardTitle>
        <CardDescription>
          Drivers browse requests along their existing commute routes and accept jobs that match their spare trunk capacity.
        </CardDescription>
      </Card>

      <Card hoverEffect>
        <div className="icon-badge-emerald">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11a2 2 0 00-2-2h-1c-1.1 0-2-.9-2-2V4.055M11 20a9 9 0 100-18 9 9 0 000 18z" />
          </svg>
        </div>
        <CardTitle className="mb-2 text-foreground">Sustainable &amp; Affordable</CardTitle>
        <CardDescription>
          Eliminates minimum callout fees from large van services while reducing landfill waste and urban emissions.
        </CardDescription>
      </Card>
    </div>
  );
}
