interface CoinmechConfig {
  port: string;
  databaseURL: string;
  google?: {
    clientId?: string;
    clientSecret?: string;
  };
  adminUsername: string;
  adminPassword: string;
  jwtHmacSecret: string;
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
  adminPassword: string;
  adminUsername: string;
  jwtHmacSecret: string;
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
    this.adminUsername = config.adminUsername;
    this.adminPassword = config.adminPassword;
    this.jwtHmacSecret = config.jwtHmacSecret;
  }

  static fromEnv() {
    return new Config({
      port: readEnv('PORT') || '4000',
      google: {
        clientId: readEnv('GOOGLE_CLIENTID'),
        clientSecret: readEnv('GOOGLE_CLIENTSECRET')
      },
      databaseURL: readRequiredEnv('DATABASE_URL'),
      adminPassword: readRequiredEnv('ADMIN_PASSWORD'),
      adminUsername: readRequiredEnv('ADMIN_USERNAME'),
      jwtHmacSecret: readRequiredEnv('JWT_HMAC_SECRET')
    });
  }
}