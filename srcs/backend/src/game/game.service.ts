import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
  private players: Array<Socket>;

  constructor() {
    this.players = new Array<Socket>();
  }

  startGame(client: Socket) {
    if (this.players.length < 2) {
      this.players.push(client);
    }

    if (this.players.length === 2) {
      this.players.forEach((socket) => socket.emit('ready'));
    }
  }

  sendLineToOpponent(client: Socket, lines: number) {
    this.players[0] === client
      ? this.players[1].emit('receive-line', lines)
      : this.players[0].emit('receive-line', lines);
  }
}
