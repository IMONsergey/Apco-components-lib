import type { ReactNode, RefObject } from 'react';
import type { ProductSceneName as ResearchScene } from '../product/ProductScene';
import './application-scene.css';

export type ApplicationScene = ResearchScene | 'api';

const designNodes: Record<ApplicationScene, string> = {
  query: '899:4021',
  results: '899:4117',
  host: '899:5079',
  evidence: '903:48414',
  suggestions: '903:48044',
  api: '903:53837',
};

/** A responsive excerpt of the application, with readable HTML before animation loads. */
export function ApplicationFrame({
  scene,
  frameRef,
  children,
}: {
  scene: ApplicationScene;
  frameRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  return (
    <div
      ref={frameRef}
      className="application-scene"
      data-scene={scene}
      data-design-source="apcosys-application"
      data-design-url="https://assaasdev.vercel.app"
      data-design-node={designNodes[scene]}
      data-demo-playback="static"
      data-demo-phase="0"
      aria-hidden="true"
      inert
    >
      {children}
      <span className="application-demo-cursor" />
    </div>
  );
}
