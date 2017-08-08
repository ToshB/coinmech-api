export default class Config {
  public databaseURL?: string;
  public port: string;
  public facebook: {
    appId?: string;
    secret?: string;
  };
  public google: {
    clientId?: string;
    clientSecret?: string;
  };

  constructor() {
    this.port = process.env.PORT || '4000';
    this.facebook = {
      appId: process.env.FACEBOOK_APPID,
      secret: process.env.FACEBOOK_SECRET
    };
    this.google = {
      clientId: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET
    };

    this.databaseURL = process.env.DATABASE_URL
  }
}