import { createRoot } from 'react-dom/client';
import { Diagnostic } from './poc/Diagnostic';
import './style.css';
createRoot(document.getElementById('root')!).render(<Diagnostic />);
