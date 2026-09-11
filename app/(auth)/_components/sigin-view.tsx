import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from './user-auth-form';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign In | PrivacyGuard',
  description: 'Sign in to PrivacyGuard DPDP Consent & Privacy Management Platform.'
};

export default function SignInViewPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950" />

        <div className="relative z-20 flex items-center text-xl font-bold tracking-tight">
          <ShieldCheck className="mr-2 h-7 w-7 text-indigo-400" />
          <span>PrivacyGuard</span>
          <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            DPDP Compliant
          </span>
        </div>

        <div className="relative z-20 my-auto space-y-4 max-w-md">
          <h2 className="text-2xl font-semibold leading-snug">
            Consent & Privacy Governance for the Modern Enterprise
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Manage granular data principal consent lifecycle, enforce purpose limitation, streamline privacy rights requests, and maintain immutable audit trails in full compliance with India&apos;s Digital Personal Data Protection (DPDP) Act.
          </p>

          <div className="space-y-2 pt-4 text-sm text-zinc-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Granular Notice & Consent Life-Cycle Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Data Principal Rights (Access, Correction, Erasure)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Immutable Audit Logs & PII Masking Architecture</span>
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-auto border-t border-zinc-800/80 pt-4">
          <blockquote className="space-y-1">
            <p className="text-sm italic text-zinc-400">
              &ldquo;Consent must be free, specific, informed, unconditional and unambiguous with a clear affirmative action.&rdquo;
            </p>
            <footer className="text-xs text-zinc-500">— DPDP Act, Section 6(1)</footer>
          </blockquote>
        </div>
      </div>

      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[360px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="inline-flex items-center justify-center p-2 mx-auto mb-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-full text-indigo-600 dark:text-indigo-400 lg:hidden">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Sign In to PrivacyGuard
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the Privacy Governance Portal.
            </p>
          </div>
          <UserAuthForm />
          <p className="px-6 text-center text-xs text-muted-foreground">
            Protected by enterprise-grade cryptographic session control and compliant with DPDP data fiduciary guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
