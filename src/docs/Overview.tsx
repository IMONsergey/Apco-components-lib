import { Icon } from '../components/ui/Icon';
import tokens from '../tokens/apcosys.tokens.json';
import { href } from './navigation';

const palette=['page','card','ink','brand','tint'];
const swatches=(tone:'light'|'dark')=>[
 tokens.colors.page[tone],
 tokens.colors.card[tone],
 tokens.colors.primary[tone],
 tokens.colors.mark[tone],
 tokens.colors.tint[tone],
];
const cards=[
 {id:'colors',title:'Colors',caption:'Your palette, ready to use',route:href('foundations','colors')},
 {id:'components',title:'Components',caption:'Buttons, controls and animations',route:href('components')},
 {id:'typography',title:'Typography',caption:'Type styles and fonts',route:href('foundations','typography')},
 {id:'icons',title:'Icons',caption:'Find the right symbol',route:href('icons')},
] as const;

export default function Overview({tone}:{tone:'light'|'dark'}){
 return <div className="docs-overview docs-overview--friendly">
  <div className="docs-overview__top">
   <span className="docs-kicker">APCOSYS DESIGN LIBRARY</span>
   <h1>Everything in one place.</h1>
   <p>Explore the colors, styles and components that make APCOSYS feel like APCOSYS.</p>
  </div>
  <section id="docs-explore" className="docs-overview__section">
   <div className="docs-overview__section-head"><h2>Start exploring</h2><span>Choose what you need</span></div>
   <div className="docs-overview__grid docs-overview__grid--visual">
    {cards.map(card=><a className="docs-overview__card docs-overview__card--visual" href={card.route} key={card.id}>
     <div className={'docs-overview__art docs-overview__art--'+card.id} aria-hidden="true">
      {card.id==='colors'&&<div className="docs-overview__swatches">
       {swatches(tone).map((color,i)=><span key={palette[i]} style={{backgroundColor:color}}/>)}
      </div>}
      {card.id==='components'&&<div className="docs-overview__ui-sample">
       <span>Explore now <Icon name="arrow"/></span><span className="docs-overview__ui-sample-secondary">Learn more</span>
      </div>}
      {card.id==='typography'&&<div className="docs-overview__type-sample"><strong>Aa</strong><span>Instrument Sans</span></div>}
      {card.id==='icons'&&<div className="docs-overview__icon-sample">
       <Icon name="search"/><Icon name="database"/><Icon name="cube"/><Icon name="arrow"/><Icon name="bookmark"/>
      </div>}
     </div>
     <div className="docs-overview__card-bottom"><div><h3>{card.title}</h3><p>{card.caption}</p></div><Icon name="arrow"/></div>
    </a>)}
   </div>
  </section>
  <section id="docs-principles" className="docs-overview__section docs-overview__more">
   <h2>More to explore</h2>
   <div className="docs-overview__more-links">
    <a href={href('foundations','layout')}><span>Layout & spacing</span><small>Make everything fit, at every size</small><Icon name="arrow"/></a>
    <a href={href('guidelines')}><span>Guides</span><small>How to use our design language</small><Icon name="arrow"/></a>
   </div>
  </section>
 </div>;
}
