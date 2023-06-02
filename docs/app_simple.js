"use strict";

/*
頭は固定で、体 (頭を除く) を入れ替える機能のあるアプリケーションを開始する。
引数
	config : 以下の構造の設定オブジェクト
		// 「下端の座標」とは、画像の最後の行の次の行の座標である。
		// (下端の座標 = 上端の座標 + 高さ)
		{
			"leftPerson": { // 左の人の情報
				"head": { // 体より手前に描画する頭の情報
					"img": 画像が格納された要素
					"x": 画像を描画する左端のx座標
					"yOffset": 画像を描画する下端の、体の画像の上端からの相対y座標
				},
				"headBack": { // 体より奥に描画する頭の情報 (省略可)
					// 体より手前に描画する頭の情報と同じ構造
				},
				"body": { // 体の情報
					"img1": 変化前の画像が格納された要素
					"x1": 変化前の画像を描画する左端のx座標
					"marginUp1": 変化前の画像の上端に仮想的に追加する透明部分の高さ
					"img2": 変化後の画像が格納された要素
					"x2": 変化後の画像を描画する左端のx座標
					"marginUp2": 変化後の画像の上端に仮想的に追加する透明部分の高さ
					"yBase": 画像を描画する下端のy座標 (変化前/変化後で共通)
				}
			},
			"rightPerson": { // 右の人の情報
				// 左の人の情報と同じ構造
			},
			"bgColor": 背景を塗りつぶす色
			"bgImages": [ // 背景に描画する画像の情報の配列 (省略可)
				// 以下の構造のデータを0要素以上格納する
				{
					"img": 画像が格納された要素
					"x": 画像を描画する左上のx座標
					"y": 画像を描画する左上のy座標
				},
				// ...
			],
		}
返り値
	なし
*/
function initializeSimpleApp(config) {
	const controls = document.getElementById("main-area-control");
	const bodyButtons = createChangeButtons("体 (頭を除く)");
	const configForm = createConfigForm();
	controls.appendChild(bodyButtons.fieldset);
	controls.appendChild(configForm.fieldset);

	let leftChanged = false, rightChanged = false;
	let leftChanging = false, rightChanging = false;
	let changeStartTime = 0, changeDuration = 1, changeFromUp = true;

	const canvas = document.getElementById("main-canvas");
	const canvasCtx = canvas.getContext("2d");

	const drawPerson = function(personInfo, upIs1, upRatio) {
		const bodyInfo = personInfo.body;
		const infoUp = {}, infoDown= {};
		if (upIs1) {
			infoUp.img = bodyInfo.img1;
			infoUp.x = bodyInfo.x1;
			infoUp.marginUp = bodyInfo.marginUp1;
			infoDown.img = bodyInfo.img2;
			infoDown.x = bodyInfo.x2;
			infoDown.marginUp = bodyInfo.marginUp2;
		} else {
			infoUp.img = bodyInfo.img2;
			infoUp.x = bodyInfo.x2;
			infoUp.marginUp = bodyInfo.marginUp2;
			infoDown.img = bodyInfo.img1;
			infoDown.x = bodyInfo.x1;
			infoDown.marginUp = bodyInfo.marginUp1;
		}
		const upHeight = Math.floor((infoUp.img.height + infoUp.marginUp) * upRatio);
		const downHeight = Math.floor((infoDown.img.height + infoDown.marginUp) * (1 - upRatio));
		const bodyUpperY = bodyInfo.yBase - upHeight - downHeight;
		let upDrawDestY = bodyUpperY + infoUp.marginUp, upDrawHeight = upHeight - infoUp.marginUp, upDrawSrcY = 0;
		let downDrawDestY = bodyInfo.yBase - downHeight, downDrawHeight = downHeight, downDrawSrcY = infoDown.img.height - downHeight;
		if (downDrawSrcY < 0) {
			downDrawDestY -= downDrawSrcY;
			downDrawHeight += downDrawSrcY;
			downDrawSrcY = 0;
		}

		if (personInfo.headBack) {
			canvasCtx.drawImage(personInfo.headBack.img, personInfo.headBack.x,
				bodyUpperY + personInfo.headBack.yOffset - personInfo.headBack.img.height);
		}
		if (upDrawHeight > 0) {
			canvasCtx.drawImage(infoUp.img,
				0, upDrawSrcY, infoUp.img.width, upDrawHeight,
				infoUp.x, upDrawDestY, infoUp.img.width, upDrawHeight);
		}
		if (downDrawHeight > 0) {
			canvasCtx.drawImage(infoDown.img,
				0, downDrawSrcY, infoDown.img.width, downDrawHeight,
				infoDown.x, downDrawDestY, infoDown.img.width, downDrawHeight);
		}
		canvasCtx.drawImage(personInfo.head.img, personInfo.head.x,
			bodyUpperY + personInfo.head.yOffset - personInfo.head.img.height);
		
	};

	const updateCanvas = function(animationPos) {
		canvasCtx.fillStyle = config.bgColor;
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
		if (config.bgImages) {
			config.bgImages.forEach(function(imgInfo) {
				canvasCtx.drawImage(imgInfo.img, imgInfo.x, imgInfo.y);
			});
		}
		if (leftChanging) {
			if (changeFromUp) {
				drawPerson(config.leftPerson, !leftChanged, animationPos);
			} else {
				drawPerson(config.leftPerson, leftChanged, 1 - animationPos);
			}
		} else {
			drawPerson(config.leftPerson, !leftChanged, 1);
		}
		if (rightChanging) {
			if (changeFromUp) {
				drawPerson(config.rightPerson, !rightChanged, animationPos);
			} else {
				drawPerson(config.rightPerson, rightChanged, 1 - animationPos);
			}
		} else {
			drawPerson(config.rightPerson, !rightChanged, 1);
		}
	};
	updateCanvas(1);

	const runAnimation = function() {
		const currentTime = performance.now() - changeStartTime;
		if (currentTime < 0) {
			updateCanvas(0);
		} else if (currentTime >= changeDuration) {
			updateCanvas(1);
			bodyButtons.setEnabled(true);
			configForm.setEnabled(true);
			return;
		} else {
			updateCanvas(currentTime / changeDuration);
		}
		requestAnimationFrame(runAnimation);
	};

	const startAnimation = function() {
		const direction = configForm.getDirection();
		const duration = configForm.getDurationMs();
		if (duration < 0) {
			alert("変化時間は非負でなければなりません。");
			return false;
		}
		if (direction === "uptodown") {
			changeFromUp = true;
		} else if (direction === "downtoup") {
			changeFromUp = false;
		} else {
			alert("変化方向が不正です。");
			return false;
		}
		bodyButtons.setEnabled(false);
		configForm.setEnabled(false);
		changeStartTime = performance.now();
		changeDuration = duration;
		requestAnimationFrame(runAnimation);
		return true;
	};

	bodyButtons.leftButton.addEventListener("click", function() {
		if (startAnimation()) {
			leftChanged = !leftChanged;
			leftChanging = true;
			rightChanging = false;
		}
	});
	bodyButtons.centerButton.addEventListener("click", function() {
		if (startAnimation()) {
			leftChanged = !leftChanged;
			rightChanged = !rightChanged;
			leftChanging = true;
			rightChanging = true;
		}
	});
	bodyButtons.rightButton.addEventListener("click", function() {
		if (startAnimation()) {
			rightChanged = !rightChanged;
			leftChanging = false;
			rightChanging = true;
		}
	});
}
