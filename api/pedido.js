// Vercel Serverless Function. A chave secreta NUNCA vai para o navegador.
const fs=require('node:fs');
const path=require('node:path');
const catalogo=JSON.parse(fs.readFileSync(path.join(process.cwd(),'catalogo-seguro.json'),'utf8'));
const produtos=new Map(catalogo.map(p=>[p.id,p]));
const SUPABASE_URL='https://kqnfkqepeeossiouhszq.supabase.co';
const ORIGENS=['https://achadinho-dos-artezao.vercel.app'];
const json=(res,status,obj)=>res.status(status).setHeader('Cache-Control','no-store').json(obj);
async function supa(endpoint,method,body,secret){const response=await fetch(SUPABASE_URL+'/rest/v1/'+endpoint,{method,headers:{apikey:secret,Authorization:'Bearer '+secret,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(body)});const text=await response.text();if(!response.ok)throw new Error('Banco HTTP '+response.status+': '+text.slice(0,300));return text?JSON.parse(text):[]}
module.exports=async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return json(res,405,{erro:'Método não permitido.'})}
 const origin=req.headers.origin||'';if(origin&&!ORIGENS.includes(origin))return json(res,403,{erro:'Origem não autorizada.'});
 if(req.headers['content-length']&&Number(req.headers['content-length'])>16000)return json(res,413,{erro:'Pedido muito grande.'});
 const secret=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!secret)return json(res,503,{erro:'Recebimento de pedidos ainda não configurado. Tente novamente mais tarde.'});
 try{
 const b=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
 if(b.website)return json(res,400,{erro:'Pedido inválido.'});
 const nome=String(b.nome||'').trim(),tel=String(b.whatsapp||'').replace(/\D/g,''),observacoes=String(b.observacoes||'').trim();
 if(nome.length<2||nome.length>100||!/^55\d{10,11}$/.test(tel)||observacoes.length>500)return json(res,400,{erro:'Confira nome e WhatsApp (DDD + número).'});
 if(!Array.isArray(b.itens)||b.itens.length<1||b.itens.length>40)return json(res,400,{erro:'Sacola inválida.'});
 const itens=b.itens.map(i=>{const p=produtos.get(String(i.id||''));const q=Number(i.quantidade),n=String(i.personalizacao||'').trim();if(!p||!Number.isInteger(q)||q<1||q>99||n.length>300)throw new Error('Item inválido.');return {produto_id:p.id,produto_nome:p.nome,quantidade:q,preco_unitario:p.preco,personalizacao:n}});
 const total=Math.round(itens.reduce((s,i)=>s+i.quantidade*i.preco_unitario,0)*100)/100;
 const pedidos=await supa('achi_pedidos','POST',{cliente_nome:nome,cliente_whatsapp:tel,total,observacoes,status:'novo',status_pagamento:'pendente'},secret);
 if(!pedidos[0]?.id)throw new Error('Pedido não criado');const id=pedidos[0].id;
 try{await supa('achi_itens','POST',itens.map(i=>({...i,pedido_id:id})),secret)}catch(e){try{await supa('achi_pedidos?id=eq.'+encodeURIComponent(id),'DELETE',{},secret)}catch{}throw e}
 return json(res,201,{ok:true,numero:pedidos[0].numero});
 }catch(e){console.error('Falha ao registrar pedido:',e.message);return json(res,e.message==='Item inválido.'?400:500,{erro:e.message==='Item inválido.'?e.message:'Não foi possível registrar o pedido. Sua sacola foi preservada.'})}
}
