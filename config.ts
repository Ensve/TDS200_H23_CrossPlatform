interface Config {
    googleMapsApiKey: string;
}

const configFile: Config = {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '{Your api key}',
};

export default configFile;
