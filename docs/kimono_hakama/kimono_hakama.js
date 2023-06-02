"use strict";

window.addEventListener("DOMContentLoaded", function() {
	loadImages([
		"board_left.png", "board_right.png",
		"body_left.png", "head_left.png",
		"body_right.png", "head_right.png",
	]).then(function(imgs) {
		initializeSimpleApp({
			"leftPerson": {
				"head": {
					"img": imgs.head_left,
					"x": 688,
					"yOffset": 30,
				},
				"body": {
					"img1": imgs.body_left,
					"x1": 515,
					"marginUp1": 9,
					"img2": imgs.body_right,
					"x2": 430,
					"marginUp2": 0,
					"yBase": 2082,
				},
			},
			"rightPerson": {
				"head": {
					"img": imgs.head_right,
					"x": 1482,
					"yOffset": 43,
				},
				"body": {
					"img1": imgs.body_right,
					"x1": 1271,
					"marginUp1": 0,
					"img2": imgs.body_left,
					"x2": 1353,
					"marginUp2": 14,
					"yBase": 2097,
				},
			},
			"bgColor": "#ffffff",
			"bgImages": [
				{
					"img": imgs.board_left,
					"x": 2,
					"y": 1228,
				},
				{
					"img": imgs.board_right,
					"x": 2218,
					"y": 1224,
				},
			],
		});
	}, function(error) {
		console.error(error);
		alert("画像の読み込みに失敗しました。");
	});
});
