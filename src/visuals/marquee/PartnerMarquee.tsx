import {useEffect,useRef,useState} from 'react';
const brands=[['adobe','Adobe'],['google','Google'],['ibm','IBM'],['microsoft','Microsoft'],['openai','OpenAI'],['samsung','Samsung']] as const;
export default function PartnerMarquee(){
  const ref=useRef<HTMLDivElement>(null);
  const [running,setRunning]=useState(false);
  useEffect(()=>{
    if(!ref.current)return;
    let visible=false;
    const sync=()=>setRunning(visible&&!document.hidden);
    const observer=new IntersectionObserver(([entry])=>{visible=Boolean(entry?.isIntersecting);sync()});
    observer.observe(ref.current);
    document.addEventListener('visibilitychange',sync);
    return ()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync)};
  },[]);
  const base=import.meta.env.BASE_URL;
  return <div className="trust gallery-marquee" ref={ref} data-running={running}>
    <div className="trust-viewport" role="region" tabIndex={0} aria-label="Brand logos, focus to pause animation">
      <div className="trust-track">{[0,1].map(copy=><ul className="trust-group" key={copy} aria-hidden={copy===1}>
        {brands.map(([file,name])=><li key={file}><span className="trust-mark">
          <img src={`${base}assets/partners/${file}.svg`} width="134" height="42" alt={copy===0?name:''} loading="lazy" decoding="async"/>
        </span></li>)}
      </ul>)}</div>
    </div>
  </div>;
}
