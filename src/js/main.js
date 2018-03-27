// import "babel-polyfill";
window.addEventListener('DOMContentLoaded', init);

// import $ from 'jquery';

function init () {
    
class Calendar {
    constructor () {
        // helpers variable
        this.year = new Date().getFullYear();
        this.month = new Date().getMonth();
        this.weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

        // DOM
        this.calendarWrap = document.querySelector('.calendar-layout');
        this.calendarWeekDays = document.querySelector('.calendar-days');
        this.btns = document.querySelectorAll('.btn');
        this.monthName = document.querySelector('.month-name');
        this.yearName = document.querySelector('.year-name');  
        
        this._initCalendarLayout('day', 'day--bingo');
        this._initComponents(this.calendarWeekDays, 'dayWeek');
        this._events();
    }

    _events() {
        this.btns.forEach(el => {
            el.addEventListener('click', this._monthLayoutChange.bind(this))
        })
    }

    _initCalendarLayout(dayClass, dayActiveClass) {
        let d = new Date(this.year, this.month);
        let daysInMonth = this._daysInMonth(this.year, this.month)
        let firstDayInMonth = d.getDay();

        for (let i = 0; i < daysInMonth; i++) {
            let dayElem = document.createElement('LI');
            dayElem.classList.add(dayClass);
            dayElem.classList.add(dayActiveClass);
            dayElem.innerHTML = i + 1;
            if (i === 1) {
            }
            this.calendarWrap.appendChild(dayElem);
        }
        this.calendarWrap.firstChild.style.marginLeft = (firstDayInMonth !== 0) ? `${100 / 7 * (firstDayInMonth - 1)}%` : `${100 / 7 * 6}%`
        this.monthName.innerHTML = d.toLocaleString('ru', { month: "long" });
        this.yearName.innerHTML = d.getFullYear();
    }

    _clearCalendarLayout() {
        while (this.calendarWrap.firstChild) {
            this.calendarWrap.removeChild(this.calendarWrap.firstChild);
        }
    }
    
    _initComponents(weekDays, weekDaysClass) {
        this.weekDays.forEach(el => {
            let day = document.createElement('LI');
                day.innerHTML = el;
                day.classList.add(weekDaysClass);
            weekDays.appendChild(day);
        });
    }

    _daysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    _monthLayoutChange(e) {
        let target = e.target;
        let id = target.id;
        if(id === 'nextMonth') {
            if(this.month === 11) {
                this.month = 0;
                this.year++
            } else {
                this.month++;
            } 
        } else {
            if (this.month === 0) {
                this.month = 11;
                this.year--
            } else {
                this.month--;
            } 
        }
        this._clearCalendarLayout()
        this._initCalendarLayout('day', 'day--bingo', 'day--weekend');
    }

}


let newCalendar = new Calendar;



}








