import { Metadata } from 'next';
import PrivacyRightsView from './_components/privacy-rights-view';

export const metadata: Metadata = {
  title: 'Privacy Rights | PrivacyGuard',
  description: 'Manage and exercise statutory Data Principal privacy rights under DPDP Act 2023.'
};

export default function PrivacyRightsPage() {
  return <PrivacyRightsView />;
}
