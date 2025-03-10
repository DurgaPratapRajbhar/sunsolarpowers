import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

import { Provider } from 'react-redux';
import { store } from './app/store';

// createRoot(document.getElementById('root')!).render(


//   <StrictMode>
//       <Provider store={store}>
//     <App />
//     </Provider>
//   </StrictMode>,
  
// )

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
} else {
  console.error("Root element not found!");
}