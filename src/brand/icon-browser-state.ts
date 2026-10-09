export type IconFamily='apcosys'|'feather'|'phosphor';
export interface IconBrowserState {family:IconFamily;search:string;size:number;stroke:number;limit:number;route:string|null}
export const initialIconBrowser:IconBrowserState={family:'apcosys',search:'',size:24,stroke:1.5,limit:72,route:null};
