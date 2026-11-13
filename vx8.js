// VX8: melhorias de acessibilidade e atalhos de compra.
document.addEventListener('DOMContentLoaded',()=>{
 const input=document.getElementById('search');
 if(input){input.placeholder='Buscar produto, tema ou categoria...';}
 const bot=document.getElementById('achi-messages');
 const open=document.getElementById('achi-launch');
 if(open)open.title='Achi pode ajudar com produtos, personalização e dúvidas sobre pedidos';
});
