'use client';

import { ConsentPieGraph } from './pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { RecentConsents } from './recent-consents';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/client';

export default function OverViewPage() {

  const [totalPolicies, setTotalPolicies] = useState<number>(0);
  const [totalAgreements, setTotalAgreements] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalConsents, setTotalConsents] = useState<number>(0);
  const [totalAudits, setTotalAudits] = useState<number>(0);

  useEffect(() => {
    const fetchTotalPolicies = async () => {
      const { data, error } = await supabase
        .from('Policy')
        .select('policy_id', { count: 'exact' });
      
      if (error) {
        console.error('Error fetching policies:', error.message);
        return;
      }
      
      setTotalPolicies(data?.length || 0); 
    };

    fetchTotalPolicies();
  }, []); 

  useEffect(() => {
    const fetchTotalAgreements = async () => {
      const { data, error } = await supabase
        .from('Agreement')
        .select('agreement_id', { count: 'exact' });
      
      if (error) {
        console.error('Error fetching policies:', error.message);
        return;
      }
      
      setTotalAgreements(data?.length || 0); 
    };

    fetchTotalAgreements();
  }, []); 

  useEffect(() => {
    const fetchTotalUsers = async () => {
      const { count, error } = await supabase
        .from('User') 
        .select('*', { count: 'exact' });  
      console.log("🚀 ~ fetchTotalUsers ~ count:", count)

      if (error) {
        console.error('Error fetching users:', error.message);
        return;
      }

      setTotalUsers(count || 0); 
    };

    fetchTotalUsers();
  }, []); 

  useEffect(() => {
    const fetchTotalConsents = async () => {
      const { count, error } = await supabase
        .from('Consent_Record') 
        .select('*', { count: 'exact' });  
      console.log("🚀 ~ fetchTotalConsents ~ count:", count)

      if (error) {
        console.error('Error fetching users:', error.message);
        return;
      }

      setTotalConsents(count || 0); 
    };

    fetchTotalConsents();
  }, []); 

  useEffect(() => {
    const fetchTotalAudits = async () => {
      const { count, error } = await supabase
        .from('audit_log') 
        .select('*', { count: 'exact' });  
      console.log("🚀 ~ fetchTotalAudits ~ count:", count)

      if (error) {
        console.error('Error fetching users:', error.message);
        return;
      }

      setTotalAudits(count || 0); 
    };

    fetchTotalAudits();
  }, []); 

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            PrivacyGuard Compliance Overview 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time DPDP consent governance and data fiduciary compliance telemetry.
          </p>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Privacy Policies</CardTitle>
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPolicies}</div>
                  <p className="text-xs text-muted-foreground">
                    Fiduciary policies configured
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAgreements}</div>
                  <p className="text-xs text-muted-foreground">
                    Consent notices published
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Data Principals</CardTitle>
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered individuals
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Consent Records</CardTitle>
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalConsents}</div>
                  <p className="text-xs text-muted-foreground">
                    Logged consent transactions
                  </p>
                </CardContent>
              </Card>
              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Audit Records</CardTitle> */}
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg> */}
                  {/* <img width="30" height="30" src="https://img.icons8.com/ios/50/1A1A1A/accounting.png" alt="accounting"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAudits}</div>
                  <p className="text-xs text-muted-foreground">
                    Total number of audit records
                  </p>
                </CardContent>
              </Card> */}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <ConsentPieGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Consents</CardTitle>
                  <CardDescription>
                    Consent Status With Users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentConsents />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
