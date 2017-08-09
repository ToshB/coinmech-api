import CreditsRepository from "./CreditsRepository";
import PlayerRepository from "./PlayerRepository";
import Config from "../Config";

export default class Deps {
  public creditsRepository: CreditsRepository;
  public playerRepository: PlayerRepository;
  public config: Config;

  constructor(config: Config) {
    this.config = config;
    this.creditsRepository = new CreditsRepository();
    this.playerRepository = new PlayerRepository(config);
  }
}