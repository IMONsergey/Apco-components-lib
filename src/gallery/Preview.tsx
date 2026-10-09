import { lazy, Suspense, useState } from 'react';
import type { ComponentId } from '../catalog';
import ProductScene from '../visuals/product/ProductScene';
import ApiScene from '../visuals/api/ApiScene';
import { AnimatedPrice } from '../components/ui/AnimatedPrice';
import { DoubleButton } from '../components/ui/DoubleButton';
import { AnimatedDetails } from '../components/ui/AnimatedDetails';
import PartnerMarquee from '../visuals/marquee/PartnerMarquee';
const Flow=lazy(()=>import('../visuals/flow/TurquoiseFlow'));
const Dots=lazy(()=>import('../visuals/dots/DotCascade'));
const Globe=lazy(()=>import('../visuals/globe/SignalGlobe'));
const Waves=lazy(()=>import('../visuals/waves/IceSphereWaves'));
const Shape=lazy(()=>import('../visuals/shapes/AnimatedShape'));
const ChatOrb=lazy(()=>import('../visuals/uploads/ai-chat/AIChatOrb'));
const OrbCube=lazy(()=>import('../visuals/uploads/orb-cube/OrbCubeLoader'));
export default function Preview({id,active,tone,speed,large=false}:{id:ComponentId;active:boolean;tone:'light'|'dark';speed:number;large?:boolean}){
 const [chatState,setChatState]=useState<'idle'|'thinking'|'answer'>('idle');
 const [price,setPrice]=useState(49);
 if (!active) return <div className="preview-idle" aria-hidden="true"><span className="idle-cross"/>INTERSECTION-PAUSED</div>;
 const dark=tone==='dark';
 let visual:React.ReactNode;
 switch(id){
  case 'flow': visual=<Flow theme={tone} speed={speed} fps={30}/>;break;
  case 'dots': visual=<Dots color={dark?'#A9DCE2':'#0C8694'} startOpacity={0.55} endOpacity={0.04} fps={30}/>;break;
  case 'globe': visual=<Globe speed={speed} fps={30} renderer="canvas2d" interactive pixelRatio={1.3} landColor={dark?'#5FAFBC':'#4E9EA9'} shellColor={dark?'#26383f':'#dce6e8'} signalColor={dark?'#42C0CF':'#008FA3'}/>;break;
  case 'waves': visual=<Waves theme={tone} speed={speed}/>;break;
  case 'rosette':case 'echo':visual=<Shape kind={id==='echo'?'echo':'rosette'} speed={speed} size={large?'78%':'72%'} opacity={dark?0.7:0.75} color={dark?'#B9D0D4':'#273237'} strokeWidth={1.4}/>;break;
  case 'orb-cube': visual=<OrbCube size={large?210:145} color={dark?'#F6FAFB':'#243A40'} speed={speed} fps={30} label="Orb cube animation"/>;break;
  case 'ai-orb':visual=<div className="orb-demo"><ChatOrb state={chatState} size={large?210:148}/><div className="orb-states">{(['idle','thinking','answer'] as const).map(m=><button type="button" key={m} className={chatState===m?'is-selected':''} onClick={()=>setChatState(m)}>{m}</button>)}</div></div>;break;
  case 'query':case 'results':case 'host':case 'evidence':case 'suggestions':visual=<ProductScene scene={id}/>;break;
  case 'api':visual=<ApiScene/>;break;
  case 'price':visual=<div className="price-showcase"><AnimatedPrice amount={price}/><div className="price-choices"><button type="button" onClick={()=>setPrice(49)}>$49</button><button type="button" onClick={()=>setPrice(89)}>$89</button><button type="button" onClick={()=>setPrice(129)}>$129</button></div></div>;break;
  case 'button':visual=<div className="button-showcase"><DoubleButton onClick={()=>{}} variant="primary">Get started</DoubleButton><DoubleButton onClick={()=>{}} variant="secondary">Explore more</DoubleButton></div>;break;
  case 'accordion':visual=<div className="accordion-showcase faq-list"><AnimatedDetails title="How is the data collected?" initialOpen><p>Explore infrastructure through a unified query and inspect the technical evidence.</p></AnimatedDetails><AnimatedDetails title="Is the API available?"><p>Access the API through your workspace and use it in your own tools.</p></AnimatedDetails></div>;break;
  case 'marquee':visual=<PartnerMarquee/>;break;
 }
 return <Suspense fallback={<div className="preview-idle">LOADING COMPONENT</div>}><div className={`preview-scene preview-scene--${id}`} data-tone={tone}>{visual}</div></Suspense>;
}
