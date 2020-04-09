import {
  Controller
} from './controller';
import {
  loadPluginCss
} from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/echarts-panel-demo/css/dark.css',
  light: 'plugins/echarts-panel-demo/css/light.css',
});

export {
  Controller as PanelCtrl
};