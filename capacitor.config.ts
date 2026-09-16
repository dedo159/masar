import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.masar.app',
  appName: 'Masar',
  webDir: 'public',
  server: {
    url: 'https://masar-eight-sage.vercel.app',
    cleartext: true
  }
};

export default config;
