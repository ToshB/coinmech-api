export default class Config {
  public databaseURL?: string;
  public port: string;
  public google: {
    clientId?: string;
    clientSecret?: string;
  };

  constructor() {
    this.port = process.env.PORT || '4000';
    this.google = {
      clientId: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET
    };

    this.databaseURL = process.env.DATABASE_URL
  }
}