
(()=>{'use strict';
const btn=document.getElementById('vx3-history-open');
if(!btn)return;
btn.addEventListener('click',()=>{
 const launcher=document.getElementById('achi-launch');
 const chat=document.getElementById('achi-chat');
 const input=document.getElementById('achi-input');
 const form=document.getElementById('achi-form');
 if(!launcher||!chat||!input||!form)return;
 if(chat.hidden)launcher.click();
 input.value='Conta a história da loja';
 if(form.requestSubmit)form.requestSubmit();
 else form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
});
})();

(()=>{const btn=document.getElementById('vx4-historia-chat');if(!btn)return;btn.addEventListener('click',()=>{const chat=document.getElementById('achi-chat'),launch=document.getElementById('achi-launch'),input=document.getElementById('achi-input'),form=document.getElementById('achi-form');if(!chat||!launch||!input||!form)return;if(chat.hidden)launch.click();input.value='Conta a história da loja';if(form.requestSubmit)form.requestSubmit();else form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});})();
