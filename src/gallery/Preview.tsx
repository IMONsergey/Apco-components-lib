import { lazy, Suspense, useState, type ReactNode } from 'react';
import type { ComponentId } from '../catalog';
import { AnimatedPrice } from '../components/ui/AnimatedPrice';
import { DoubleButton } from '../components/ui/DoubleButton';
import { AnimatedDetails } from '../components/ui/AnimatedDetails';
import { BillingSwitch } from '../components/ui/BillingSwitch';
import type { BillingPeriod } from '../content/pricing';
import PartnerMarquee from '../visuals/marquee/PartnerMarquee';
import {PlainButton,IconAction,SearchField,NavDisclosure,LanguageButton,UseCaseTags,PlanCard,ModalExample} from '../components/system/SitePrimitives';
import { visualExampleProps, type ChatState } from './visual-examples';

const Flow = lazy(() => import('../visuals/flow/TurquoiseFlow'));
const Dots = lazy(() => import('../visuals/dots/DotCascade'));
const Globe = lazy(() => import('../visuals/globe/SignalGlobe'));
const Waves = lazy(() => import('../visuals/waves/IceSphereWaves'));
const Shape = lazy(() => import('../visuals/shapes/AnimatedShape'));
const ChatOrb = lazy(() => import('../visuals/uploads/ai-chat/AIChatOrb'));
const OrbCube = lazy(() => import('../visuals/uploads/orb-cube/OrbCubeLoader'));
const ProductScene = lazy(() => import('../visuals/product/ProductScene'));
const ApiScene = lazy(() => import('../visuals/api/ApiScene'));

export type PreviewConfiguration = {
  variant?: 'primary' | 'secondary' | 'inverse' | 'dark';
  disabled?: boolean;
  plan?: 'free' | 'plus' | 'expert' | 'business';
  period?: BillingPeriod;
  amount?: number;
  chatState?: ChatState;
};
export default function Preview({ id, active, tone, speed, large = false, configuration, onConfigurationChange }: {
  id: ComponentId; active: boolean; tone: 'light' | 'dark'; speed: number; large?: boolean;
  configuration?: PreviewConfiguration; onConfigurationChange?: (value: Partial<PreviewConfiguration>) => void;
}) {
  const [chat, setChat] = useState<ChatState>('idle');
  const [price, setPrice] = useState(50);
  const [message, setMessage] = useState('');
  const [period, setPeriod] = useState<BillingPeriod>('monthly');

  if (!active) return <div className="lib-preview__blank" aria-hidden="true" />;
  const chatState = configuration?.chatState ?? chat;
  const visual = visualExampleProps({ tone, speed, large, chatState });
  let content: ReactNode;

  switch (id) {
    case 'flow':
      content = <Flow {...visual.flow}/>;
      break;
    case 'dots':
      content = <Dots {...visual.dots}/>;
      break;
    case 'globe':
      content = <Globe {...visual.globe}/>;
      break;
    case 'waves':
      content = <Waves {...visual.waves}/>;
      break;
    case 'rosette':
    case 'echo':
      content = <Shape {...visual[id]}/>;
      break;
    case 'ai-orb':
      content = <div className="lib-orb-demo">
        <ChatOrb {...visual['ai-orb']}/>
        <div className="lib-orb-states" role="group" aria-label="Состояние индикатора ассистента">
          {(['idle', 'thinking', 'answer'] as const).map(state =>
            <button key={state} type="button" data-active={chatState === state} aria-pressed={chatState === state}
              onClick={() => { setChat(state); onConfigurationChange?.({ chatState: state }); }}>{state}</button>)}
        </div>
      </div>;
      break;
    case 'orb-cube':
      content = <OrbCube {...visual['orb-cube']}/>;
      break;
    case 'query': case 'results': case 'host': case 'evidence': case 'suggestions':
      content = <ProductScene scene={id}/>;
      break;
    case 'api':
      content = <ApiScene/>;
      break;
    case 'price':
      content = <div className="lib-price-demo">
        <AnimatedPrice amount={configuration?.amount ?? price}/>
        <div className="lib-price-options">
          {!configuration && [40, 50, 300].map(amount =>
            <button key={amount} type="button" data-active={amount === price}
              onClick={() => setPrice(amount)}>${amount}</button>)}
        </div>
      </div>;
      break;
    case 'button':
      content = configuration ? <DoubleButton variant={configuration.variant ?? 'primary'} disabled={configuration.disabled ?? false} onClick={() => setMessage('Действие выполнено в примере')}>Продолжить</DoubleButton> : <div className="lib-button-demo">
        <DoubleButton variant="primary" onClick={() => setMessage('Основное действие')}>Get started</DoubleButton>
        <DoubleButton variant="secondary" onClick={() => setMessage('Дополнительное действие')}>Learn more</DoubleButton>
        <DoubleButton variant="inverse" onClick={() => setMessage('Инверсный вариант')}>Explore</DoubleButton>
        <DoubleButton variant="dark" onClick={() => setMessage('Тёмный вариант')}>Contact us</DoubleButton>
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
        <BillingSwitch value={configuration?.period ?? period} onChange={value => { setPeriod(value); onConfigurationChange?.({ period: value }); }}/>
      </div>;
      break;
    case 'planbutton':
      content = <div className="lib-plan-demo">
        <button className="plan-button" type="button" onClick={() => setMessage('Тариф выбран в примере')}>Get started</button>
      </div>;
      break;

    case 'plain':
      content = <PlainButton disabled={configuration?.disabled ?? false} onClick={() => setMessage('Отмена в примере')}>{configuration ? 'Отмена' : 'Sign in'}</PlainButton>;
      break;
    case 'iconaction':
      content = configuration ? <IconAction name="search" label="Найти" disabled={configuration.disabled ?? false} onClick={() => setMessage('Поиск вызван в примере')} /> : <div className="ds-action-preview"><IconAction name="search" label="Search" onClick={() => setMessage('Поиск')}/><IconAction name="appearance" label="Theme" onClick={() => setMessage('Тема меняется кнопкой в шапке')}/><IconAction name="close" label="Close" onClick={() => setMessage('Закрытие')}/><IconAction name="plus" label="Add" disabled/></div>;
      break;
    case 'searchfield':
      content = <SearchField placeholder="IP, домен или запрос" onSearch={value => setMessage(value.trim() ? 'Запрос в примере: ' + value : 'Введите запрос')} />;
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
      content = <PlanCard id={configuration?.plan ?? 'plus'} period={configuration?.period ?? 'monthly'} onSelect={() => setMessage('Тариф выбран в примере. Заказ не создаётся.')} />;
      break;
    case 'modal':
      content = <ModalExample/>;
      break;
  }
  return <Suspense fallback={<div className="lib-preview lib-preview__blank"><span className="lib-preview__loading" aria-label="Loading"/></div>}>
    <div className={`lib-preview lib-preview--${id}`}>{content}{message && <p className="docs-demo-feedback" role="status">{message}</p>}</div>
  </Suspense>;
}
