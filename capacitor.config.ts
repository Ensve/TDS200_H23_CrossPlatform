import { CapacitorConfig } from '@capacitor/cli';
import configFile from "./config";


const config: CapacitorConfig = {
  appId: 'io.ionic.starter.eksamen2023',
  appName: 'Exam2023',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {

    GoogleMapsPlugin: {

      apiKey: configFile.googleMapsApiKey
    }

  }
};

export default config;
