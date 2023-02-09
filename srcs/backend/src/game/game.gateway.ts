import { WebSocketGateway } from '@nestjs/websockets';
import { GameService } from './game.service';
import {
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('ping')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    client.emit('pong', data.split('').reverse().join(''));
    console.log(client.id);
  }

  @SubscribeMessage('play')
  handleGame(@ConnectedSocket() client: Socket) {
    this.gameService.startGame(client);
  }

  @SubscribeMessage('send-line')
  sendLine(@MessageBody() lines: number, @ConnectedSocket() client: Socket) {
    this.gameService.sendLineToOpponent(client, lines);
  }

  @SubscribeMessage('game-over')
  concludeGame(@ConnectedSocket() client: Socket) {
    this.gameService.reportGameOver(client);
  }
}
