/* @refresh reload */

import { render } from 'solid-js/web';
import { HashRouter, Route } from '@solidjs/router';
import 'solid-devtools';
import './bootstrap.min.css';
import './styles.css';
import './fontandcolor.css';
import App from './App';
import Banner from './Banner';
import Side from './Side';

const root = document.getElementById('root');

render(
  () => (
    <HashRouter>
      <Route path="/" component={App} />
      <Route path="/banner" component={Banner} />
      <Route path="/side" component={Side} />
    </HashRouter>
  ),
  root!
);
