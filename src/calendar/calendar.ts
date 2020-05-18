import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import * as _ from "lodash";
import * as $ from "jquery";

@Component({
    selector: 'ion-calendar',
    template: `
    <div class="cal-head">
        <div class="head-year">{{selectYear}}年</div>
        <div class="head-day">{{selectMonth+1}}月{{displayDate}}日周{{weekHead[displayDay]}}</div>
    </div>
    <ion-grid id="cal-grid" (swipe)="swipeEvnet($event)">
        <ion-row justify-content-center>
            <ion-col class="arrow" col-3 (click)="back()" style="text-align:center;">
                <ion-icon name="ios-arrow-back"></ion-icon>
            </ion-col>
            <ion-col class="arrow" col-6 style="text-align:center;">
                <ion-datetime (ionChange)="change($event)" displayFormat="YYYY年MM月" 
                pickerFormat="YYYY/MM" [(ngModel)]="ngMonth" cancelText="取消" doneText="确定"
                max="2050" [pickerOptions]="pickerOption"></ion-datetime>
            </ion-col>
            <ion-col class="arrow" col-3 (click)="forward()" style="text-align:center;">
                <ion-icon name="ios-arrow-forward"></ion-icon>
            </ion-col>
        </ion-row>

        <ion-row>
            <ion-col class="center calendar-header-col" *ngFor="let head of weekHead">{{head}}</ion-col>
        </ion-row>

        <div id="cal-body">
            <ion-row class="calendar-row" *ngFor="let week of weekArray;let i = index">
                <ion-col class="center calendar-col day-col" (click)="daySelect(day,i,j)"
                *ngFor="let day of week;let j = index"
                [ngClass]="[day.isThisMonth?'this-month':'not-this-month',day.isToday?'today':'',day.isSelect?'select':'']">
                    <span class="daydate">{{day.date}}</span>
                    <span class="eventBlip" *ngIf="day.hasEvent"></span>
                </ion-col>
            </ion-row>
        </div>
        

    </ion-grid>
`
})

export class Calendar {

    @Output() onDaySelect = new EventEmitter<dateObj>();
    @Output() onMonthSelect = new EventEmitter<any>();
    @Input() events: Array<singularDate> = [];
    @Input() weekHead: string[] = ['日', '一', '二', '三', '四', '五', '六'];

    currentYear: number = moment().year();
    currentMonth: number = moment().month();
    currentDate: number = moment().date();
    currentDay: number = moment().day();

    displayYear: number = moment().year();
    selectYear: number = 0;
    displayMonth: number = moment().month();
    selectMonth: number = 0;
    
    displayDate: number = moment().date();
    displayDay: number = moment().day();

    dateArray: Array<dateObj> = []; // Array for all the days of the month
    weekArray = []; // Array for each row of the calendar
    lastSelect: number = 0; // Record the last clicked location
    ngMonth = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();

    pickerOption = {
        buttons:[{
            text:"今天",
            handler: ()=>{
                this.today();
            }
        }]
    }

    constructor() {
        this.createMonth(this.displayYear, this.displayMonth);
    }

    ngOnChanges() {
      this.createMonth(this.displayYear, this.displayMonth);
    }

    ngAfterContentInit() {
        this.today();
    }

    swipeEvnet(e){
        //向左滑
        if (e.direction == 2) {
            this.forward();
        }
        //向右滑
        if (e.direction == 4) {
            this.back();
        }
    }

    // Jump to today
    today() {
        this.displayYear = this.currentYear;
        this.selectYear = this.currentYear;
        this.displayMonth = this.currentMonth;
        this.selectMonth = this.currentMonth;
        this.displayDate = this.currentDate;
        this.displayDay = this.displayDay;
        this.createMonth(this.currentYear, this.currentMonth);

        // Mark today as a selection
        let todayIndex = _.findIndex(this.dateArray, {
            year: this.currentYear,
            month: this.currentMonth,
            date: this.currentDate,
            isThisMonth: true
        })
        this.lastSelect = todayIndex;
        this.dateArray[todayIndex].isSelect = true;

        this.onDaySelect.emit(this.dateArray[todayIndex]);

        this.ngMonth = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();
    }

    isInEvents(year, month, date) {
      var i=0, len=this.events.length;
      for (; i<len; i++) {
        if (this.events[i].year == year && this.events[i].month == month && this.events[i].date == date) {
          return true;
        }
      }
      return false;
    }

    createMonth(year: number, month: number) {
        this.dateArray = []; // Clear last month's data
        this.weekArray = []; // Clear week data

        let firstDay;
        // The day of the week on the first day of the current month of
        // selection determines how many days to take out last month. Sunday
        // does not show last month, Monday shows the previous month, Tuesday
        // shows the last two days

        let preMonthDays; // The number of days for the previous month
        let monthDays; // The number of days for the month
        let weekDays: Array<dateObj> = [];

        firstDay = moment({ year: year, month: month, date: 1 }).day();
        // The number of days last month
        if (month === 0) {
            preMonthDays = moment({ year: year - 1, month: 11 }).daysInMonth();
        } else {
            preMonthDays = moment({ year: year, month: month - 1 }).daysInMonth();
        }
        // The number of days this month
        monthDays = moment({ year: year, month: month }).daysInMonth();

        // PREVIOUS MONTH
        // Add the last few days of the previous month to the array
        if (firstDay !== 7) { // Sunday doesn't need to be shown for the previous month
            let lastMonthStart = preMonthDays - firstDay + 1; // From the last few months start
            for (let i = 0; i < firstDay; i++) {
                if (month === 0) {
                    this.dateArray.push({
                        year: year,
                        month: 11,
                        date: lastMonthStart + i,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        hasEvent: (this.isInEvents(year, 11, lastMonthStart+i)) ? true : false,
                    })
                } else {
                    this.dateArray.push({
                        year: year,
                        month: month - 1,
                        date: lastMonthStart + i,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        hasEvent: (this.isInEvents(year, month-1, lastMonthStart+i)) ? true : false,
                    })
                }

            }
        }

        // Add the numeral for this month to the array
        for (let i = 0; i < monthDays; i++) {
            this.dateArray.push({
                year: year,
                month: month,
                date: i + 1,
                isThisMonth: true,
                isToday: false,
                isSelect: false,
                hasEvent: (this.isInEvents(year, month, i+1)) ? true : false,
            })
        }

        if (this.currentYear === year && this.currentMonth === month) {
            let todayIndex = _.findIndex(this.dateArray, {
                year: this.currentYear,
                month: this.currentMonth,
                date: this.currentDate,
                isThisMonth: true
            })
            this.dateArray[todayIndex].isToday = true;
        }

        // Add the number of days next month to the array, with some months showing 6 weeks and some months showing 5 weeks
        if (this.dateArray.length % 7 !== 0) {
            let nextMonthAdd = 7 - this.dateArray.length % 7
            for (let i = 0; i < nextMonthAdd; i++) {
                if (month === 11) {
                    this.dateArray.push({
                        year: year,
                        month: 0,
                        date: i + 1,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        hasEvent: (this.isInEvents(year, 0, i+1)) ? true : false,
                    })
                } else {
                    this.dateArray.push({
                        year: year,
                        month: month + 1,
                        date: i + 1,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        hasEvent: (this.isInEvents(year, month+1, i+1)) ? true : false,
                    })
                }

            }
        }

        // All date data is now added to the dateArray array

        // Insert the date data into the new array every seven days
        for (let i = 0; i < this.dateArray.length / 7; i++) {
            for (let j = 0; j < 7; j++) {
                weekDays.push(this.dateArray[i * 7 + j]);
            }
            this.weekArray.push(weekDays);
            weekDays = [];
        }
    }

    change(e) {
        this.displayMonth = e.month-1;
        this.displayYear = e.year;
        this.createMonth(this.displayYear, this.displayMonth);
    }

    back() {
        $('#cal-body').addClass('animated infinite slideInLeft faster');
        setTimeout(()=>{
            $('#cal-body').removeClass('animated infinite slideInLeft faster');
        },200);
        // Decrementing the year if necessary
        if (this.displayMonth === 0) {
            this.displayYear--;
            this.displayMonth = 11;
        } else {
            this.displayMonth--;
        }
        let monthSelect = {
            'year': this.displayYear,
            'month': this.displayMonth
        };
        this.onMonthSelect.emit(monthSelect);

        this.ngMonth = new Date(moment(monthSelect).toDate().getTime() + 8 * 60 * 60 * 1000).toISOString();
        this.createMonth(this.displayYear, this.displayMonth);
    }

    forward() {
        $('#cal-body').addClass('animated infinite slideInRight faster');
        setTimeout(() => {
            $('#cal-body').removeClass('animated infinite slideInRight faster');
        }, 200);
        // Incrementing the year if necessary
        if (this.displayMonth === 11) {
            this.displayYear++;
            this.displayMonth = 0;
        } else {
            this.displayMonth++;
        }
        let monthSelect = {
            'year': this.displayYear,
            'month': this.displayMonth
        };
        this.onMonthSelect.emit(monthSelect);

        this.ngMonth = new Date(moment(monthSelect).toDate().getTime() + 8 * 60 * 60 * 1000).toISOString();
        this.createMonth(this.displayYear, this.displayMonth);
    }

    // Select a day, click event
    daySelect(day, i, j) {
        // First clear the last click status
        this.dateArray[this.lastSelect].isSelect = false;
        // Store this clicked status
        this.lastSelect = i * 7 + j;
        this.dateArray[i * 7 + j].isSelect = true;

        this.displayDate = moment(day).date();
        this.displayDay = moment(day).day();
        this.selectMonth = moment(day).month();
        this.selectYear = moment(day).year();

        this.onDaySelect.emit(day);
    }
}

interface singularDate {
  year: number,
  month: number,
  date: number
}

// Each grid item of a calendar
interface dateObj {
    year: number,
    month: number,
    date: number, // What's the date?
    isThisMonth: boolean, // Is this the currently selected month?
    isToday?: boolean,
    isSelect?: boolean,
    hasEvent?: boolean,
}
