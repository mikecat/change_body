"use strict";

window.addEventListener("DOMContentLoaded", function() {
	loadImages([
		"body_left.png", "head_left.png",
		"body_right.png", "head_right.png",
	]).then(function(imgs) {
		initializeSimpleApp({
			"leftPerson": {
				"head": {
					"img": imgs.head_left,
					"x": 95,
					"yOffset": 0,
				},
				"body": {
					"img1": imgs.body_left,
					"x1": 214,
					"marginUp1": 0,
					"img2": imgs.body_right,
					"x2": 0,
					"marginUp2": 0,
					"yBase": 2031,
				},
			},
			"rightPerson": {
				"head": {
					"img": imgs.head_right,
					"x": 1009,
					"yOffset": 32,
				},
				"body": {
					"img1": imgs.body_right,
					"x1": 966,
					"marginUp1": 0,
					"img2": imgs.body_left,
					"x2": 1180,
					"marginUp2": 0,
					"yBase": 2047,
				},
			},
			"bgColor": "#ffffff",
			"bgImages": [
			],
		});
	}, function(error) {
		console.error(error);
		alert("画像の読み込みに失敗しました。");
	});
});
