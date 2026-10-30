import React,{useEffect,useState} from 'react';
import logo from '../ibne-blue-original.svg?inline';
import {demoSchedule,demoToday,demoPeople,format,monday,shift,type Person} from '../model';
import {ServoMessages,ServoPartners,ServoPush} from '../ServoExtras';
import './foundation.css';
import './preview.css';

type Role='servo'|'coordenador'|'administrador';
// A separate static build evaluates this constant at compile time; the Worker-backed build stays unchanged.
const staticPreview=import.meta.env.VITE_STATIC_PREVIEW==='true';
const staticUsers:Record<string,{id:number;role:Role}>={'servo.demo':{id:101,role:'servo'},'coordenador.demo':{id:102,role:'coordenador'},'administrador.demo':{id:103,role:'administrador'}};
type Section={id:string;label:string;description:string};
type SessionUser={id:number;username:string;role:Role};
const adminSections:Section[]=[
{id:'geral',label:'Visão geral',description:'Resumo da equipe, próximas atividades e indicadores'},
{id:'escalas',label:'Gerenciamento de escalas',description:'Planejamento, geração, edição e publicação'},
{id:'equipe',label:'Equipe e funções',description:'Servos, disponibilidade e atribuições'},
{id:'cultos',label:'Cultos e eventos',description:'Tipos, categorias e calendário'},
{id:'comunicacao',label:'Comunicação e notificações',description:'Mensagens, aniversários e Push'},
{id:'relatorios',label:'Relatórios e consultas',description:'Participação, equilíbrio e exportações'},
{id:'acessos',label:'Controle de acessos',description:'Perfis, senhas e histórico de acessos'},
{id:'administracao',label:'Administração do sistema',description:'Monitoramento, diagnóstico e auditoria'}
];
const coordinatorSections:Section[]=[
{id:'mes',label:'Escalas do mês',description:'Consulta de semanas e participantes'},
{id:'mensagens',label:'Mensagens recebidas',description:'Avisos da equipe e leitura simulada'},
{id:'equipes',label:'Consulta da equipe',description:'Resumo dos cultos e funções, somente leitura'}
];
const fictitiousNames:Record<string,string>={'servo.demo':'Ana Oliveira','coordenador.demo':'Carlos Lima','administrador.demo':'Marina Costa'};
function DemoTag(){return <span className="demo-tag">DADOS FICTÍCIOS · SIMULAÇÃO</span>}
function EventList({week,person}:{week:string;person:Person}){
 const schedule=demoSchedule(person,week);
 return <div className="event-list">{schedule.items.length?schedule.items.map(item=><div key={item.id} className={'demo-event '+(!item.assigned?'demo-rest':'')+(item.date<demoToday?' demo-past':'')}>
 <div className="event-day"><b>{format(item.date,{day:'2-digit'})}</b><small>{format(item.date,{month:'short'})}</small></div>
 <div className="event-description"><small>{format(item.date,{weekday:'long'})} · {item.date<demoToday?'Já realizado':item.assigned?'Futuro':'Folga'}</small><strong>{item.event}</strong><span>{item.assigned?item.role:'Você não está escalado neste culto'}</span></div>
 <span className="event-state">{item.date<demoToday?'Realizado':item.assigned?'Escalado':'Folga'}</span>
 {item.assigned&&<div className="event-partners"><ServoPartners userId={101} date={item.date} role={item.role}/></div>}
 </div>):<div className="demo-empty">Nenhum compromisso nesta semana fictícia. Você está de folga.</div>}</div>
}
function ServoArea({user}:{user:SessionUser}){
 const [week,setWeek]=useState(monday(demoToday));const [inactive,setInactive]=useState(false);
 const person:Person={id:101,name:fictitiousNames[user.username]??'Servo de Demonstração',active:!inactive};
 const data=demoSchedule(person,week);
 return <div className="demo-content"><div className="area-heading"><div><span className="eyebrow">MINHA ESCALA</span><h1>Olá, {person.name.split(' ')[0]}</h1><p>Acompanhe os compromissos da equipe de mídia.</p></div><DemoTag/></div>
 <div className="demo-alert">Prévia demonstrativa · as datas, os eventos e as mensagens não pertencem a pessoas reais.</div>
 <label className="demo-toggle"><input type="checkbox" checked={inactive} onChange={e=>setInactive(e.target.checked)}/> Visualizar cenário de Servo inativo (simulação)</label>
 {inactive?<div className="demo-empty"><h2>Cadastro inativo</h2><p>Suas escalas ficam indisponíveis. Mensagens e orientações permanecem acessíveis para consulta.</p></div>:<div className="summary-grid"><article className="summary-feature"><small>PRÓXIMA ESCALA</small><h2>{data.next?format(data.next.date,{weekday:'long',day:'2-digit',month:'long'}):'Nenhuma escala futura'}</h2><p>{data.next?.event??'Sem compromissos registrados'}</p><strong>{data.next?.role??'Folga'}</strong></article><article className="summary-quiet"><small>SEMANA SELECIONADA</small><h2>{data.items.filter(x=>x.assigned).length} compromisso(s)</h2><p>Os dias passados, futuros e de folga aparecem destacados na lista.</p></article></div>}
 <div className="demo-panels"><ServoMessages user={person}/><ServoPush user={person}/></div>
 {!inactive&&<section className="demo-section"><div className="section-toolbar"><div><h2>Minha semana</h2><p>{format(week,{day:'2-digit',month:'long'})} a {format(shift(week,6),{day:'2-digit',month:'long',year:'numeric'})}</p></div><div className="week-buttons"><button onClick={()=>setWeek(shift(week,-7))} aria-label="Semana anterior">←</button><button onClick={()=>setWeek(monday(demoToday))}>Semana atual</button><button onClick={()=>setWeek(shift(week,7))} aria-label="Próxima semana">→</button></div></div><EventList week={week} person={person}/></section>}
 </div>
}
function CoordinatorArea(){
 const [section,setSection]=useState('mes');const [month,setMonth]=useState('2026-10');
 const names=['Ana Oliveira','Bruno Almeida','Clara Santos'];
 return <div className="demo-content"><div className="area-heading"><div><span className="eyebrow">COORDENAÇÃO · SOMENTE CONSULTA</span><h1>Consultas da equipe</h1><p>Visualização sem ferramentas de edição ou administração.</p></div><DemoTag/></div><nav className="section-tabs" aria-label="Consultas do coordenador">{coordinatorSections.map(x=><button key={x.id} aria-current={section===x.id?'page':undefined} onClick={()=>setSection(x.id)}>{x.label}</button>)}</nav>
 <section className="demo-section"><h2>{coordinatorSections.find(x=>x.id===section)?.label}</h2><p>{coordinatorSections.find(x=>x.id===section)?.description}</p>
 {section==='mes'?<><label className="field-inline">Mês da consulta<input type="month" value={month} onChange={e=>setMonth(e.target.value)}/></label><div className="demo-table-wrap"><table><thead><tr><th>Data</th><th>Evento</th><th>Servo</th><th>Função</th></tr></thead><tbody>{[1,2,3].map((n)=><tr key={n}><td>{String(n*7).padStart(2,'0')}/{month.slice(5)}/{month.slice(0,4)}</td><td>{n===1?'Culto de oração':'Culto de celebração'}</td><td>{names[n-1]}</td><td>{['Fotos','Projeção','Edição'][n-1]}</td></tr>)}</tbody></table></div></>:section==='mensagens'?<><article className="demo-tile"><strong>Reunião de alinhamento</strong><p>Aviso fictício recebido da equipe de mídia. Leitura apenas demonstrativa.</p><CoordinatorRead/></article></>:<div className="demo-cards">{['Fotos','Edição','Projeção'].map((x,i)=><article key={x}><strong>{x}</strong><p>{i+1} servo(s) fictício(s) no exemplo.</p></article>)}</div>}
 <p className="simulation-caption">Somente leitura · dados fictícios · nenhuma alteração de escala é possível nesta prévia.</p></section></div>
}
function CoordinatorRead(){const [read,setRead]=useState(false);return <button className="outline-button" onClick={()=>setRead(true)} disabled={read}>{read?'✓ Leitura confirmada (simulada)':'Confirmar leitura (simulação)'}</button>}
function AdminArea(){
 const [active,setActive]=useState('geral');const current=adminSections.find(x=>x.id===active)??adminSections[0];
 return <div className="demo-content"><div className="area-heading"><div><span className="eyebrow">ADMINISTRAÇÃO</span><h1>Painel de gestão</h1><p>Organização funcional para computador, tablet e celular.</p></div><DemoTag/></div><div className="admin-layout"><nav className="admin-nav" aria-label="Áreas administrativas">{adminSections.map(x=><button key={x.id} aria-current={active===x.id?'page':undefined} onClick={()=>setActive(x.id)}>{x.label}</button>)}</nav><section className="admin-workspace"><span className="eyebrow">PRÉVIA DE INTERFACE</span><h2>{current.label}</h2><p>{current.description}</p>{active==='geral'?<div className="demo-cards">{[['8','Servos ativos'],['4','Coordenadores'],['3','Eventos da semana'],['2','Mensagens pendentes']].map(([n,x])=><article key={x}><strong className="big-number">{n}</strong><p>{x}</p></article>)}</div>:<div className="demo-cards">{(active==='escalas'?['Semanas e cultos','Gerar ou refazer escala','Editar e excluir com confirmação']:active==='equipe'?['Cadastro de servos','Disponibilidade e funções','Senha inicial DD M M A A']:active==='cultos'?['Tipos de culto','Eventos e categorias','Sexo permitido']:active==='comunicacao'?['Mensagens manuais','Mensagens automáticas','Notificações Push']:active==='relatorios'?['Equilíbrio de escalas','Participação por servo','Exportações PDF/JPEG/CSV']:active==='acessos'?['Perfis e acessos','Redefinição de senhas','Histórico de login']:['Monitoramento de saúde','Auditoria e registros','Diagnóstico de Push']).map(x=><article key={x}><strong>{x}</strong><p>Interface prevista · ainda não operacional</p></article>)}</div>}<p className="simulation-caption">Esta área é uma simulação de navegação. Nenhuma ação administrativa é executada e não existe conexão com dados reais.</p></section></div></div>
}
export default function App(){
 const [session,setSession]=useState<SessionUser|null>(null);
 const [username,setUsername]=useState('');const [password,setPassword]=useState('');const [notice,setNotice]=useState('');const [busy,setBusy]=useState(false);
 useEffect(()=>{if(staticPreview)return;fetch('/api/auth/me',{credentials:'same-origin'}).then(r=>r.ok?r.json():null).then(x=>{if(x?.user?.role&&['servo','coordenador','administrador'].includes(x.user.role))setSession(x.user)}).catch(()=>{})},[]);
 async function login(e:React.FormEvent){e.preventDefault();if(busy)return;setBusy(true);setNotice('');
 if(staticPreview){const user=staticUsers[username.trim().toLowerCase()];setPassword('');if(user&&password==='DemoIBNE!2026'){setSession({id:user.id,username:username.trim().toLowerCase(),role:user.role})}else{setNotice('Usuário ou senha fictícia inválidos. Confira os exemplos abaixo.')}setBusy(false);return}
 try{const r=await fetch('/api/auth/login',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify({username,password})});setPassword('');if(!r.ok){setNotice(r.status===429?'Muitas tentativas fictícias; tente novamente mais tarde.':'Credenciais fictícias inválidas ou Worker local indisponível.');return}const data=await r.json() as {user:SessionUser};if(['servo','coordenador','administrador'].includes(data.user.role)){setSession(data.user)}else setNotice('Perfil não reconhecido.')}catch{setPassword('');setNotice('Worker local indisponível. Inicie a API TypeScript isolada para usar o login.')}finally{setBusy(false)}}
 async function logout(){if(!staticPreview)try{await fetch('/api/auth/logout',{method:'POST',credentials:'same-origin'})}catch{}setSession(null);setUsername('');setPassword('');setNotice('')}
 return <div className="foundation"><header className="foundation-header"><img src={logo} alt="Logomarca original da Igreja Batista Nova Esperança"/><div><b>IBNE · Escala de Mídia 2.0</b><small>Prévia visual · dados fictícios · sem backend real</small></div>{session&&<button className="header-exit" onClick={()=>void logout()}>Sair</button>}</header><main>{!session?<><section className="foundation-login"><div className="foundation-intro"><span>IGREJA BATISTA NOVA ESPERANÇA</span><h1>Servir juntos, com organização.</h1><p>Uma experiência moderna para toda a equipe de mídia.</p><DemoTag/></div><form onSubmit={login}><h2>Acesso à equipe</h2><p>Uma única entrada para Servo, Coordenador e Administrador. Na prévia estática, o perfil é escolhido automaticamente pelo usuário fictício informado; não existe autenticação real.</p><label>Usuário<input autoComplete="off" value={username} onChange={e=>setUsername(e.target.value)} required/></label><label>Senha<input type="password" autoComplete="off" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button type="submit" disabled={busy}>{busy?'Verificando…':'Entrar'}</button>{notice&&<p role="status" className="login-notice">{notice}</p>}</form></section><section className="demo-credentials"><h2>Contas exclusivamente fictícias</h2><p>Estas são identidades inventadas para a demonstração. A versão estática não se conecta ao Worker. Nunca utilize sua senha verdadeira nesta prévia.</p><div className="demo-account-list">{[['servo.demo','Servo'],['coordenador.demo','Coordenador'],['administrador.demo','Administrador']].map(([user,role])=><div key={user}><b>{role}</b><code>{user}</code></div>)}</div><p>Senha fictícia compartilhada: <code>DemoIBNE!2026</code>. <span>Contas inativas não podem entrar; o estado inativo é visualizável na área do Servo.</span></p></section></>:session.role==='servo'?<ServoArea user={session}/>:session.role==='coordenador'?<CoordinatorArea/>:<AdminArea/>}</main><footer>IBNE 2.0 · Demonstração estática isolada · sem dados reais</footer></div>
}
