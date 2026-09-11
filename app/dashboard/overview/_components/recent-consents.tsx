import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/client';
import { maskEmail } from '@/lib/pii';
import { formatDistanceToNow } from 'date-fns';

interface Consent {
  consent_id: string;
  created_at: string;
  consent_status: string;
  User?: {
    name?: string;
    email?: string;
    avatar_url?: string;
  } | null;
}

export function RecentConsents() {
  const [consents, setConsents] = useState<Consent[]>([]);

  useEffect(() => {
    async function fetchConsents() {
      const { data, error } = await supabase
        .from('Consent_Record')
        .select('consent_id, consent_status, created_at, User(name, email)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching consents:', error);
      } else if (data) {
        setConsents(data as Consent[]);
      }
    }

    fetchConsents();
  }, []);

  if (consents.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">No consent records found.</p>;
  }

  return (
    <div className="space-y-6">
      {consents.map((consent) => {
        const userName = consent.User?.name || 'Data Principal';
        const userEmail = consent.User?.email ? maskEmail(consent.User.email) : 'Protected Identity';
        const initials = userName
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase() || 'DP';
        const isOptIn = consent.consent_status === 'Opt-in';

        return (
          <div key={consent.consent_id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs font-mono text-muted-foreground">{userEmail}</p>
                <p className="text-[11px] text-muted-foreground">
                  {formatDistanceToNow(new Date(consent.created_at))} ago
                </p>
              </div>
            </div>
            <Badge
              variant={isOptIn ? 'default' : 'destructive'}
              className={`text-xs ${isOptIn ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
            >
              {consent.consent_status}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
