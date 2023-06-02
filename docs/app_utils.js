"use strict";

/*
画像ファイルを読み込む。
引数
	path : 読み込む画像ファイルのパス (URL) (文字列)
返り値
	読み込んだ画像が入ったHTMLのimg要素で解決するPromise
*/
function loadImage(path) {
	return new Promise(function(resolve, reject) {
		const img = document.createElement("img");
		img.onload = function() {
			resolve(img);
		};
		img.onerror = function(event) {
			reject(event);
		};
		img.src = path;
	});
}

/*
画像ファイル群を読み込む。
引数
	paths : 読み込む画像ファイルのパス (URL) (文字列) の配列
返り値
	指定した画像ファイル全てを読み込めた場合、
	キーを指定したファイル名 (ディレクトリ・拡張子を除く)、
	値を読み込んだ画像が入ったHTMLのimg要素とする連想配列で解決し、
	読み込めなかった画像がある場合拒否されるPromise
*/
function loadImages(paths) {
	return Promise.all(paths.map(loadImage)).then(function(values) {
		const result = {};
		for (let i = 0; i < paths.length; i++) {
			let key = paths[i];
			key = key.replace(/.*\//, "");
			key = key.replace(/\..*?$/, "");
			result[key] = values[i];
		}
		return result;
	});
}

/*
ローカルストレージからデータを読み込む。
引数
	key          : 読み込むデータのキー (文字列)
	defaultValue : 値が無いかエラーが発生した際に返す値 (任意の型)
返り値
	読み込んだデータ (ローカルストレージの仕様上、文字列)
	または、defaultValue (渡されたまま)
*/
function readLocalStorage(key, defaultValue) {
	try {
		const data = localStorage.getItem(key);
		return data === null ? defaultValue : data;
	} catch (e) {
		return defaultValue;
	}
}

/*
ローカルストレージにデータを書き込む。
引数
	key   : 書き込む値のキー (文字列)
	value : 書き込む値 (文字列)
戻り値
	書き込みの成否を表す真理値 (エラーを検出したらfalse、検出しなかったらtrue)
*/
function writeLocalStorage(key, value) {
	try {
		localStorage.setItem(key, value);
		return true;
	} catch (e) {
		return false;
	}
}

/*
「左チェンジ」「両方チェンジ」「右チェンジ」ボタンを作成する。
引数
	label : 枠部分に設定するタイトル
戻り値
	以下のメンバを持つオブジェクト。
		fieldset     : ボタンを囲む枠 (HTML要素)
		leftButton   : 「左チェンジ」ボタン (HTML要素)
		centerButton : 「両方チェンジ」ボタン (HTML要素)
		rightButton  : 「右チェンジ」ボタン (HTML要素)
		setEnabled   : 各ボタンの有効/無効を切り替えるメソッド
*/
function createChangeButtons(label) {
	const fs = document.createElement("fieldset");
	fs.setAttribute("class", "control-field");
	const legend = document.createElement("legend");
	legend.appendChild(document.createTextNode(label));
	fs.appendChild(legend);
	const lb = document.createElement("button");
	lb.setAttribute("class", "control-toggle-left");
	lb.setAttribute("type", "button");
	lb.appendChild(document.createTextNode("左チェンジ"));
	fs.appendChild(lb);
	const cb = document.createElement("button");
	cb.setAttribute("class", "control-toggle-both");
	cb.setAttribute("type", "button");
	cb.appendChild(document.createTextNode("両方チェンジ"));
	fs.appendChild(cb);
	const rb = document.createElement("button");
	rb.setAttribute("class", "control-toggle-right");
	rb.setAttribute("type", "button");
	rb.appendChild(document.createTextNode("右チェンジ"));
	fs.appendChild(rb);
	return {
		"fieldset": fs,
		"leftButton": lb,
		"centerButton": cb,
		"rightButton": rb,
		"setEnabled": function(enable){
			lb.disabled = !enable;
			cb.disabled = !enable;
			rb.disabled = !enable;
		},
	};
}

/*
変化設定のUIを作成する。
戻り値
	以下のメンバを持つオブジェクト。
		fieldset : UIを囲む枠 (HTML要素)
		getDirection : 引数をとらず、変化方向の文字列を返すメソッド
		getDurationMs : 引数をとらず、変化にかける時間(ミリ秒)の数値を返すメソッド
		setEnabled    : 各要素の有効/無効を切り替えるメソッド
*/
function createConfigForm() {
	const fs = document.createElement("fieldset");
	fs.setAttribute("class", "params-field");
	const legend = document.createElement("legend");
	legend.appendChild(document.createTextNode("変化設定 (全ページ共通)"));
	fs.appendChild(legend);
	const directionSelect = document.createElement("select");
	directionSelect.setAttribute("class", "params-direction");
	const options = [];
	options.push(document.createElement("option"));
	options[options.length - 1].setAttribute("value", "uptodown");
	options[options.length - 1].appendChild(document.createTextNode("上から"));
	options.push(document.createElement("option"));
	options[options.length - 1].setAttribute("value", "downtoup");
	options[options.length - 1].appendChild(document.createTextNode("下から"));
	options.forEach(function(o) { directionSelect.appendChild(o); });
	fs.appendChild(directionSelect);
	const speedBar = document.createElement("input");
	speedBar.setAttribute("type", "range");
	speedBar.setAttribute("class", "rparams-speed-bar");
	speedBar.setAttribute("min", "0");
	speedBar.setAttribute("max", "10000");
	speedBar.setAttribute("step", "100");
	fs.appendChild(speedBar);
	const speedInputSpan = document.createElement("span");
	speedInputSpan.setAttribute("class", "params-speed-input");
	const speedInput = document.createElement("input");
	speedInput.setAttribute("type", "number");
	speedInput.setAttribute("min", "0");
	speedInput.setAttribute("size", "8");
	speedInputSpan.appendChild(speedInput);
	speedInputSpan.appendChild(document.createTextNode("ms"));
	fs.appendChild(speedInputSpan);

	const uuid = "73529a43-fb6a-497c-b464-3470fd01783f";
	const directionKey = "bs-change-direction-" + uuid;
	const speedKey = "bs-change-duration-" + uuid;

	const directionRead = readLocalStorage(directionKey, "uptodown");
	const speedRead = readLocalStorage(speedKey, "1000");

	const setDirection = function(value) {
		for (let i = 0; i < options.length; i++) {
			if (options[i].value === value) {
				directionSelect.selectedIndex = i;
				break;
			}
		}
	};
	const setSpeed = function(value) {
		const valueInt = parseInt(value);
		if (isNaN(valueInt) || valueInt < 0) return;
		const valueIntBar = Math.floor(valueInt / 100) * 100;
		speedBar.value = valueIntBar > 10000 ? 10000 : valueIntBar;
		speedInput.value = valueInt;
	};
	setDirection(directionRead);
	setSpeed(speedRead);
	window.addEventListener("storage", function(event) {
		if (event.storageArea === window.localStorage) {
			if (event.key === directionKey) {
				setDirection(event.newValue);
			} else if(event.key === speedKey) {
				setSpeed(event.newValue);
			}
		}
	});

	directionSelect.addEventListener("change", function() {
		writeLocalStorage(directionKey, directionSelect.value);
	});
	speedBar.addEventListener("input", function() {
		speedInput.value = speedBar.value;
	});
	speedBar.addEventListener("change", function() {
		speedInput.value = speedBar.value;
		const value = parseInt(speedInput.value);
		if (!isNaN(value) && value >= 0) writeLocalStorage(speedKey, value);
	});
	speedInput.addEventListener("input", function() {
		const value = parseInt(speedInput.value);
		if (!isNaN(value) && value >= 0) {
			writeLocalStorage(speedKey, value);
			speedBar.value = value;
		}
	});

	return {
		"fieldset": fs,
		"getDirection": function() {
			return directionSelect.value;
		},
		"getDurationMs": function() {
			const value = parseInt(speedInput.value);
			if (isNaN(value)) return -1;
			return value;
		},
		"setEnabled": function(enable){
			directionSelect.disabled = !enable;
			speedBar.disabled = !enable;
			speedInput.disabled = !enable;
		},
	};
}
