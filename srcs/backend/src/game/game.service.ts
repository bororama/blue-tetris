import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
  private players: Array<Socket>;

  constructor() {
    this.players = new Array<Socket>();
  }

  startGame(client: Socket) {
    console.log(`Client : ${client.id}`);
    if (this.players.length < 2 && this.players.find((e) => {
      e === client;
    }) === undefined) {
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

  reportGameOver(loser : Socket) {
    let winner : Socket = this.players[0] == loser ?
    this.players[1] : this.players[0];

    winner.emit('stop-game', true);
    loser.emit('stop-game', false);
    this.players = [];
  }
}
