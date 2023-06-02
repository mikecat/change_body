"use strict";

window.addEventListener("DOMContentLoaded", function() {
	loadImages([
		"board.png",
		"body_left.png", "head_left.png",
		"body_right.png", "head_right.png",
	]).then(function(imgs) {
		initializeSimpleApp({
			"leftPerson": {
				"head": {
					"img": imgs.head_left,
					"x": 242,
					"yOffset": 0,
				},
				"body": {
					"img1": imgs.body_left,
					"x1": 3,
					"marginUp1": 0,
					"img2": imgs.body_right,
					"x2": 233,
					"marginUp2": 0,
					"yBase": 2037,
				},
			},
			"rightPerson": {
				"head": {
					"img": imgs.head_right,
					"x": 1450,
					"yOffset": 0,
				},
				"body": {
					"img1": imgs.body_right,
					"x1": 1460,
					"marginUp1": 0,
					"img2": imgs.body_left,
					"x2": 1230,
					"marginUp2": 0,
					"yBase": 2046,
				},
			},
			"bgColor": "#ffffff",
			"bgImages": [
				{
					"img": imgs.board,
					"x": 779,
					"y": 0,
				},
			],
		});
	}, function(error) {
		console.error(error);
		alert("画像の読み込みに失敗しました。");
	});
});
