interface Config {
    googleMapsApiKey: string;
}

const configFile: Config = {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCawbJau65Yyc0dqez7SThsG9lHaGfIkFo',
};

export default configFile;