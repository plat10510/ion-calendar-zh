# Ionic Calendar (粗仿钉钉)

![image](https://github.com/plat10510/ion-calendar-zh/blob/master/calendar.png)


直接拿别人写的来改的日历组件，把英文都换成中文了。

## Ionic Support

This module was tested to Ionic v3.19.0.

### Installing

Go ahead and install via NPM

```
npm install ion-calendar-zh --save
npm i jquery
```

想要左滑右滑效果的话自己添加animate.css到index.html，如：
```
<link href="assets/css/animate.css" rel="stylesheet">
```

Within your **app.module.ts** file, make sure to add the import.

```javascript
import { CalendarModule } from 'ionic3-calendar-en';
@NgModule({
  ...
imports: [
  ...
  CalendarModule,
  ...
]
  ...
})
```

## Usage / Getting started

Basic usage is as follows:

```javascript

<ion-calendar #calendar></ion-calendar>


```

To make days clickable, and emit back information about the day selected, include the onDaySelect binding.

```javascript
<ion-calendar #calendar (onDaySelect)="onDaySelect($event)"></ion-calendar>
```

You can add a button to jump to today, for ease of navigation:

```javascript
<button ion-button (click)="calendar.today()">Jump to Today</button>
```

### Events

Adding events to the calendar, as seen in the screenshot atop, those tiny notification blips can appear on a given day, if your backend API responds with the right date makeup for the given month. I suggest you write something that provides data for the former and the latter month, for the sake of edge days on a given month. The month number starts from 0 for January to 11 for December.

Accepted format of data:

```javascript
this.currentEvents = [
  {
    year: 2017,
    month: 11,
    date: 25
  },
  {
    year: 2017,
    month: 11,
    date: 26
  }
];
```

The consequent invocation of these events would be done like so:

```javascript
<ion-calendar #calendar [events]="currentEvents" (onDaySelect)="onDaySelect($event)" (onMonthSelect)="onMonthSelect($event)"></ion-calendar>
```

### Changelog

> 2020-05-18
>> 汉化
>> 更换样式
>> 增加左滑右滑切换

## Authors

* **Laker Liu** - *Initial work* - [Ionic3-Calendar](https://github.com/laker007/ionic3-calendar)
* [ionic3-calendar-en](https://github.com/gbrits/ionic-calendar)

**It's not what you start in life, it's what you finish.**

