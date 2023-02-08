<script setup lang="ts">
import { ref } from 'vue'
import Board from './components/Board.vue'
import { board } from './components/board'
import { io } from 'socket.io-client'

const waiting = ref(false)

function play(): void {
	const ioSocket = io('http://10.11.11.3:3000');
	ioSocket.emit('play');
	waiting.value = true;

	ioSocket.on('ready', () => {
		waiting.value = false;
		board.value.startGameLoop(ioSocket);
	});

	ioSocket.on('receive-line', (line) => {
		console.log(line);
	});
}

const gameBoard = ref<InstanceType<typeof Board>>();
</script>

<template>
<head>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Press+Start+2P"/>
</head>
<h1>TETRIS</h1>
<Board/>
<button @click="play();" class="play-button">Play</button>
<h3 v-if="waiting">Waiting for an opponent...</h3>
</template>

<style>
*
{
	margin: 0px;
	padding: 0px;
	box-sizing: border-box;
}

h1, p, .play-button
{
	font-family: 'Press Start 2P', cursive;
}

.play-button
{
	background-color: #4caf50;
	font-size: 16px;
	padding: 15px 30px;
	cursor: pointer;
}
</style>
