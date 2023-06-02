// js/main.jsを読み込む
const head = document.head;
const script = document.createElement('script');
script.src = chrome.runtime.getURL('js/main.js');
head.appendChild(script);

// material iconを読み込む
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
head.appendChild(link);