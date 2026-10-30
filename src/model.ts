export type Person={id:number;name:string;active:boolean}
export type Item={id:number;date:string;event:string;role:string;assigned:boolean}
export type Schedule={weekStart:string;today:string;items:Item[];next:Item|null}
export const demoPeople:Person[]=[{id:101,name:'Ana Oliveira',active:true},{id:102,name:'Bruno Almeida',active:true},{id:103,name:'Clara Santos',active:false}]
export const demoToday='2026-10-29'
export function shift(date:string,days:number){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)}
export function monday(date:string){const d=new Date(date+'T12:00:00Z');return shift(date,-((d.getUTCDay()+6)%7))}
export function format(date:string,options:Intl.DateTimeFormatOptions={day:'2-digit',month:'long'}){return new Intl.DateTimeFormat('pt-BR',{...options,timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'))}
export function demoSchedule(person:Person,weekStart:string):Schedule{
 const offsets=[-7,0,7,14];const all:Item[]=offsets.flatMap((o,k)=>[{id:k*10+1,date:shift(monday(demoToday),o+2),event:'Culto de oração',role:person.id===101?'Projeção':'Sonorização',assigned:true},{id:k*10+2,date:shift(monday(demoToday),o+6),event:'Escola Bíblica Dominical',role:'Folga',assigned:false},{id:k*10+3,date:shift(monday(demoToday),o+6),event:'Culto de celebração',role:person.id===101?'Fotografia':'Transmissão',assigned:true}]);
 return {today:demoToday,weekStart,items:person.active?all.filter(x=>x.date>=weekStart&&x.date<=shift(weekStart,6)):[],next:person.active?all.find(x=>x.assigned&&x.date>=demoToday)||null:null}
}
