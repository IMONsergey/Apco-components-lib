import { Icon } from '../components/ui/Icon';
import { href } from './navigation';

const sections=[
 {title:'Colors',description:'Palette for light and dark themes',route:href('foundations','colors')},
 {title:'Components',description:'Buttons, controls and animations',route:href('components')},
 {title:'Typography',description:'Fonts and text styles',route:href('foundations','typography')},
 {title:'Icons',description:'Find and copy a symbol',route:href('icons')},
] as const;

export default function Overview(){
 return <div className="docs-overview docs-overview--friendly">
  <div className="docs-overview__top">
   <span className="docs-kicker">APCOSYS DESIGN LIBRARY</span>
   <h1>Everything in one place.</h1>
   <p>Colors, type, components and guidelines for APCOSYS products.</p>
  </div>
  <section id="docs-explore" className="docs-overview__section">
   <h2>Explore the library</h2>
   <div className="docs-overview__grid docs-overview__grid--visual">
    {sections.map(item=><a className="docs-overview__card docs-overview__card--visual" href={item.route} key={item.title}>
     <div className="docs-overview__card-bottom">
      <div><h3>{item.title}</h3><p>{item.description}</p></div>
      <Icon name="arrow"/>
     </div>
    </a>)}
   </div>
  </section>
  <section id="docs-principles" className="docs-overview__section docs-overview__more">
   <h2>More to explore</h2>
   <div className="docs-overview__more-links">
    <a href={href('foundations','layout')}><span>Layout & spacing</span><small>Responsive grids and spacing</small><Icon name="arrow"/></a>
    <a href={href('guidelines')}><span>Guides</span><small>How to use the design system</small><Icon name="arrow"/></a>
   </div>
  </section>
 </div>;
}
