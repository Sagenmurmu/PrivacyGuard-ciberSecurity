import { supabase } from './client';
import { v4 as uuidv4 } from 'uuid';

export type AuditAction =
  | 'LOGIN'
  | 'CONSENT_GRANTED'
  | 'CONSENT_REVOKED'
  | 'DATA_ACCESS_REQUESTED'
  | 'DATA_DELETION_REQUESTED';

export interface CreateAuditLogParams {
  action: AuditAction;
  entity_type?: string;
  entity_id?: string;
  consent_status?: string;
  actor_email?: string;
  details?: string;
}

/**
 * Log compliance and consent lifecycle events to the audit log.
 * Aligned with DPDP Act accountability and fiduciary recordkeeping standards.
 */
export async function logAuditEvent(params: CreateAuditLogParams): Promise<boolean> {
  const logEntry = {
    log_id: uuidv4(),
    action: params.action,
    entity_type: params.entity_type || 'DATA_PRINCIPAL',
    entity_id: params.entity_id || uuidv4(),
    consent_status: params.consent_status || (params.action === 'CONSENT_GRANTED' ? 'Opt-in' : params.action === 'CONSENT_REVOKED' ? 'Opt-out' : 'N/A'),
    created_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from('audit_log').insert([logEntry]);
    if (error) {
      console.warn('Supabase audit_log insert failed, falling back to local audit buffer:', error.message);
      // Resilient local caching
      if (typeof window !== 'undefined') {
        const localLogs = JSON.parse(localStorage.getItem('privacyguard_audit_fallback') || '[]');
        localLogs.unshift({ ...logEntry, ...params });
        localStorage.setItem('privacyguard_audit_fallback', JSON.stringify(localLogs.slice(0, 100)));
      }
      return false;
    }
    return true;
  } catch (err) {
    console.error('Unexpected error recording audit event:', err);
    return false;
  }
}
