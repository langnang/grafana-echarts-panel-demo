# grafana-echarts-panel-demo

适用于 Grafana 的 Echarts 图表插件

## Install

- Node
- Grafana
- Grunt

  ```bat
  npm install -g grunt-cli
  ```

## Tree

```tree
grafana-echarts-panel-demo
  ├─dist                           Grunt打包输出目录
  ├─libs                           插件目录
  │  └─echarts.min.js
  ├─src                            源代码目录
  │  ├─css
  │  ├─img
  │  ├─partials                    Grafana插件控制台布局
  │  ├─controller.js
  │  ├─module.js                   入口主文件
  │  └─plugin.json                 Panel信息设定
  ├─CHANGELOG.md                   更新日志
  ├─package.json                   入口设置
  └─README.md
```

## Config

> Panel 相关基本信息修改后，需打包并重启 grafana-server

### package.json

```json
{
  "main": "src/module.js"
}
```

### plugin.json

```json
{
  "type": "panel",
  "name": "Echarts Panel Demo",
  "id": "echarts-panel-demo",
  "keywords": ["panel"],
  "info": {
    "logos": {
      "small": "src/img/logo.png",
      "large": "src/img/logo.png"
    }
  }
}
```

### module.js

```js
import { Controller } from "./controller";
import { loadPluginCss } from "app/plugins/sdk";

loadPluginCss({
  dark: "plugins/echarts-panel-demo/css/dark.css",
  light: "plugins/echarts-panel-demo/css/light.css"
});

export { Controller as PanelCtrl };
```

### controller.js

```js
export class Controller extends MetricsPanelCtrl {
  // 构造方法，在对象被创建时或实例化时调用
  constructor($scope, $injector) {}
  onDataReceived(dataList) {}
  onDataError(err) {}
  onInitEditMode() {}
  // 使用AJAX异步请求数据，当成功后调用this.onDataReceived()。
  // 自执行设置
  refreshData() {}
  // 当Controller被Angular编译后执行
  link(scope, elem, attrs, ctrl) {
    const $panelContainer = elem.find(".echarts_container")[0];
    // 创建Echarts实例
    let myChart = echarts.init($panelContainer, "dark");
    function render() {
      // 避免因移动、缩放等操作而重复请求数据
      if (ctrl.refreshed) {
        // 配置Echarts实例
        myChart.setOption({});
      }
    }
    this.events.on("render", function() {
      render();
      ctrl.renderingCompleted();
    });
  }
}
Controller.templateUrl = "partials/module.html";
```

```js
constructor($scope, $injector) {
    // 继承父类this对象
    super($scope, $injector);
    var panelDefaults = {};
    // Lodash，分配来源对象的可枚举属性到目标对象所有解析为undefined的属性上
    _.defaults(this.panel, panelDefaults);
    // DataSource 查询成功后触发
    this.events.on("data-received", this.onDataReceived.bind(this));
    // DataSource 查询失败后触发
    this.events.on("data-error", this.onDataError.bind(this));
    // 数据快照加载，在Dashboard加载时触发
    this.events.on("data-snapshot-load", this.onDataReceived.bind(this));
    this.events.on("init-edit-mode", this.onInitEditMode.bind(this));
    // 初始化Panel控制台布局
    this.events.on("panel-initialized", this.render.bind(this));
    // 请求数据
    this.refreshData();
}
```

## Development

### DataSource

```sql
-- MySQL
CREATE DATABASE `grafana-echarts-panel`;

use `grafana-echarts-panel`;

CREATE TABLE `demo`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `value` int(255) NULL DEFAULT NULL,
  `datetime` datetime(0) NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
);
```

```sql
INSERT INTO `grafana-echarts-panel`.`demo`(`name`, `value`, `datetime`) VALUES ('测试001', 100, NOW());
INSERT INTO `grafana-echarts-panel`.`demo`(`name`, `value`, `datetime`) VALUES ('测试002', 300, NOW());
INSERT INTO `grafana-echarts-panel`.`demo`(`name`, `value`, `datetime`) VALUES ('测试003', 200, NOW());
INSERT INTO `grafana-echarts-panel`.`demo`(`name`, `value`, `datetime`) VALUES ('测试004', 400, NOW());
INSERT INTO `grafana-echarts-panel`.`demo`(`name`, `value`, `datetime`) VALUES ('测试005', 500, NOW());
INSERT INTO `grafana-echarts-panel`.`demo`(`name`, `value`, `datetime`) VALUES ('测试006', 300, NOW());
INSERT INTO `grafana-echarts-panel`.`demo`(`name`, `value`, `datetime`) VALUES ('测试007', 100, NOW());
INSERT INTO `grafana-echarts-panel`.`demo`(`name`, `value`, `datetime`) VALUES ('测试008', 500, NOW());
INSERT INTO `grafana-echarts-panel`.`demo`(`name`, `value`, `datetime`) VALUES ('测试009', 200, NOW());
INSERT INTO `grafana-echarts-panel`.`demo`(`name`, `value`, `datetime`) VALUES ('测试010', 400, NOW());
```

## Build

```bat
grunt
```
