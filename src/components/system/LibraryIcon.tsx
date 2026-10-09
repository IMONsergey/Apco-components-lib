import { Icon as NativeIcon, type IconName } from '../ui/Icon';

export type IconFamily = 'apcosys' | 'feather' | 'phosphor';
export type LibraryIconProps = {family:IconFamily;name:string;size?:number;stroke?:number};

/** Reusable icon renderer for product UIs.
 * Native uses the published 16-grid; open sets use local generated SVG sprites.
 * The site must serve public/icons/{feather,phosphor}.svg (npm ci generates them).
 */
export function LibraryIcon({family,name,size=24,stroke=1.5}:LibraryIconProps) {
  if (family === 'apcosys')
    return <NativeIcon name={name as IconName} width={size} height={size} strokeWidth={stroke} />;
  const url = import.meta.env.BASE_URL + 'icons/' + family + '.svg#' + family + '-' + name;
  return <svg className={'ds-icon ds-icon--'+family} width={size} height={size}
    viewBox={family==='phosphor'?'0 0 256 256':'0 0 24 24'}
    fill={family==='phosphor'?'currentColor':'none'} stroke={family==='feather'?'currentColor':'none'}
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <use href={url} />
  </svg>;
}
