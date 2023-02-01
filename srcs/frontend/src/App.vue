<script setup lang="ts">
import { ref } from 'vue'
import Board from './components/Board.vue'
import { board } from './components/board'

function play(): void{
	/* the match-up part should prolly happen here */
	Board
}

const gameBoard = ref<InstanceType<typeof Board>>();
</script>

<template>
<head>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Press+Start+2P"/>
</head>
<h1>TETRIS</h1>
<Board/>
<button @click="board.startGameLoop()" class="play-button">Play</button>
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
