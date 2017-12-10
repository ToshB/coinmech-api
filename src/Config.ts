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
  particleAccessToken: string;
  mongoURL: string;
  port: string;
  google?: {
    clientId?: string;
    clientSecret?: string;
  };
  postgresURL: string;


  constructor(config: Config) {
    this.mongoURL = config.mongoURL;
    this.port = config.port;
    this.google = config.google;
    this.adminUsername = config.adminUsername;
    this.adminPassword = config.adminPassword;
    this.jwtHmacSecret = config.jwtHmacSecret;
    this.particleAccessToken = config.particleAccessToken;
    this.postgresURL = config.postgresURL;
  }

  static fromEnv() {
    return new Config({
      port: readEnv('PORT') || '4000',
      google: {
        clientId: readRequiredEnv('GOOGLE_CLIENTID'),
        clientSecret: readEnv('GOOGLE_CLIENTSECRET')
      },
      mongoURL: readRequiredEnv('MONGO_URL'),
      adminPassword: readRequiredEnv('ADMIN_PASSWORD'),
      adminUsername: readRequiredEnv('ADMIN_USERNAME'),
      jwtHmacSecret: readRequiredEnv('JWT_HMAC_SECRET'),
      particleAccessToken: readRequiredEnv('PARTICLE_ACCESS_TOKEN'),
      postgresURL: readRequiredEnv('POSTGRES_URL')
    });
  }
}