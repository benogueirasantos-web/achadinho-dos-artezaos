const cfg=window.LOJA_CONFIG||{}, products=window.PRODUTOS||[];
let filter='Todos',query='',cart={},showCategory=false;try{cart=JSON.parse(localStorage.getItem('achi-cart')||'{}')}catch(e){cart={}}
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
 $('detailAdd').onclick=()=>{const n=Math.max(1,Math.min(99,Number($('detailQty').value)||1));cart[id]=(cart[id]||0)+n;save();closeDetail();notify('Modelos adicionados à sacola!')};
 $('detailShade').hidden=false;document.body.classList.add('no-scroll');
}
function closeDetail(){$('detailShade').hidden=true;document.body.classList.remove('no-scroll')}
$('detailClose').onclick=closeDetail;$('detailShade').onclick=e=>{if(e.target===$('detailShade'))closeDetail()};
$('backCategories').onclick=()=>{showCategory=false;filter='Todos';renderFilters()};
function save(){localStorage.setItem('achi-cart',JSON.stringify(cart));renderCart()}
function add(id){cart[id]=(cart[id]||0)+1;save();notify('Adicionado à sacola! ♥')}
function renderCart(){
 const count=Object.values(cart).reduce((a,b)=>a+b,0);
 $('count').textContent=count;$('drawerCount').textContent=`(${count})`;
 const selected=products.filter(p=>cart[p.id]>0);
 const subtotal=selected.reduce((sum,p)=>sum+(Number.isFinite(p.preco)?p.preco*cart[p.id]:0),0);
 $('cartItems').innerHTML=selected.length?selected.map(p=>`<div class="cart-item"><div class="cart-emoji" style="background:${p.cor||'#ddd'}">${escapeHTML(p.emoji||'✦')}</div><div><strong>${escapeHTML(p.nome)}</strong><small>${escapeHTML(p.categoria)} · ${Number.isFinite(p.preco)?dinheiro(p.preco)+' cada':'Sob consulta'}</small><div class="quantity"><button data-minus="${escapeHTML(p.id)}" aria-label="Diminuir quantidade">−</button><span>${cart[p.id]}</span><button data-plus="${escapeHTML(p.id)}" aria-label="Aumentar quantidade">+</button></div><small>Subtotal: ${Number.isFinite(p.preco)?dinheiro(p.preco*cart[p.id]):'A confirmar'}</small></div></div>`).join(''):'<p class="empty">Sua sacola está vazia. Escolha algo especial! ✦</p>';
 $('cartItems').querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>{cart[b.dataset.minus]--;if(cart[b.dataset.minus]<=0)delete cart[b.dataset.minus];save()});
 $('cartItems').querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>add(b.dataset.plus));
 $('cartTotal').textContent=dinheiro(subtotal);
}
function openCart(open){$('drawer').classList.toggle('open',open);$('drawer').setAttribute('aria-hidden',String(!open));$('overlay').hidden=!open;document.body.classList.toggle('no-scroll',open)}
$('search').addEventListener('input',e=>{query=e.target.value.toLocaleLowerCase('pt-BR').trim();if(query&&!showCategory){showCategory=true;filter='Todos';renderFilters()}renderProducts()});$('openCart').onclick=()=>openCart(true);$('closeCart').onclick=()=>openCart(false);$('overlay').onclick=()=>openCart(false);document.addEventListener('keydown',e=>{if(e.key==='Escape')openCart(false)});$('clearCart').onclick=()=>{cart={};save()};$('customOrder').onclick=()=>wa('Olá! Vim pelo site da Achadinho dos Aterzãos e gostaria de solicitar um produto personalizado.');$('checkout').onclick=()=>{const selected=products.filter(p=>cart[p.id]>0);if(!selected.length){notify('Adicione produtos à sacola primeiro.');return}wa('Olá! Vim pelo site do Achadinho dos Aterzãos. Quero fazer este pedido:\n\n'+selected.map(p=>`• ${cart[p.id]}x ${p.nome} — ${Number.isFinite(p.preco)?dinheiro(p.preco*cart[p.id]):'sob consulta'}`).join('\n')+'\n\nSubtotal: '+dinheiro(selected.reduce((v,p)=>v+(Number.isFinite(p.preco)?p.preco*cart[p.id]:0),0))+'\nFrete e disponibilidade a confirmar. Podemos combinar os detalhes?')};$('year').textContent=new Date().getFullYear();renderFilters();renderProducts();renderCart();
