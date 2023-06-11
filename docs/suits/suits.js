"use strict";

window.addEventListener("DOMContentLoaded", function() {
	loadImages([
		"body_left.png", "head_left.png",
		"body_right.png", "head_right.png", "head_back_right.png",
	]).then(function(imgs) {
		initializeSimpleApp({
			"leftPerson": {
				"head": {
					"img": imgs.head_left,
					"x": 152,
					"yOffset": 23,
				},
				"body": {
					"img1": imgs.body_left,
					"x1": 1,
					"marginUp1": 0,
					"img2": imgs.body_right,
					"x2": 53,
					"marginUp2": 6,
					"yBase": 2037,
				},
			},
			"rightPerson": {
				"head": {
					"img": imgs.head_right,
					"x": 980,
					"yOffset": 17,
				},
				"headBack": {
					"img": imgs.head_back_right,
					"x": 1058,
					"yOffset": 88,
				},
				"body": {
					"img1": imgs.body_right,
					"x1": 876,
					"marginUp1": 0,
					"img2": imgs.body_left,
					"x2": 824,
					"marginUp2": 3,
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
