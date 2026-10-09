import DraftToolbar from './DraftToolbar';

export default function FoundationHeader({title,focused,editing,onEditing,tone}:{
 title:string;focused:boolean;editing:boolean;onEditing:(value:boolean)=>void;tone?:'light'|'dark';
}){
 return <>
  <div className="ds-section-bar ds-foundation-edit-heading ds-workbench__heading">
   {focused?<h1 className="ds-focused-title">{title}</h1>:<h2>{title}</h2>}
   <div className="ds-edit-heading-actions">
    {tone&&<span className="ds-muted-note">{tone==='light'?'Light':'Dark'} theme</span>}
    <button type="button" className="ds-workbench__mode" aria-pressed={editing} onClick={()=>onEditing(!editing)}>{editing?'View reference':'Edit draft'}</button>
   </div>
  </div>
  {focused&&<DraftToolbar editing={editing}/>}
 </>;
}
