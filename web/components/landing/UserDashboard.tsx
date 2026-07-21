import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AuthUser } from '@/lib/auth-store';

export interface UserDashboardProps {
  user: AuthUser | null;
}

export function UserDashboard({ user }: UserDashboardProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 space-y-4">
        <CardTitle className="text-foreground">Profile Snapshot</CardTitle>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-background rounded-xl border border-border">
            <span className="block text-[11px] text-primary font-bold uppercase">Email</span>
            <span className="font-semibold text-foreground">{user?.email}</span>
          </div>
          <div className="p-3 bg-background rounded-xl border border-border">
            <span className="block text-[11px] text-primary font-bold uppercase">Account Roles</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {user?.roles.map((role) => (
                <Badge key={role} variant="purple">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <a
            href="/posts"
            className="text-sm font-bold text-primary hover:opacity-80 transition-opacity inline-flex items-center gap-1"
          >
            Browse active delivery marketplace &rarr;
          </a>
        </div>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-foreground">Driver Portal</CardTitle>
          <CardDescription>
            Earn side-income while commuting by carrying furniture in your trunk.
          </CardDescription>
        </CardHeader>
        <div className="bg-background border border-border rounded-xl p-3 text-xs text-primary font-medium mt-4">
          Use our Expo mobile companion app to accept jobs on the go.
        </div>
      </Card>
    </div>
  );
}
