import { Injectable } from '@nestjs/common';
import CommonRepository from 'src/helpers/commonRepository';
import GameRepository from '../repository/game.repository';

@Injectable()
export class GameService extends CommonRepository {
  constructor(private readonly colourBettingRepository: GameRepository) {
    super();
  }
}
