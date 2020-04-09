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
    // 初始化编辑模式，控制台布局
    this.events.on("init-edit-mode", this.onInitEditMode.bind(this));
    // Panel布局改变时触发，如移动、缩放
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

```sql
SELECT `name`,`value` FROM demo ORDER BY `id`;
```

### Console

```js
var panelDefaults = {
  columns: [], // 查询结果所有列名
  chartsOption: {
    xAxis: {
      type: "category",
      boundaryGap: false, // 坐标轴两边是否留白
      data: []
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        type: "line",
        data: [],
        smooth: false // 是否平滑曲线显示
      }
    ]
  },
  _chartsOption: {
    xAxis: {
      columns: [], // 过滤折现后的列名数组
      dataColumn: "" // X轴对应查询结果列名
    },
    series: {
      line: {
        areaStyle: false, // 是否显示区域填充
        columns: [], // 过滤x轴后的列名数组
        dataColumn: "" // 折线对应查询结果列名
      }
    }
  }
};
```

```html
<!-- ng-model 指令用于绑定应用程序数据到 HTML 控制器(input, select, textarea)的值。 -->
<!-- ng-options 指令使用数组来填充下拉列表 -->
<!-- ng-change 事件在值的每次改变时触发，它不需要等待一个完成的修改过程，或等待失去焦点的动作。 -->
<div class="gf-form">
  <label class="gf-form-label width-7">dataColumn</label>
  <div class="gf-form-select-wrapper">
    <select
      class="gf-form-input"
      ng-model="ctrl.panel._chartsOption.xAxis.dataColumn"
      ng-options="i for i in ctrl.panel._chartsOption.xAxis.columns"
      ng-change="ctrl.refresh()"
    ></select>
  </div>
</div>
```

### onDataReceived&&render

```js
// onDataReceived
onDataReceived(dataList) {
    const _data = dataList[0];
    this.panel.columns = [..._data.columns.map(v => v.text), ""]; // [ "name","value" ]
    // 过滤备选列
    this.panel._chartsOption.xAxis.columns = this.panel.columns.filter(v => v != this.panel._chartsOption.series.line.dataColumn);
    this.panel._chartsOption.series.line.columns = this.panel.columns.filter(v => v != this.panel._chartsOption.xAxis.dataColumn);
    // 取值
    this.panel.chartsOption.xAxis.data = _data.rows.map(v => v[this.panel.columns.indexOf(this.panel._chartsOption.xAxis.dataColumn)]);
    this.panel.chartsOption.series[0].data = _data.rows.map(v => v[this.panel.columns.indexOf(this.panel._chartsOption.series.line.dataColumn)]);
    // 是否留白
    if (this.panel._chartsOption.series.line.areaStyle) {
      this.panel.chartsOption.series[0].areaStyle = {};
    } else {
      delete this.panel.chartsOption.series[0].areaStyle;
    }
    this.refreshed = true;
    this.render();
    this.refreshed = false;
  }
```

```js
// render
function render() {
  let option = ctrl.panel.chartsOption;
  // 配置Echarts实例
  myChart.setOption(option);
}
```

## Build

```bat
grunt
```
