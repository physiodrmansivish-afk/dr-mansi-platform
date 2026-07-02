'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const getSettingsFilePath = () => {
  return path.join(process.cwd(), 'src', 'lib', 'data', 'settings.json');
};

export async function getSettings() {
  try {
    const filePath = getSettingsFilePath();
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read settings:', error);
    // Return empty defaults if fail
    return {
      workingHours: { days: [], startTime: '09:00', endTime: '18:00', slotDuration: 60 },
      serviceAreas: [],
      services: [],
      clinicInfo: { name: '', phone: '', whatsappNumber: '', address: '' },
      whatsappTemplates: []
    };
  }
}

export async function updateSettingsSection(section: string, data: any) {
  try {
    const filePath = getSettingsFilePath();
    const currentDataRaw = await fs.readFile(filePath, 'utf8');
    const currentSettings = JSON.parse(currentDataRaw);

    currentSettings[section] = data;

    await fs.writeFile(filePath, JSON.stringify(currentSettings, null, 2), 'utf8');
    
    revalidatePath('/dashboard/settings');
    // Also revalidate public routes where these settings might be used
    revalidatePath('/en/book');
    revalidatePath('/mr/book');
    revalidatePath('/en/areas');
    revalidatePath('/mr/areas');
    
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to update settings section ${section}:`, error);
    return { error: error.message || 'Failed to update settings' };
  }
}
