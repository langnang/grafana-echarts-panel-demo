import {
  Controller
} from './controller';
import {
  loadPluginCss
} from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/empty-panel/css/dark.css',
  light: 'plugins/empty-panel/css/light.css',
});

export {
  Controller as PanelCtrl
};