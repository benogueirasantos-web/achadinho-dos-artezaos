const cfg=window.LOJA_CONFIG||{}, products=window.PRODUTOS||[];
let filter='Todos',query='',cart={},showCategory=false;
const CART_KEY='achi-cart', NOTES_KEY='achi-cart-notes';
let notes={};
try{const raw=JSON.parse(localStorage.getItem(CART_KEY)||'{}');if(raw&&typeof raw==='object'&&!Array.isArray(raw))for(const p of products){const n=Number(raw[p.id]);if(Number.isInteger(n)&&n>0)cart[p.id]=Math.min(n,99)}}catch(e){cart={}}
try{const raw=JSON.parse(localStorage.getItem(NOTES_KEY)||'{}');if(raw&&typeof raw==='object'&&!Array.isArray(raw))notes=raw}catch(e){notes={}}

const dinheiro=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const $=id=>document.getElementById(id), escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function notify(msg){$('toast').textContent=msg;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),3200)}
function wa(message){const number=(cfg.whatsapp||'').replace(/\D/g,'');if(!/^\d{12,13}$/.test(number)){notify('WhatsApp ainda não configurado. Edite config.js com o número oficial.');return}window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer')}
function renderFilters(){
 const cats=[...new Set(products.map(p=>p.categoria))];
 const tile=$('categoryTiles');
 tile.hidden=showCategory;
 $('catalogBack').hidden=!showCategory;
 $('productGrid').hidden=!showCategory;
 tile.innerHTML=cats.map(c=>{const p=products.find(x=>x.categoria===c);return `<button class="category-tile" data-open-cat="${escapeHTML(c)}"><img src="${escapeHTML(p.image||'')}" alt="" loading="lazy"><strong>${escapeHTML(c)}</strong><span>Ver modelos →</span></button>`}).join('');
 tile.querySelectorAll('[data-open-cat]').forEach(b=>b.onclick=()=>openCategory(b.dataset.openCat));
 $('categoryTitle').textContent=filter==='Todos'?'Modelos':filter;
}
function openCategory(cat){filter=cat;showCategory=true;query='';$('search').value='';renderFilters();renderProducts();$('produtos').scrollIntoView({behavior:'smooth',block:'start'})}
function renderProducts(){
 const shown=products.filter(p=>(filter==='Todos'||p.categoria===filter)&&`${p.nome} ${p.descricao} ${p.categoria}`.toLocaleLowerCase('pt-BR').includes(query));
 $('productGrid').innerHTML=shown.map(p=>`<article class="product"><button class="product-open" data-view="${escapeHTML(p.id)}" aria-label="Ver ${escapeHTML(p.nome)}"><div class="product-image" style="--product-color:${p.cor||'#ffc4c4'}"><img src="${escapeHTML(p.image||'')}" alt="${escapeHTML(p.nome)}" loading="lazy"><span class="product-tag">${escapeHTML(p.categoria)}</span></div><div class="product-body"><h3>${escapeHTML(p.nome)}</h3><p>${escapeHTML(p.descricao)}</p><span class="see-detail">Ver detalhes →</span></div></button><div class="product-bottom" style="padding:0 16px 18px"><span class="product-price">${Number.isFinite(p.preco)?dinheiro(p.preco):"Sob consulta"}</span><button data-add="${escapeHTML(p.id)}">+ Sacola</button></div></article>`).join('')||'<p>Nenhum modelo encontrado.</p>';
 $('productGrid').querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>add(b.dataset.add));
 $('productGrid').querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>showDetail(b.dataset.view));
}
function showDetail(id){const p=products.find(x=>x.id===id);if(!p)return;
 $('detailContent').innerHTML=`<img class="detail-img" src="${escapeHTML(p.image||'')}" alt="${escapeHTML(p.nome)}"><div class="detail-info"><span class="eyebrow">${escapeHTML(p.categoria)}</span><h2>${escapeHTML(p.nome)}</h2><p>${escapeHTML(p.descricao)}</p><p class="demo-note">Imagens ilustrativas ou de referência; confirme modelos e disponibilidade.</p><p class="detail-price">${Number.isFinite(p.preco)?dinheiro(p.preco):"Preço sob consulta"}</p><label>Quantidade <input type="number" id="detailQty" min="1" max="99" value="1"></label><button class="primary" id="detailAdd">Adicionar à sacola</button></div>`;
 $('detailAdd').onclick=()=>{const n=Math.max(1,Math.min(99,Number($('detailQty').value)||1));cart[id]=Math.min(99,(cart[id]||0)+n);save();closeDetail();openCart(true);notify('Produto adicionado! Confira sua sacola. ❤️')};
 $('detailShade').hidden=false;document.body.classList.add('no-scroll');
}
function closeDetail(){$('detailShade').hidden=true;document.body.classList.remove('no-scroll')}
$('detailClose').onclick=closeDetail;$('detailShade').onclick=e=>{if(e.target===$('detailShade'))closeDetail()};
$('backCategories').onclick=()=>{showCategory=false;filter='Todos';renderFilters()};
function save(){try{localStorage.setItem(CART_KEY,JSON.stringify(cart));localStorage.setItem(NOTES_KEY,JSON.stringify(notes))}catch(e){notify('Seu navegador não permitiu salvar a sacola.')}renderCart()}
function add(id){if(!products.some(p=>p.id===id))return;cart[id]=Math.min(99,(cart[id]||0)+1);save();openCart(true);notify('Adicionado à sacola! ♥')}
function getSelected(){return products.filter(p=>Number.isInteger(cart[p.id])&&cart[p.id]>0)}
function subtotal(){return getSelected().reduce((sum,p)=>sum+(Number.isFinite(p.preco)?p.preco*cart[p.id]:0),0)}
function renderCart(){
 const selected=getSelected(), count=selected.reduce((sum,p)=>sum+cart[p.id],0);
 $('count').textContent=count;$('drawerCount').textContent=`(${count})`;
 $('cartItems').innerHTML=selected.length?selected.map(p=>`<div class="cart-item vx1-cart-item"><img class="vx1-cart-image" src="${escapeHTML(p.image||'')}" alt=""><div class="vx1-cart-info"><strong>${escapeHTML(p.nome)}</strong><small>${escapeHTML(p.categoria)} · ${Number.isFinite(p.preco)?dinheiro(p.preco)+' cada':'Preço sob consulta'}</small><div class="quantity"><button type="button" data-minus="${escapeHTML(p.id)}" aria-label="Diminuir ${escapeHTML(p.nome)}">−</button><span aria-label="Quantidade">${cart[p.id]}</span><button type="button" data-plus="${escapeHTML(p.id)}" aria-label="Aumentar ${escapeHTML(p.nome)}" ${cart[p.id]>=99?'disabled':''}>+</button><button type="button" class="vx1-remove" data-remove="${escapeHTML(p.id)}" aria-label="Remover ${escapeHTML(p.nome)}">Remover</button></div><label class="vx1-note-label">Detalhes do pedido (cor, tema, nome ou arte)<textarea data-note="${escapeHTML(p.id)}" maxlength="300" rows="2" placeholder="Ex.: tema Naruto, cor preta...">${escapeHTML(notes[p.id]||'')}</textarea></label><small>Subtotal do item: ${Number.isFinite(p.preco)?dinheiro(p.preco*cart[p.id]):'A confirmar'}</small></div></div>`).join(''):'<p class="empty">Sua sacola está vazia. Escolha algo especial! ✦</p>';
 $('cartItems').querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>{const id=b.dataset.minus;cart[id]--;if(cart[id]<=0){delete cart[id];delete notes[id]}save()});
 $('cartItems').querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>add(b.dataset.plus));
 $('cartItems').querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{delete cart[b.dataset.remove];delete notes[b.dataset.remove];save();notify('Produto removido.')});
 $('cartItems').querySelectorAll('[data-note]').forEach(el=>el.addEventListener('input',()=>{notes[el.dataset.note]=el.value;try{localStorage.setItem(NOTES_KEY,JSON.stringify(notes))}catch(e){}}));
 $('cartTotal').textContent=dinheiro(subtotal());
 $('checkout').disabled=!selected.length;
 $('copyOrder').disabled=!selected.length;
 $('clearCart').disabled=!selected.length;
 $('cartEstimate').textContent=selected.some(p=>!Number.isFinite(p.preco))?'Itens sem preço precisam de orçamento. O subtotal soma somente valores cadastrados.':'Subtotal estimado; valores e disponibilidade sujeitos a confirmação.';
}
function orderMessage(){const selected=getSelected();if(!selected.length)return '';
 return 'Olá! Vim pelo site do Achadinho dos Aterzãos. Gostaria de solicitar este pedido:\n\n'+selected.map(p=>`• ${cart[p.id]}x ${p.nome} — ${Number.isFinite(p.preco)?dinheiro(p.preco*cart[p.id]):'preço sob consulta'}${(notes[p.id]||'').trim()?'\n  Detalhes: '+notes[p.id].trim():''}`).join('\n')+'\n\nSubtotal estimado dos itens com preço: '+dinheiro(subtotal())+'\nFrete, personalização, disponibilidade e valor final a confirmar. Podemos combinar os detalhes?';
}
function openCart(open){$('drawer').classList.toggle('open',open);$('drawer').setAttribute('aria-hidden',String(!open));$('overlay').hidden=!open;document.body.classList.toggle('no-scroll',open)}
$('search').addEventListener('input',e=>{query=e.target.value.toLocaleLowerCase('pt-BR').trim();if(query&&!showCategory){showCategory=true;filter='Todos';renderFilters()}renderProducts()});$('openCart').onclick=()=>openCart(true);$('closeCart').onclick=()=>openCart(false);$('overlay').onclick=()=>openCart(false);document.addEventListener('keydown',e=>{if(e.key==='Escape')openCart(false)});$('clearCart').onclick=()=>{if(!getSelected().length)return;if(confirm('Tem certeza que deseja esvaziar a sacola?')){cart={};notes={};save();notify('Sacola esvaziada.')}};$('customOrder').onclick=()=>wa('Olá! Vim pelo site da Achadinho dos Aterzãos e gostaria de solicitar um produto personalizado.');$('checkout').onclick=()=>{const msg=orderMessage();if(!msg){notify('Adicione produtos primeiro.');return}wa(msg)};
$('copyOrder').onclick=async()=>{const msg=orderMessage();if(!msg)return;try{await navigator.clipboard.writeText(msg);notify('Pedido copiado! Cole no WhatsApp da loja. ❤️')}catch(e){const el=$('orderPreview');el.value=msg;el.hidden=false;el.focus();el.select();notify('Selecione e copie o texto do pedido.')}};
$('year').textContent=new Date().getFullYear();renderFilters();renderProducts();renderCart();
