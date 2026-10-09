import { Logo } from '../components/ui/Logo';
import { Icon } from '../components/ui/Icon';
import ColorWorkbench from './ColorWorkbench';
import { useDesignDraft } from './draft-store';
import DraftToolbar from './DraftToolbar';
import { TypographyReference, SpacingReference, LayoutReference, MotionReference } from './FoundationEditable';

type Theme = 'light' | 'dark';
const base=import.meta.env.BASE_URL;
export default function FoundationsPage({tone,jumpTo}:{tone:Theme;jumpTo?:string}){
  const {editing}=useDesignDraft();
  const heading=(title:string,slug:string)=>jumpTo===slug?<h1 className="ds-focused-title">{title}</h1>:<h2>{title}</h2>;
  return <div className="ds-foundations ds-foundations--compact" data-focus={jumpTo||undefined}>
    {!jumpTo&&<DraftToolbar editing={Object.values(editing).some(Boolean)}/>}

    {(!jumpTo||jumpTo==='identity')&&<section className="ds-section" id="ds-identity">
      <div className="ds-section-bar">{heading('Logo','identity')}</div>
      {jumpTo==='identity'&&<DraftToolbar/>}
      <div className="ds-brand-grid">
        <a className="ds-brand-sample ds-brand-sample--light" href={base+'assets/brand/wordmark-light.svg'} target="_blank" rel="noreferrer" title="Open light logo SVG">
          <img src={base+'assets/brand/wordmark-light.svg'} alt="APCOSYS light wordmark"/><span>Light SVG <Icon name="external"/></span>
        </a>
        <a className="ds-brand-sample ds-brand-sample--dark" href={base+'assets/brand/wordmark-dark.svg'} target="_blank" rel="noreferrer" title="Open dark logo SVG">
          <img src={base+'assets/brand/wordmark-dark.svg'} alt="APCOSYS dark wordmark"/><span>Dark SVG <Icon name="external"/></span>
        </a>
      </div>
      <div className="ds-reference-block ds-identity-details" id="ds-symbols">
        <h3>Symbols & logo usage</h3>
        <div className="ds-identity-extra">
          <div><span>Responsive website mark</span><Logo/></div>
          <a href={base+'assets/brand/symbol-light.svg'} target="_blank" rel="noreferrer"><img src={base+'assets/brand/symbol-light.svg'} alt="Light symbol"/>Light symbol <Icon name="external"/></a>
          <a href={base+'assets/brand/symbol-dark.svg'} target="_blank" rel="noreferrer"><img src={base+'assets/brand/symbol-dark.svg'} alt="Dark symbol"/>Dark symbol <Icon name="external"/></a>
        </div>
        <p className="ds-caption">Use the supplied SVG geometry without distortion. Select the appropriate variant for the background.</p>
      </div>
    </section>}

    {(!jumpTo||jumpTo==='colors')&&<section className="ds-section" id="ds-colors">
      <ColorWorkbench tone={tone} focused={jumpTo==='colors'}/>
    </section>}

    {(!jumpTo||jumpTo==='typography')&&<section className="ds-section" id="ds-type">
      <TypographyReference focused={jumpTo==='typography'}/>
    </section>}

    {(!jumpTo||jumpTo==='spacing')&&<section className="ds-section" id="ds-spacing">
      <SpacingReference focused={jumpTo==='spacing'}/>
    </section>}

    {(!jumpTo||jumpTo==='layout')&&<section className="ds-section" id="ds-layout">
      <LayoutReference focused={jumpTo==='layout'}/>
    </section>}

    {(!jumpTo||jumpTo==='motion')&&<section className="ds-section" id="ds-motion">
      <MotionReference focused={jumpTo==='motion'}/>
    </section>}
  </div>;
}
