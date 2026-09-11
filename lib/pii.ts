/**
 * PrivacyGuard - PII (Personally Identifiable Information) Masking Utility
 * Implements data minimization and privacy-by-design under the DPDP Act.
 */

/**
 * Masks an email address preserving only the initial character and the domain.
 * e.g. "priya.sharma@example.com" -> "p***a@example.com"
 */
export function maskEmail(email?: string | null): string {
  if (!email || typeof email !== 'string') return 'N/A';
  const parts = email.split('@');
  if (parts.length !== 2) return '***';

  const [username, domain] = parts;
  if (username.length <= 2) {
    return `${username[0]}***@${domain}`;
  }

  const maskedUser = `${username[0]}${'*'.repeat(Math.min(username.length - 2, 5))}${username[username.length - 1]}`;
  return `${maskedUser}@${domain}`;
}

/**
 * Masks a phone number showing only country code and the last 4 digits.
 * e.g. "+91 9876543210" -> "+91 ******3210"
 * e.g. "9876543210" -> "******3210"
 */
export function maskPhone(phone?: string | null): string {
  if (!phone || typeof phone !== 'string') return 'N/A';
  const digitsOnly = phone.replace(/[^\d+]/g, '');
  if (digitsOnly.length <= 4) return '****';

  const lastFour = digitsOnly.slice(-4);
  const prefix = digitsOnly.startsWith('+') ? digitsOnly.slice(0, 3) + ' ' : '';
  return `${prefix}******${lastFour}`;
}

/**
 * Masks a full name for display where full disclosure is restricted.
 * e.g. "Rohan Kumar" -> "R*** K***"
 */
export function maskName(name?: string | null): string {
  if (!name || typeof name !== 'string') return 'N/A';
  const words = name.trim().split(/\s+/);
  return words
    .map((w) => (w.length > 1 ? `${w[0]}***` : w))
    .join(' ');
}
