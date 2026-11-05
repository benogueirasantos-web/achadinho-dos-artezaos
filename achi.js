(()=>{'use strict';
const $=id=>document.getElementById(id),launch=$('achi-launch'),panel=$('achi-chat'),close=$('achi-close'),form=$('achi-form'),input=$('achi-input'),messages=$('achi-messages');
if(!launch||!panel||!form)return;
let lastTopic='',turn=0;
const normalize=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
const has=(s,arr)=>arr.some(x=>s.includes(x));
const choose=arr=>arr[turn++%arr.length];
const add=(who,t)=>{const d=document.createElement('div');d.className='achi-bubble '+who;d.textContent=t;messages.append(d);messages.scrollTop=messages.scrollHeight;};
function answer(raw){const s=normalize(raw);if(!s)return 'Me conta sua dúvida, mn! ❤️';
if(has(s,['oi','ola','eae','e ai','bom dia','boa tarde','boa noite','salve'])&&s.length<45)return choose(['Eae, mn! 😎 Bem-vindo ao Achadinho! Quer ver nossos produtos?','Oieee! ❤️ O Achi chegou! O que você procura hoje?','Salveee! 🔥 Bora encontrar algo com a sua cara?']);
if(has(s,['obrigad','valeu','vlw','brigad']))return choose(['Tamo junto, mn! ❤️🔥','Imagina! 😎 Qualquer coisa, chama o Achi!']);
if(has(s,['quem e voce','seu nome','o que voce faz']))return 'Eu sou o Achi! 🤖❤️ Ajudo você a explorar adesivos, broches, chaveiros, marca-páginas e personalizados.';
if(has(s,['preco','valor','quanto custa','quanto e','desconto','promocao','barato','pix','pagamento'])){
 const ps=window.PRODUTOS||[];const matches=ps.filter(p=>normalize(p.nome+' '+p.categoria).split(' ').some(w=>w.length>4&&s.includes(w)));
 if(matches.length){const seen=new Set();return 'Esses são os valores do catálogo, mn! 💸\n'+matches.filter(p=>{if(seen.has(p.nome))return false;seen.add(p.nome);return true}).slice(0,4).map(p=>p.nome+': '+(Number.isFinite(p.preco)?p.preco.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}):'sob consulta')).join('\n')+'\nFrete e disponibilidade a confirmar. ❤️';}
 return 'Claro, mn! 💸 Adesivos R$ 6, broches R$ 5, chaveiros R$ 8, marca-páginas R$ 5, pôster A4 R$ 8, caneca personalizada R$ 30, ecobag R$ 25 e impressão A4 R$ 1 por página. A sacola calcula o subtotal! Frete e disponibilidade a confirmar. ❤️';
}
if(has(s,['entrega','frete','envio','prazo','retirada','chega','endereco','localizacao','horario']))return 'Essa informação precisa ser confirmada diretamente com o pessoal da loja. 📲 Não quero te passar algo errado!';
if(has(s,['estoque','disponivel','tem pronta','tem esse','acabou']))return 'Não consigo consultar o estoque em tempo real, mn! ❤️ Confirme a disponibilidade com a loja.';
if(has(s,['whatsapp','contato','atendente','humano','falar com alguem']))return 'Claro! 📲 Você pode montar sua sacola e usar o botão de pedido pelo WhatsApp, quando o contato da loja estiver configurado.';
if(has(s,['personaliz','customiz','com meu nome','meu desenho','encomenda','exclusiv'])){lastTopic='personalizado';return choose(['Ameeei! 🎨 Qual produto você quer personalizar: adesivo, broche, chaveiro ou marca-páginas?','Bora criar algo único! ❤️ Me conta qual produto e qual nome, personagem ou desenho você imagina.']);}
if(has(s,['sacola','carrinho','total da compra','somar pedido']))return 'A sacola faz as contas automaticamente! 🛍️ Adicione os produtos e ajuste as quantidades para ver o subtotal. Frete e disponibilidade são confirmados pela loja. ❤️';
if(has(s,['caneca','ecobag','poster','posteres','xerox','impressao']))return 'Temos essas opções no catálogo, mn! ❤️ Confira o preço no produto ou me pergunte quanto custa. Modelos e disponibilidade precisam ser confirmados.';
if(has(s,['adesivo','figurinha','sticker'])){lastTopic='adesivo';return 'Adesivos são incríveis! ✨ Dá uma olhada na categoria de adesivos do catálogo. Qual tema você curte?';}
if(has(s,['broche','botton','pin'])){lastTopic='broche';return 'Broches dão muita personalidade pra mochila! 🖤 Dá uma olhada na categoria de broches. Você prefere qual estilo?';}
if(has(s,['chaveiro','chaves'])){lastTopic='chaveiro';return 'Chaveiros são tudo! 🔑 Você quer procurar modelos do catálogo ou pensar em um personalizado?';}
if(has(s,['marca pagina','marcador de pagina','livro','leitura'])){lastTopic='marca-páginas';return 'Aí sim, leitor(a)! 📚 Dá uma olhada nos marca-páginas do catálogo. Tem algum tema em mente?';}
if(has(s,['produto','catalogo','voces vendem','o que vendem','loja']))return 'Aqui você pode explorar adesivos, broches, chaveiros, marca-páginas e personalizados! 🛍️ Quer saber de alguma categoria?';
if(has(s,['anime','naruto','one piece','personagem','kpop','fofo','gato','desenho']))return 'Curti o tema! 🔥 Posso te ajudar a pensar em um personalizado, mas a disponibilidade desse desenho precisa ser confirmada com a loja. Qual produto você quer?';
if(has(s,['sim','quero','pode ser','claro'])&&lastTopic)return 'Boa! ❤️ Conta mais sobre o '+lastTopic+' que você imagina. Para confirmar modelos e valores, fale com a loja.';
if(has(s,['nao','não','deixa']))return 'Tranquilo, mn! 😎 Se quiser, posso te mostrar outras categorias.';
return choose(['Eita, mn! 😅 Essa eu ainda não sei responder. Posso te ajudar com adesivos, broches, chaveiros, marca-páginas ou personalizados! ❤️','Opa! 🤖 Essa pergunta passou do que eu sei por enquanto. Para não inventar, melhor confirmar com a loja!','Essa eu não sei ainda, mn! ❤️ Me pergunta sobre nossos produtos ou personalizados que eu tento ajudar.']);}
launch.addEventListener('click',()=>{panel.hidden=!panel.hidden;launch.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)input.focus()});
close.addEventListener('click',()=>{panel.hidden=true;launch.setAttribute('aria-expanded','false');launch.focus()});
form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(!q)return;input.value='';add('user',q);add('bot',answer(q));input.focus()});
})();