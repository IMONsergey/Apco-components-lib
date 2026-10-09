import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/instrument-sans.css';
import './styles/ibm-plex-mono.css';
import './styles/tokens.css';
import './styles/theme-page.css';
import './styles/source-components.css';
import './styles/theme-demos.css';
import './styles/trust-marquee.css';
import './styles/micro-motion.css';
import './styles/gallery.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
