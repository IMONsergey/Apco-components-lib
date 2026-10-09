import { href } from './navigation';
const cards=[
 {title:'Color & theme',description:'Semantic colors · light / dark',path:href('foundations','colors'),number:'01'},
 {title:'Typography',description:'Instrument Sans · IBM Plex Mono',path:href('foundations','typography'),number:'02'},
 {title:'Components',description:'28 source-first implementations',path:href('components'),number:'03'},
 {title:'Iconography',description:'Native · Feather · Phosphor',path:href('icons'),number:'04'},
 {title:'Layout & spacing',description:'Grid · breakpoints · motion',path:href('foundations','layout'),number:'05'},
 {title:'Guidelines',description:'Usage patterns and source rules',path:href('guidelines'),number:'06'},
];
export default function Overview(){
 return <div className="docs-overview">
  <div className="docs-overview__top"><span className="docs-kicker">APCOSYS / 01</span>
   <h1>Design system</h1>
   <p>One source for product identity, tokens, components and implementation patterns.</p>
  </div>
  <section id="docs-explore" className="docs-overview__section">
   <h2>Explore</h2>
   <div className="docs-overview__grid">{cards.map(item=>
    <a key={item.number} className="docs-overview__card" href={item.path}>
     <span>{item.number}</span><strong>{item.title}</strong>
     <small>{item.description}</small><svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 13 13 3M5 3h8v8"/></svg>
    </a>)}</div>
  </section>
  <section id="docs-principles" className="docs-overview__section">
   <h2>Principles</h2>
   <div className="docs-overview__principles">
    <div><span>01</span><strong>Source of truth</strong><p>Components and tokens reference the published APCOSYS website. Extensions are explicitly separated.</p></div>
    <div><span>02</span><strong>Built for reuse</strong><p>Portable React source, semantic CSS roles and downloadable tokens.</p></div>
    <div><span>03</span><strong>Less, but exact</strong><p>Default to approved patterns. Add new variants only where the product needs them.</p></div>
   </div>
  </section>
 </div>;
}
