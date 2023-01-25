<script setup lang="ts">
import Board from './components/Board.vue'
</script>

<template>
<head>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Press+Start+2P"/>
</head>
<h1>TETRIS</h1>
<Board />
</template>

<style>

*
{
	margin: 0px;
	padding: 0px;
	box-sizing: border-box;
}

h1, p
{
	font-family: 'Press Start 2P', cursive;
}
</style>
