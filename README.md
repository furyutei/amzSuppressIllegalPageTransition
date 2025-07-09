[不正なページ遷移抑制(Amazon.co.jp)](https://github.com/furyutei/amzSuppressIllegalPageTransition)
===

- License: The MIT license  
- Copyright (c) 2025 風柳(furyu)  
- 対象ブラウザ： Google Chrome、Firefox  

[Amazon.co.jp](https://www.amazon.co.jp/)の商品ページで、準備完了前に[リストに追加]ボタンを押すと[不正なページ遷移](https://www.amazon.co.jp/gp/product/handle-buy-box)が発生してしまう不具合を抑制。  


■ インストール方法 
---
### ユーザースクリプト
Google Chrome＋[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) や Firefox＋[Violentmonkey](https://addons.mozilla.org/ja/firefox/addon/violentmonkey/) 等のユーザースクリプトが動作可能な環境で、  

> [不正なページ遷移抑制](https://furyutei.github.io/amzSuppressIllegalPageTransition/src/js/amzSuppressIllegalPageTransition.user.js)  
                                
をクリックし、指示に従ってインストール。  


■ 動作について
---
[リストに追加]ボタンの準備ができるまでボタンを非表示にしておき、準備ができた段階で表示されるようにすることによって、誤動作を防止する。  
