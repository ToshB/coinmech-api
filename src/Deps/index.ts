import CreditsRepository from "./CreditsRepository";
import PlayerRepository from "./PlayerRepository";
import Config from "../Config";
import FacebookEventLoader from "./FacebookEventLoader";

export default class Deps {
  public facebookEventLoader: FacebookEventLoader;
  public creditsRepository: CreditsRepository;
  public playerRepository: PlayerRepository;
  public config: Config;

  constructor(config: Config) {
    this.config = config;
    this.creditsRepository = new CreditsRepository();
    this.playerRepository = new PlayerRepository();
    this.facebookEventLoader = new FacebookEventLoader(config);
  }
}