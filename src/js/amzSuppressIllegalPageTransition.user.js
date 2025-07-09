// ==UserScript==
// @name            Suppress illegal page transition
// @name:ja         不正なページ遷移抑制
// @namespace       https://furyutei.com/
// @license         MIT
// @version         0.0.1
// @description     Suppress page transitions when pressing the "Add to List" button in preparation
// @description:ja  準備完了前に[リストに追加]ボタンを押すと不正なページ遷移が発生してしまう不具合を抑制
// @author          furyu@fuyutei.com
// @match           https://www.amazon.co.jp/dp/*
// @match           https://www.amazon.co.jp/*/dp/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=amazon.co.jp
// @grant           none
// @run-at          document-start
// @compatible      chrome
// @compatible      firefox
// @supportURL      https://github.com/furyutei/amzSuppressIllegalPageTransition/issues
// @contributionURL https://memo.furyutei.com/about#send_donation
// ==/UserScript==

(() => {
    'use strict';
    
    const SCRIPT_NAME = 'amzSuppressIllegalPageTransition';
    
    const insert_css = (() => {
        let css_style_id = 0;
        return css_rule_text => {
            const
                css_style = document.createElement('style'),
                css_rule = document.createTextNode(css_rule_text);
            
            css_style.id = `${SCRIPT_NAME}-css-${++css_style_id}`;
            css_style.type = 'text/css';
            css_style.append(css_rule);
            document.documentElement.append(css_style);
            return css_style;
        };
    })();
    
    const hide_buttons = () => {
        insert_css(`
            #wishlistButtonStack {
                visibility: hidden;
            }
        `);
    };
    
    const show_buttons = () => {
        [... document.querySelectorAll('#add-to-wishlist-button-submit,#add-to-wishlist-button')].forEach(button => {
                button.type = 'button'; // もともとはtype="submit"になっている(早いタイミングで押すと不正な遷移をしてしまう原因)→これを"button"に置換
        });
        
        insert_css(`
            #wishlistButtonStack {
                visibility: unset;
            }
        `);
    };
    
    const init_observe = (() => {
        let monitor_script;
        
        const finish = event => {
            document.removeEventListener('DOMContentLoaded', finish);
            show_buttons();
        };
        
        const observer = new MutationObserver(records => {
            stop_observe();
            if (monitor_script.dataset.eventset != 'true') {
                start_observe();
                return;
            }
            finish();
        });
        
        const start_observe = () => observer.observe(monitor_script, {
            attributes: true,
            childList: false,
            subtree: false
        });
        
        const stop_observe = () => observer.disconnect();
        
        return () => {
            hide_buttons();
            
            monitor_script = (() => {
                // [備忘] addEventListener()関数の呼び出しを監視し、[リストに追加]ボタンにclickイベントが設定されるのを待つ処理をインラインスクリプトとして埋め込み
                // ※clickイベント設定時には当該scriptのdata-eventset属性が"false"→"true"になる
                const script_id = `${SCRIPT_NAME}-watch-script`;
                const script = document.createElement('script');
                
                script.dataset.eventset = false;
                script.id = script_id;
                script.textContent = `
                    EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
                    EventTarget.prototype.addEventListener = function (type, listener, options) {
                        this._addEventListener(type, listener, options);
                        if ((this.id == 'add-to-wishlist-button-submit') && (type == 'click')) {
                            document.querySelector('#${script_id}').dataset.eventset = true;
                            EventTarget.prototype.addEventListener = EventTarget.prototype._addEventListener;
                        }
                    };
                `;
                document.documentElement.append(script);
                return script;
            })();
            
            document.addEventListener('DOMContentLoaded', finish); // [リストに追加]ボタンがない場合等のフェイルセーフ(ボタンが非表示のままとならないようにDOMContentLoadedのタイミングでは必ず表示させる)
            start_observe();
        };
    })();
    
    init_observe();
})();
