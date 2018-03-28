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
        this.btnsMonth = document.querySelectorAll('.btn');
        this.monthName = document.querySelector('.month-name');
        this.yearName = document.querySelector('.year-name');
        this.btnAddNewNote = document.querySelector('.addNoteBtn');
        
        // modal For Input NewNote
        this.modalForInputNewNote = document.querySelector('.modal-newNote');
        this.modalClose = document.querySelector('.cancel');
        
        
        this._initCalendarLayout('day', 'day--bingo');
        this._initComponents(this.calendarWeekDays, 'dayWeek');
        this._events();
    }

    _events() {
        this.btnsMonth.forEach(el => {
            el.addEventListener('click', this._monthLayoutChange.bind(this))
        });


        // modal For Input NewNote
        this.btnAddNewNote.addEventListener('click', (e) => this.modalForInputNewNote.style.display = 'block');
        this.modalForInputNewNote.querySelector('form').addEventListener('submit', this._getData.bind(this));
        this.modalClose.addEventListener('click', () => this.modalForInputNewNote.style.display = null);
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

    _addEl(newNoteData) {
    //   let noteData = this._getData();
      let el = `<h3 class="item-title">Title</h3>
                <p class="item-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto reprehenderit natus nihil veritatis voluptates, dicta iste voluptatem alias doloremque illo?</p>
                <p class="item-date">2018-11-05</p>
                <div class="item-btns-block">
                    <a href="#done" class="item-btn" title="Отметить как выполненное">
                        <i class="fas fa-check-circle"></i>
                    </a>	
                    <a href="#edit" class="item-btn item-btn--edit" title="Внести правки">
                        <i class="fas fa-pencil-alt"></i>
                    </a>	
                    <a href="#remove" class="item-btn item-btn--remove" title="Удалить">
                        <i class="fas fa-trash-alt"></i>
                    </a>	
                </div>
                `
        let newLi = document.createElement('LI');
            newLi.classList.add('notes-item')
            newLi.innerHTML = el;
            newLi.querySelector('.item-title').innerHTML = newNoteData.title;
            newLi.querySelector('.item-text').innerHTML = newNoteData.note;
            newLi.querySelector('.item-date').innerHTML = newNoteData.date;
        document.querySelector('.notes-list').appendChild(newLi);
        document.querySelectorAll('.item-btn').forEach(el => {
            el.addEventListener('click', this._itemBtnsHandler.bind(this));
        });
    }

    _getData(e) { 
        e.preventDefault();
        let target = e.currentTarget;
        let newNoteData  = {
            title: target.querySelector('[name="title"]').value, 
            date: target.querySelector('[name="date"]').value, 
            note: target.querySelector('[name="note"]').value
        }

        this._localStorage(newNoteData);
        
        target.querySelectorAll('[name]').forEach((el) => {
            el.value = '';
        })
        this.modalForInputNewNote.style.display = null;

        this._addEl(newNoteData)
    }

    _itemBtnsHandler(e) {
        e.preventDefault();
        let target = e.currentTarget;
        let id = target.getAttribute('href');
        switch (id) {
            case '#done': 
                target.classList.toggle('item-btn--done');
                target.closest('LI').classList.toggle('notes-item--complete');
                break;
            case '#remove':
                target.closest('LI').remove();
                break;
            default:
                break;
        }
    }

    _localStorage(...rest) {
        if(rest.length) {
            let itemsArr = (localStorage.getItem(rest[0].date)) ? JSON.parse(localStorage.getItem(rest[0].date)) : [];
                itemsArr.push(rest[0]);
            let itemsArrJson = JSON.stringify(itemsArr);
                localStorage.setItem(rest[0].date, itemsArrJson);
        }
    }

}


let newCalendar = new Calendar;



}








