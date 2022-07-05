import {createRoot} from 'react-dom/client';
import {css} from '@emotion/css';
import '@fontsource/inter';
import './styles/index.scss';
import {MetaBall} from './components/MetaBall';

const App = () => {
  return (
    <div
      className={css`
        display: grid;
        min-height: 100vh;
        width: 100%;
        place-items: center;
      `}
    >
      <MetaBall
        colorList={['#F3E1E1', '#FFECC7', '#FAB7B7', '#F5A8A8']}
        size={300}
        length={100}
        edgeCount={6}
        itemSize={30}
      />
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
