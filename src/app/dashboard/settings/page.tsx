import { getSettings } from './actions';
import SettingsModule from '@/components/dashboard/settings/SettingsModule';

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <SettingsModule initialSettings={settings} />
  );
}
