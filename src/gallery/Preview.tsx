import { lazy, Suspense, useState, type ReactNode } from 'react';
import PreviewBoundary from '../docs/PreviewBoundary';
import type { ComponentId } from '../catalog';
import { AnimatedPrice } from '../components/ui/AnimatedPrice';
import { DoubleButton } from '../components/ui/DoubleButton';
import { AnimatedDetails } from '../components/ui/AnimatedDetails';
import { BillingSwitch } from '../components/ui/BillingSwitch';
import type { BillingPeriod } from '../content/pricing';
import PartnerMarquee from '../visuals/marquee/PartnerMarquee';
import {PlainButton,IconAction,SearchField,NavDisclosure,LanguageButton,UseCaseTags,PlanCard,ModalExample} from '../components/system/SitePrimitives';

const Flow = lazy(() => import('../visuals/flow/TurquoiseFlow'));
const Dots = lazy(() => import('../visuals/dots/DotCascade'));
const Globe = lazy(() => import('../visuals/globe/SignalGlobe'));
const Waves = lazy(() => import('../visuals/waves/IceSphereWaves'));
const Shape = lazy(() => import('../visuals/shapes/AnimatedShape'));
const ChatOrb = lazy(() => import('../visuals/uploads/ai-chat/AIChatOrb'));
const OrbCube = lazy(() => import('../visuals/uploads/orb-cube/OrbCubeLoader'));
const ProductScene = lazy(() => import('../visuals/product/ProductScene'));
const ApiScene = lazy(() => import('../visuals/api/ApiScene'));

export default function Preview({ id, active, tone, speed, large = false }: {
  id: ComponentId; active: boolean; tone: 'light' | 'dark'; speed: number; large?: boolean;
}) {
  const [chat, setChat] = useState<'idle' | 'thinking' | 'answer'>('idle');
  const [price, setPrice] = useState(89);
  const [period, setPeriod] = useState<BillingPeriod>('monthly');

  if (!active) return <div className="lib-preview__blank" aria-hidden="true" />;
  const dark = tone === 'dark';
  let content: ReactNode;

  switch (id) {
    case 'flow':
      content = <Flow theme={tone} speed={speed} fps={30}/>;
      break;
    case 'dots':
      content = <Dots fps={30} startOpacity={0.55} endOpacity={0.02}
        color={dark ? '#A9DCE2' : '#03879f'} />;
      break;
    case 'globe':
      content = <Globe speed={0.85 * speed} fps={30} renderer="canvas2d"
        interactive pixelRatio={1.5} landColor={dark ? '#5FAFBC' : '#6AB6C2'}
        shellColor={dark ? '#2E3B40' : '#FFFFFF'}
        signalColor={dark ? '#42C0CF' : '#269CAD'}/>;
      break;
    case 'waves':
      content = <Waves theme={tone} speed={0.7 * speed}/>;
      break;
    case 'rosette':
    case 'echo':
      content = <Shape kind={id === 'echo' ? 'echo' : 'rosette'} speed={0.75 * speed}
        strength={0.65} fps={30} opacity={0.42} strokeWidth={1.35}
        color={dark ? '#A8B5BA' : '#121314'}/>;
      break;
    case 'ai-orb':
      content = <div className="lib-orb-demo">
        <ChatOrb state={chat} size={large ? 170 : 130}/>
        <div className="lib-orb-states">
          {(['idle', 'thinking', 'answer'] as const).map(state =>
            <button key={state} type="button" data-active={chat === state}
              onClick={() => setChat(state)}>{state}</button>)}
        </div>
      </div>;
      break;
    case 'orb-cube':
      content = <OrbCube size={large ? 185 : 145} speed={speed} fps={30}
        color={dark ? '#F6FAFB' : '#121314'} label="Loading"/>;
      break;
    case 'query': case 'results': case 'host': case 'evidence': case 'suggestions':
      content = <ProductScene scene={id}/>;
      break;
    case 'api':
      content = <ApiScene/>;
      break;
    case 'price':
      content = <div className="lib-price-demo">
        <AnimatedPrice amount={price}/>
        <div className="lib-price-options">
          {[49, 89, 129].map(amount =>
            <button key={amount} type="button" data-active={amount === price}
              onClick={() => setPrice(amount)}>${amount}</button>)}
        </div>
      </div>;
      break;
    case 'button':
      content = <div className="lib-button-demo">
        <DoubleButton variant="primary">Get started</DoubleButton>
        <DoubleButton variant="secondary">Learn more</DoubleButton>
        <DoubleButton variant="inverse">Explore</DoubleButton>
        <DoubleButton variant="dark">Contact us</DoubleButton>
      </div>;
      break;
    case 'accordion':
      content = <div className="lib-accordion-demo">
        <div className="faq-list">
          <AnimatedDetails title="Can I use the API?" initialOpen>
            <p>API access is available on Plus, Expert and Business plans.</p>
          </AnimatedDetails>
          <AnimatedDetails title="How does the Free plan work?">
            <p>The Free plan introduces APCOSYS for personal use.</p>
          </AnimatedDetails>
        </div>
      </div>;
      break;
    case 'marquee':
      content = <div className="lib-marquee-demo"><PartnerMarquee/></div>;
      break;
    case 'billing':
      content = <div className="lib-segment-demo">
        <BillingSwitch value={period} onChange={setPeriod}/>
      </div>;
      break;
    case 'planbutton':
      content = <div className="lib-plan-demo">
        <button className="plan-button" type="button">Get started</button>
      </div>;
      break;

    case 'plain':
      content = <PlainButton>Sign in</PlainButton>;
      break;
    case 'iconaction':
      content = <div className="ds-action-preview"><IconAction name="search" label="Search"/><IconAction name="appearance" label="Theme"/><IconAction name="close" label="Close"/><IconAction name="plus" label="Add" disabled/></div>;
      break;
    case 'searchfield':
      content = <SearchField />;
      break;
    case 'navmenu':
      content = <NavDisclosure label="Platform" />;
      break;
    case 'language':
      content = <LanguageButton/>;
      break;
    case 'tags':
      content = <UseCaseTags/>;
      break;
    case 'plancard':
      content = <PlanCard/>;
      break;
    case 'modal':
      content = <ModalExample/>;
      break;
  }
  return <PreviewBoundary key={id}><Suspense fallback={<div className="lib-preview lib-preview__blank"><span className="lib-preview__loading" aria-label="Loading"/></div>}>
    <div className={`lib-preview lib-preview--${id}`}>{content}</div>
  </Suspense></PreviewBoundary>;
}
