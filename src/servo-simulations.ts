// Fictional display fixtures only. No API, storage or real recipients.
export type Message={id:string;owner:number;kind:'manual'|'automatic'|'birthday';title:string;body:string;sent:string}
export type PushState='off'|'active'|'blocked'|'unsupported'
export function messagesFor(owner:number):Message[]{
 if(![101,102,103].includes(owner))return []
 return [
  {id:`${owner}-manual`,owner,kind:'manual',title:'Vamos servir juntos neste domingo',body:'Mensagem fictícia da coordenação: confira sua escala e organize sua chegada com antecedência. Obrigado por caminhar com a equipe!',sent:'29/10/2026 · 09:00'},
  {id:`${owner}-automatic`,owner,kind:'automatic',title:owner===103?'Você continua fazendo parte da equipe':'Sua escala está disponível',body:owner===103?'Aviso automático fictício: seu cadastro está inativo para escalas, mas a área de mensagens continua disponível.':'Aviso automático fictício: consulte os dias e as funções da sua próxima semana de serviço.',sent:'28/10/2026 · 18:00'},
  ...(owner===101?[{id:'101-birthday',owner,kind:'birthday' as const,title:'Feliz aniversário, Ana!',body:'Aviso de aniversário fictício: que Deus abençoe sua vida e renove sua alegria em servir. Celebramos este dia com você!',sent:'29/10/2026 · 08:00'}]:[])
 ]
}
export function confirmOwnRead(owner:number,id:string,current:Record<string,string>,time:string){
 if(!messagesFor(owner).some(message=>message.id===id))return current
 return current[id]?current:{...current,[id]:time}
}
export function unreadCount(owner:number,reads:Record<string,string>){return messagesFor(owner).filter(x=>!reads[x.id]).length}
export function partnerRole(role:string){
 const normalized=role.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase()
 return normalized==='FOTOS'||normalized==='FOTOGRAFIA'?'FOTOS':normalized==='EDICAO'?'EDIÇÃO':null
}
export function partnersFor(owner:number,date:string,role:string){
 const ownRole=partnerRole(role)
 if(owner!==101||!ownRole)return []
 return [{id:'partner-demo-1',name:'Daniel Costa',role:ownRole==='FOTOS'?'EDIÇÃO':'FOTOS',date}]
}
