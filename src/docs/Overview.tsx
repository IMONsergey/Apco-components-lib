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
   <span className="docs-kicker">APCOSYS</span>
   <h1>Design library</h1>
   <p>Colors, typography, components and icons.</p>
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
 </div>;
}
