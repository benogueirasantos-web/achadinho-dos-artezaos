(()=>{'use strict';
const $=id=>document.getElementById(id),launch=$('achi-launch'),panel=$('achi-chat'),close=$('achi-close'),form=$('achi-form'),input=$('achi-input'),messages=$('achi-messages');
if(!launch||!panel||!form||!input||!messages)return;
let topic='',stage='',turn=0,details={};
let loreStep=0, loreSeen=new Set();
const loreChapters=[
'🌌 CAPÍTULO 1 — ATERIA\nMuito além das estrelas existe Ateria, um mundo onde desenhos ganham vida e músicas desenham caminhos no céu. Eu era um Aterzão curioso que nunca acertava os próprios feitiços! 😭',
'🔑 CAPÍTULO 2 — A CHAVE VERMELHA\nNuma biblioteca abandonada encontrei uma caixa preta. Dentro, uma chave vermelha e um aviso: «Quando os mundos esquecerem como sonhar, a chave encontrará quem ainda acredita na imaginação.» Eu toquei nela... e um portal me engoliu!',
'🏪 CAPÍTULO 3 — O ACHADINHO\nCaí numa loja na Terra cheia de adesivos, broches e chaveiros. Na placa estava escrito ACHADINHO DOS ATERZÃOS! COMO ASSIM, MN?! 😭 Ainda não sei por que uma loja da Terra tem o nome do meu povo.',
'🚪 CAPÍTULO 4 — A SALA DOS ACHADOS\nA chave começou a brilhar quando alguém tinha uma ideia especial. Ela revelou uma porta atrás da estante: a Sala dos Achados. Lá havia sete espaços vazios e uma mensagem sobre os Fragmentos da Imaginação.',
'❤️ CAPÍTULO 5 — A ESCOLHA\nSe eu reunir os sete fragmentos, talvez consiga voltar para Ateria. Mas... eu fiz amigos na Terra. E se meu verdadeiro lar não for só um lugar? Ainda não sei como essa história termina, mn.'
];
const fragments=['🎨 Criatividade','🤝 Amizade','🔥 Coragem','✨ Alegria','📖 Memória','🪽 Liberdade','❤️ Pertencimento'];
const loreIntro=['Eita, mn... quer saber sobre meu mundo? 👀 Digita «conta a história» que eu abro meu diário de Ateria! 🔑','Eu vim de Ateria, um mundo onde a criatividade tem magia! 🌌 Pergunta pela chave vermelha ou pede «próximo capítulo».','Minha história tem portais, uma chave vermelha e sete fragmentos! 😭❤️ Quer ouvir o capítulo 1?'];
function loreReply(s){
 if(has(s,['reiniciar historia','recomecar historia','voltar ao capitulo 1'])){loreStep=0;return 'Diário reiniciado! 📖 Digita «conta a história» pra começar de novo.';}
 if(has(s,['sete fragmentos','7 fragmentos','fragmentos da imaginacao','quais fragmentos','fragmentos']))return 'Os Sete Fragmentos da Imaginação são:\n'+fragments.map((x,i)=>(i+1)+'. '+x).join('\n')+'\nCada um guarda um valor importante. ❤️';
 if(has(s,['chave vermelha','chave misteriosa','que chave','sua chave']))return '🔑 A Chave Vermelha me trouxe de Ateria para a Terra. Ela brilha quando alguém cria algo especial. Ainda não sei o que abre por completo... e isso me deixa doidinho, mn! 👀';
 if(has(s,['sala dos achados','sala secreta','porta secreta']))return '🚪 A Sala dos Achados fica escondida atrás de uma estante. Tem sete espaços vazios para os Fragmentos da Imaginação. Eu não conto tudo de uma vez, mn! 👀';
 if(has(s,['quem criou o achadinho','por que aterzaos','nome da loja','coincidencia']))return 'Esse é o maior mistério, mn! 😳 Por que uma loja da Terra tem o nome do meu povo de Ateria? Talvez alguém tenha atravessado o portal antes de mim...';
 if(has(s,['voce sente saudade','voltar para ateria','quer voltar','sua casa','seu lar']))return 'Sinto saudade de Ateria, sim... 🌌 Mas encontrei pessoas incríveis aqui. Talvez a última parte da aventura seja descobrir onde eu pertenço. ❤️';
 if(has(s,['quem e voce de verdade','sua origem','de onde voce veio','voce e alienigena','voce e de outro mundo','mundo de ateria','o que e ateria','quem e achi']))return pick(loreIntro);
 if(has(s,['conta a historia','conte sua historia','sua historia','conta a lore','lore do achi','proximo capitulo','continua a historia','continue a historia','continua','capitulo','diario de ateria','me conta mais sobre ateria','me conta sobre ateria','conta sobre ateria','me conta da ateria'])){
  const explicit=s.match(/capitulo\s*([1-5])/);if(explicit)loreStep=Number(explicit[1])-1;
  const i=loreStep%loreChapters.length;loreSeen.add(i);loreStep=i+1;return loreChapters[i]+'\n\n'+(i===loreChapters.length-1?'Fim dos capítulos disponíveis por enquanto! 🔑 Pergunta pelos fragmentos ou reinicia a história.':'Quer continuar? Digita «próximo capítulo»! 📖');
 }
 return null;
}

const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
// VX2 — interpretação local de mensagens, sem API e sem armazenar dados pessoais.
const vx2Abbr={
 'vc':'voce','vcs':'voces','c':'com','cm':'como','cmg':'comigo','ctg':'contigo',
 'q':'que','oq':'o que','qnt':'quanto','qnts':'quantos','qt':'quanto','qto':'quanto','qts':'quantos',
 'qnd':'quando','qd':'quando','pq':'porque','pqq':'porque','pk':'porque','pqe':'porque',
 'pra':'para','pro':'para o','p':'para','tb':'tambem','tbm':'tambem','tmb':'tambem',
 'n':'nao','nn':'nao','naum':'nao','num':'nao','ss':'sim','s':'sim','blz':'beleza',
 'vlw':'valeu','flw':'falou','tmj':'tamo junto','obg':'obrigado','obr':'obrigado',
 'pfv':'por favor','pf':'por favor','pff':'por favor','plmds':'pelo amor de deus',
 'qro':'quero','qr':'quero','qria':'queria','kr':'quero','kero':'quero',
 'kd':'cade','cadê':'cade','aq':'aqui','aki':'aqui','aki':'aqui','dps':'depois',
 'msg':'mensagem','zap':'whatsapp','wpp':'whatsapp','wts':'whatsapp','whats':'whatsapp',
 'insta':'instagram','ft':'foto','fds':'fim de semana','mt':'muito','mto':'muito',
 'mta':'muita','mtts':'muitos','msm':'mesmo','agr':'agora','hj':'hoje','amanha':'amanha',
 'dnv':'de novo','dnovo':'de novo','mn':'mano','mano':'mano','vei':'mano',
 'eh':'e','ehh':'e','ta':'esta','tah':'esta','to':'estou','tô':'estou',
 'td':'tudo','tdo':'tudo','tds':'todos','ql':'qual','qais':'quais',
 'brx':'broche','broxe':'broche','broxes':'broches','chaveru':'chaveiro',
 'chaverio':'chaveiro','chavero':'chaveiro','chavero':'chaveiro',
 'adesivu':'adesivo','adesivus':'adesivos','caneka':'caneca','canekas':'canecas',
 'perssonalizada':'personalizada','perso':'personalizado','presnte':'presente',
 'comprr':'comprar','ateriya':'ateria','aterya':'ateria','atería':'ateria',
 'cnta':'conta','conta':'conta','piad':'piada','amg':'amigo',
 'precu':'preco','preso':'preco','valorr':'valor','catlogo':'catalogo',
 'sacla':'sacola','sacola':'sacola','carrinhu':'carrinho','impresao':'impressao'
};
// Apenas conceitos conhecidos: correção conservadora evita transformar nomes próprios.
const vx2Vocabulary=[
 'adesivo','adesivos','broche','broches','chaveiro','chaveiros','caneca','canecas',
 'ecobag','ecobags','poster','posteres','marca','pagina','impressao','xerox',
 'personalizado','personalizada','personalizar','customizar','presente',
 'comprar','compra','pedido','pedidos','sacola','carrinho','quantidade',
 'preco','precos','valor','valores','quanto','custa','custam','total',
 'entrega','frete','retirada','prazo','pagamento','pix','desconto',
 'estoque','disponivel','whatsapp','atendente','catalogo',
 'historia','capitulo','proximo','continua','lore','ateria','fragmentos',
 'chave','vermelha','segredo','segredos','origem','personagem',
 'anime','naruto','manga','musica','rock','kpop','jogo','jogos',
 'piada','piadas','engracado','adivinha','charada',
 'quero','queria','voces','voce','fazem','faz','tem','sobre','conta',
 'ola','oi','salve','obrigado','valeu','tchau','bom','boa','dia','tarde','noite',
 'ajuda','ajudar','como','quando','qual','quais','pode','posso','fazer','mostra',
 'ver','foto','fotos','duas','dois','tres','quatro','cinco','sim','nao'
];
function vx2Distance(a,b){
 if(Math.abs(a.length-b.length)>2)return 9;
 const prev=Array.from({length:b.length+1},(_,i)=>i),curr=new Array(b.length+1);
 for(let i=1;i<=a.length;i++){
  curr[0]=i;
  for(let j=1;j<=b.length;j++)curr[j]=Math.min(prev[j]+1,curr[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
  for(let j=0;j<=b.length;j++)prev[j]=curr[j];
 }
 return prev[b.length];
}
function vx2Interpret(raw){
 let s=norm(raw).replace(/([a-z])\1{2,}/g,'$1$1');
 // Expandir abreviações por palavra, sem mexer em números e dados do pedido.
 let parts=s.split(' ').map(w=>vx2Abbr[w]||w).join(' ').split(' ');
 parts=parts.map(w=>{
  if(w.length<4||/^\d+$/.test(w)||vx2Vocabulary.includes(w))return w;
  let best=w,score=99,ambiguous=false;
  for(const candidate of vx2Vocabulary){
   if(Math.abs(candidate.length-w.length)>2||candidate[0]!==w[0])continue;
   const dist=vx2Distance(w,candidate);
   if(dist<score){score=dist;best=candidate;ambiguous=false;}
   else if(dist===score&&dist<=2){ambiguous=true;}
  }
  const limit=w.length>=8?2:1;
  return score<=limit&&!ambiguous?best:w;
 });
 s=parts.join(' ');
 // Expressões recorrentes: sem necessidade de programar resposta para cada grafia.
 s=s.replace(/\bquanto (?:e|esta|sai)\b/g,'quanto custa')
    .replace(/\bquanto custa (?:o|a|os|as)\b/g,'quanto custa')
    .replace(/\bme (?:fala|diz) (?:da|de)\b/g,'me conta sobre')
    .replace(/\bconta (?:uma|um) piada\b/g,'conta uma piada');
 return s;
}
const words=(s,arr)=>arr.some(w=>new RegExp('(^|\\s)'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(\\s|$)').test(s));
const has=(s,arr)=>arr.some(w=>s.includes(w));
const pick=arr=>arr[turn++%arr.length];
const money=n=>Number(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const products=()=>Array.isArray(window.PRODUTOS)?window.PRODUTOS:[];
const add=(who,t)=>{const d=document.createElement('div');d.className='achi-bubble '+who;d.textContent=t;messages.append(d);messages.scrollTop=messages.scrollHeight;};
const fallback=()=>pick(['Eita, mn! 😅 Essa eu ainda não sei responder. Posso ajudar com produtos, preços, sacola ou personalizados! ❤️','Essa pergunta passou do que eu sei, mn! 🤖 Prefiro não inventar. Se for algo da loja, confirme com a equipe.','Opa, não sei essa ainda! ❤️ Quer me perguntar sobre adesivos, broches, chaveiros, marca-páginas ou personalizados?','Boa pergunta! 😅 Ainda não fui programado para isso. Mas posso te ajudar a explorar o catálogo!']);
function price(s){const ps=products();let found=ps.filter(p=>{const n=norm(p.nome+' '+p.categoria);return n.split(' ').some(w=>w.length>=5&&s.includes(w))});if(!found.length){const groups=[['adesiv','adesivo'],['broch','broche'],['chaveir','chaveiro'],['marca pagina','marca'],['poster','poster'],['caneca','caneca'],['ecobag','ecobag'],['impress','impress'],['xerox','xerox']];for(const [key] of groups){if(s.includes(key)){found=ps.filter(p=>norm(p.nome+' '+p.categoria).includes(key));break;}}}if(found.length){const seen=new Set();return 'Olha os valores cadastrados no catálogo! 💸\n'+found.filter(p=>{if(seen.has(p.id))return false;seen.add(p.id);return true}).slice(0,5).map(p=>'• '+p.nome+': '+(Number.isFinite(Number(p.preco))?money(p.preco):'sob consulta')).join('\n')+'\nEstoque, personalização e frete precisam ser confirmados. ❤️';}return 'Não achei esse preço específico no catálogo, mn! 😅 Me diga qual produto você quer ou confirme com a loja.';}

// V10: diálogos adicionais, sem inventar informações da loja.
const extras=[
[['como vai','tudo bem','ta bem','como voce esta'],['Tô no modo achadinhos, mn! 😎 E você, tá procurando algo especial?','Tudo ótimo por aqui! ❤️ Quer uma dica de presente?','Tô animado pra ajudar! 🔥 O que vamos procurar hoje?']],
[['bom trabalho','parabens','legal voce','voce e legal'],['Aaaah, valeu! ❤️ Quer que eu te mostre as categorias?','Você que é demais, mn! 😭🔥','Assim eu fico até sem jeito! 🤖🖤']],
[['piada','me faz rir','conta uma piada','engracado'],['Por que o adesivo não discutiu? Porque preferiu ficar colado na paz! 😂','Meu superpoder? Achar achadinhos! Meu ponto fraco? Perguntas fora do catálogo. 🤣','O chaveiro disse pra chave: não te largo por nada! 🔑😂']],
[['surpresa','me surpreenda','escolhe pra mim','recomenda','indica algo'],['Bora de surpresa! 🎁 Que tal olhar os chaveiros? Você prefere algo fofo ou alternativo?','Minha dica: um broche pode dar personalidade à mochila! 🖤 Qual estilo você curte?','Eu começaria pelos adesivos! ✨ Quer um tema de anime ou música?']],
[['barato','mais barato','economico','orcamento'],['Posso te mostrar opções do catálogo, mn! 💸 Quanto você pretende gastar?','Bora escolher sem apertar o bolso! ❤️ Me diz qual produto te interessa.','Quer comparar preços? Me pergunta o valor de uma categoria específica!']],
[['caro','muito caro','desconto maior'],['Entendo, mn! ❤️ Os preços são os do catálogo; descontos só a equipe confirma.','Podemos procurar outra categoria que caiba melhor no orçamento! 💸','Sem problema! Que tal comparar os valores de broches, adesivos e chaveiros?']],
[['quantos dias','demora muito','quando fica pronto','pra quando'],['O prazo depende da produção e da entrega. 📦 Só a equipe consegue confirmar.','Não quero prometer uma data errada, mn! ❤️ Confirme o prazo com a loja.']],
[['foto','imagem do produto','ver foto','mostrar foto'],['As fotos disponíveis estão no catálogo! 📸 Abra o produto para conferir.','Bora olhar as imagens do catálogo! ❤️ Qual produto você quer ver?']],
[['troca','devolucao','reembolso','garantia'],['Sobre trocas e devoluções, é melhor confirmar a política com a equipe. ❤️','Não tenho a política de reembolso cadastrada, mn. A loja pode esclarecer direitinho!']],
[['atacado','quantidade grande','pedido grande','muitas unidades'],['Pedido grande? Aeee! 🔥 Quantidades e valores especiais precisam ser confirmados com a equipe.','Dá pra conversar com a loja sobre quantidade e disponibilidade. 🛍️']],
[['escola','lembranca escolar','turma','evento'],['Que massa! 🎓 Você pensa em adesivos, broches ou lembrancinhas personalizadas?','Para eventos, podemos pensar em um tema e depois confirmar produção e quantidade com a loja. ❤️']],
[['casamento','festa','formatura'],['Uma lembrancinha temática pode ficar linda! 🎉 Qual é o evento?','Bora pensar em algo especial! ❤️ Quantas pessoas vão participar?']],
[['cores','cor vermelha','cor preta','cor azul','cor rosa'],['Cores mudam tudo! 🎨 Qual produto você quer personalizar?','Amei falar de cores! ❤️ Quer uma combinação discreta ou bem chamativa?']],
[['tamanho a4','papel a4','formato a4'],['Temos referências de pôster A4 e impressão no catálogo. 📄 Consulte os detalhes e confirme com a equipe.','A4 é um formato de papel! 📄 Quer perguntar sobre pôsteres ou impressões?']],
[['imprimir','xerocar','copia','copiar documento'],['Quer imprimir algo? 🖨️ Confira a categoria de impressão e confirme arquivo, papel e disponibilidade com a loja.','Para impressão, a equipe precisa conferir os detalhes do arquivo. 📄']],
[['como comprar','como pedir','fazer pedido','passo a passo'],['Escolha o produto, ajuste a quantidade e adicione à sacola. 🛍️ Depois confira o total!','É fácil: catálogo → produto → sacola → conferir pedido! ❤️']],
[['voce dorme','voce come','voce e humano'],['Sou um mascote digital, mn! 🤖 Meu lanche favorito é um byte de achadinho! 😂','Não sou humano: sou o Achi, assistente de respostas programadas! ❤️']],
[['me ajuda','socorro','nao entendi','estou perdido'],['Tô aqui, mn! ❤️ Você precisa de ajuda com produto, preço ou sacola?','Sem estresse! 😎 Me diz o que você quer fazer e eu tento orientar.']],
[['amo voce','te amo','adoro o achi'],['Aaaaah! ❤️ O Achi ficou todo feliz!','Você é demais, mn! 🖤🔥','Carinho recebido com sucesso! 🤖❤️']],
[['qual o melhor','qual escolher','qual e melhor'],['Depende do seu estilo! 😎 É pra usar, presentear ou decorar?','Me conta o tema que você curte e eu sugiro uma categoria! ❤️']],
[['tem instagram','rede social','tiktok','perfil'],['Ainda não tenho os perfis oficiais cadastrados aqui. 📱 Confirme com a loja!','Não vou inventar redes sociais, mn! ❤️ Consulte os contatos oficiais da loja.']],
[['obrigado pela ajuda','muito obrigado','agradeco'],['Eu que agradeço, mn! ❤️ Bons achadinhos!','Foi um prazer ajudar! 🔥','É nóis! 🤖🖤']],
[['oi achi','fala achi','e ai achi'],['Falaaa, mn! 🔥 Qual achadinho você procura hoje?','Chegueeei! 🤖❤️ Bora explorar o catálogo?','Eae! 😎 Quer um presente ou algo pra você?']],
];
function extraAnswer(s){for(const [terms,answers] of extras){if(has(s,terms))return pick(answers)}return null;}

function answer(raw){const s=vx2Interpret(raw);if(!s)return 'Pode mandar sua dúvida, mn! ❤️';
if(s.length>400)return 'Mensagem grandona! 😅 Consegue resumir sua dúvida em uma frase?';
const lore=loreReply(s);if(lore)return lore;
if(has(s,['cpf','cartao de credito','senha','numero do cartao','dados bancarios']))return 'Por segurança, não envie senhas, CPF ou dados de cartão aqui, beleza? 🔒 Fale com a loja pelo canal oficial.';
if(words(s,['oi','ola','eae','salve','hey','opa'])&&s.length<28||has(s,['bom dia','boa tarde','boa noite']))return pick(['Eae, mn! 😎 Que bom te ver por aqui! Quer conhecer alguma categoria?','Oieee! ❤️ Sou o Achi! Hoje você tá procurando algo pra você ou pra presentear?','Salveee! 🔥 Quer ver produtos, saber preços ou montar um personalizado?','Falaaa! 🖤 Bora achar algo com a sua cara?']);
if(has(s,['obrigad','valeu','vlw','brigad']))return pick(['Tamo junto, mn! ❤️🔥','Imagina! 😎 Precisando, chama o Achi!','É nóis! 🖤 Volta sempre!']);
if(has(s,['tchau','ate logo','fui','ate mais']))return pick(['Até a próxima, mn! ❤️','Falouuu! 🔥 Bons achadinhos!','Tchauu! 🖤 Quando quiser, tô por aqui.']);
if(has(s,['quem e voce','seu nome','o que voce faz','voce e uma ia','voce e robo']))return 'Sou o Achi, mascote e assistente virtual do Achadinho! 🤖❤️ Tenho respostas programadas, não sou uma IA que sabe tudo. Mas conheço o catálogo e ajudo com pedidos!';
if(has(s,['preco','valor','quanto custa','quanto e','quanto sai','quanto fica','tabela de preco','quanto esta','quanto fica tudo']))return price(s);
if(has(s,['desconto','promocao','cupom','oferta']))return 'Promoções e descontos precisam ser confirmados com a loja, mn! ❤️ Não vou inventar cupom, combinado?';
if(has(s,['pix','pagamento','dinheiro','cartao','parcelamento','pagar']))return 'As formas de pagamento precisam ser confirmadas com a equipe da loja. 💳 Posso ajudar a montar a sacola primeiro!';
if(has(s,['entrega','frete','envio','prazo','retirada','chega','endereco','localizacao','horario','onde fica']))return pick(['Entrega, retirada e frete precisam ser combinados com a loja, mn! 📦','Ainda não tenho prazo ou endereço confirmado. ❤️ Melhor falar diretamente com a equipe da loja.']);
if(has(s,['estoque','disponivel','tem pronta','tem esse','acabou','esgotado']))return 'Não vejo o estoque em tempo real, mn! 😅 Confirme a disponibilidade antes de fechar o pedido.';
if(has(s,['whatsapp','contato','atendente','humano','falar com alguem']))return 'Claro! 📲 Monte sua sacola e use o botão do WhatsApp quando o contato estiver configurado. Se ainda não abrir, o número precisa ser cadastrado pela loja.';
if(has(s,['sacola','carrinho','total da compra','somar pedido','adicionar ao pedido','comprar','finalizar pedido']))return pick(['A sacola soma tudo automaticamente! 🛍️ Escolha os produtos, ajuste as quantidades e confira o subtotal.','Bora montar seu pedido! ❤️ Clique em adicionar nos produtos; a sacola calcula o subtotal. Frete é à parte.']);
if(has(s,['personaliz','customiz','encomenda','exclusiv','com meu nome','meu desenho'])){topic='personalizado';stage='produto';details={};return pick(['Ameeei! 🎨 Qual produto você quer personalizar: chaveiro, adesivo, broche, caneca ou ecobag?','Bora criar algo único! ❤️ Primeiro me diz: o que você quer personalizar?']);}
if(has(s,['adesivo','adesivos','figurinha','sticker'])){topic='adesivo';stage='tema';return pick(['Adesivos são tudo! ✨ Qual tema você curte?','Aeee! ❤️ Quer adesivos de anime, música ou outro tema? Confira os modelos no catálogo!']);}
if(has(s,['broche','broches','botton','pin'])){topic='broche';stage='tema';return pick(['Broches ficam lindos em mochila! 🖤 Qual estilo você curte?','Escolha boa! 😎 Você prefere um broche mais fofo, alternativo ou de algum personagem?']);}
if(has(s,['chaveiro','chaveiros','chaves'])){topic='chaveiro';stage='modelo';return pick(['Chaveiros são demais! 🔑 Você prefere pronto ou personalizado?','Aí sim! ❤️ Quer ver os chaveiros do catálogo ou criar um com sua ideia?']);}
if(has(s,['marca pagina','marcador de pagina','livro','leitura'])){topic='marca-páginas';stage='tema';return pick(['Aeee, leitor(a)! 📚 Que tipo de arte você gostaria no marca-páginas?','Marca-páginas deixam a leitura mais divertida! ❤️ Qual tema você gosta?']);}
if(has(s,['caneca','canecas','ecobag','ecobags','poster','posteres','xerox','impressao'])){topic='produto';stage='tema';return 'Temos essa categoria no catálogo, mn! ❤️ Quer saber o preço ou pensar numa arte? A disponibilidade precisa ser confirmada.';}
if(has(s,['produto','catalogo','voces vendem','o que vendem','categorias','loja']))return pick(['Aqui tem adesivos, broches, chaveiros, marca-páginas, pôsteres, ecobags, canecas e serviços de impressão! 🛍️ Qual você quer conhecer?','Bora explorar! 🔥 Veja as categorias no catálogo e me diga qual chamou sua atenção.']);
if(has(s,['anime','naruto','one piece','personagem','kpop','fofo','gato','desenho','rock','musica','banda'])){if(stage&&topic){details.tema=raw;stage='continuar';return 'Gostei desse tema! 🔥 Você quer uma arte mais colorida, minimalista ou divertida? A loja precisa confirmar se consegue produzir, beleza?';}return 'Curti esse tema! 🔥 Você quer usar essa ideia em adesivo, broche, chaveiro ou outro personalizado?';}
if(has(s,['presente','aniversario','lembrancinha','surpresa'])){topic='presente';stage='tema';return 'Ameeei a ideia! 🎁 É presente pra alguém que gosta de anime, música, leitura ou outro tema?';}
if(has(s,['qualidade','material','tamanho','medida','resistente','lavar','durabilidade']))return 'Os materiais e tamanhos podem variar conforme o produto. ❤️ Veja a descrição no catálogo ou confirme com a loja antes de comprar.';
if(has(s,['site','funciona','ajuda','como usar']))return 'É fácil, mn! 😎 Escolha uma categoria, abra o produto, adicione à sacola e confira o subtotal. Posso ajudar com alguma etapa!';
if(has(s,['sim','quero','pode ser','claro','isso','gostei'])&&topic)return stage==='produto'?'Show! 🎨 Me conta qual produto você quer personalizar.':'Boa! ❤️ Me conta mais sobre o '+topic+' que você imagina. A equipe confirma os detalhes antes de produzir.';
if(has(s,['nao','deixa','esquece','cancelar'])){topic='';stage='';return pick(['Tranquilo, mn! 😎 Quer olhar outra categoria?','Sem problema! ❤️ Tô aqui se precisar.']);}
const additional=extraAnswer(s);if(additional)return additional;
if(topic&&stage&&s.split(' ').length<=12){if(stage==='produto'){details.produto=raw;stage='tema';return 'Fechou! 🎨 E qual nome, frase, personagem ou desenho você quer colocar?';}if(stage==='tema'){details.tema=raw;stage='continuar';return 'Ameeei a ideia! 🔥 Tem alguma cor ou estilo em mente? Depois a loja confirma se consegue fazer.';}if(stage==='modelo'){stage='tema';return 'Boa! 😎 E qual tema ou personagem você gostaria?';}if(stage==='continuar'){stage='concluir';return 'Anotado na conversa! ❤️ Para encomendar de verdade, confira o produto no catálogo e confirme os detalhes com a loja. Eu não envio pedidos sozinho.';}}
return fallback();}
launch.addEventListener('click',()=>{panel.hidden=!panel.hidden;launch.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)input.focus()});
close.addEventListener('click',()=>{panel.hidden=true;launch.setAttribute('aria-expanded','false');launch.focus()});
form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(!q)return;input.value='';add('user',q);add('bot',answer(q));input.focus()});
})();