const API="https://YOUR-BACKEND.example.com";
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
let guildId=null;

async function api(path,opt={}){const r=await fetch(API+path,{...opt,credentials:"include",headers:{"Content-Type":"application/json",...(opt.headers||{})}});if(!r.ok)throw new Error(await r.text());return r.json()}
function toast(t){$("#toast").textContent=t;$("#toast").style.display="block";setTimeout(()=>$("#toast").style.display="none",2200)}
function set(id,v){const e=$("#"+id);if(!e)return;if(e.type==="checkbox")e.checked=!!Number(v);else e.value=v??""}
function get(id){const e=$("#"+id);if(e.type==="checkbox")return e.checked?1:0;return e.value}

async function load(){try{
 const me=await api("/api/me"); if(!me.authenticated){location.href=API+"/auth/login";return}
 const gs=await api("/api/guilds"); $("#guild").innerHTML=gs.map(g=>`<option value="${g.id}">${esc(g.name)}</option>`).join("");
 if(gs.length){guildId=gs[0].id;await loadSettings()}
}catch(e){console.error(e);toast("Connection failed")}}

async function loadSettings(){if(!guildId)return;const s=await api(`/api/guilds/${guildId}/settings`);
["welcome_enabled","welcome_channel","welcome_message","autorole_enabled","autorole_id","leave_enabled","leave_channel","leave_message","automod_enabled","anti_links","anti_spam","modlog_enabled","modlog_channel"].forEach(k=>set(k,s[k]))}
async function save(){const data={};["welcome_enabled","welcome_channel","welcome_message","autorole_enabled","autorole_id","leave_enabled","leave_channel","leave_message","automod_enabled","anti_links","anti_spam","modlog_enabled","modlog_channel"].forEach(k=>data[k]=get(k));try{await api(`/api/guilds/${guildId}/settings`,{method:"POST",body:JSON.stringify(data)});toast("Changes saved")}catch(e){toast("Save failed")}}

$("#guild").addEventListener("change",async e=>{guildId=e.target.value;await loadSettings()});
$$(".save").forEach(b=>b.addEventListener("click",save));
$("#logout").href=API+"/auth/logout";
$$(".nav").forEach(b=>b.onclick=()=>{$$(".nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");$$(".page").forEach(p=>p.classList.add("hidden"));$("#"+b.dataset.page).classList.remove("hidden");$("#title").textContent=b.textContent.replace(/^[^A-Za-z]+/,"").trim()});
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
load();