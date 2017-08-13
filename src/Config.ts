interface CoinmechConfig {
  port: string;
  databaseURL: string;
  google?: {
    clientId?: string;
    clientSecret?: string;
  };
}

function readEnv(property: string) {
  return process.env[property];
}

function readRequiredEnv(property: string) {
  const value = readEnv(property);
  if (!value) {
    throw new Error(`Missing required environment variable \'${property}\'`);
  }

  return value;
}

export default class Config {
  databaseURL: string;
  port: string;
  google?: {
    clientId?: string;
    clientSecret?: string;
  };

  constructor(config: CoinmechConfig) {
    this.databaseURL = config.databaseURL;
    this.port = config.port;
    this.google = config.google;
  }

  static fromEnv() {
    return new Config({
      port: readEnv('PORT') || '4000',
      google: {
        clientId: readEnv('GOOGLE_CLIENTID'),
        clientSecret: readEnv('GOOGLE_CLIENTSECRET')
      },
      databaseURL: readRequiredEnv('DATABASE_URL')
    });
  }
}