// import "babel-polyfill";
window.addEventListener('DOMContentLoaded', init);

// import $ from 'jquery';

function init () {
    
class Calendar {
    constructor () {
        // helpers variable
        this.year = new Date().getFullYear();
        this.month = new Date().getMonth();
        this.date = new Date().getDate();
        this.weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

        // DOM
        this.mainLayout = document.querySelector('.main');
        this.calendarWrap = document.querySelector('.calendar-layout');
        this.calendarWeekDays = document.querySelector('.calendar-days');
        this.btnsMonth = document.querySelectorAll('.btn');
        this.monthName = document.querySelector('.month-name');
        this.yearName = document.querySelector('.year-name');
        this.btnAddNewNote = document.querySelector('.addNoteBtn');
        this.notesList = document.querySelector('.notes-list');
        
        // modal For Input NewNote
        this.modalForInputNewNote = document.querySelector('.modal-newNote');
        this.modalClose = document.querySelector('.cancel');
        
        
        this._initCalendarLayout('day', 'day--bingo');
        this._initComponents(this.calendarWeekDays, 'dayWeek');
        this._addEl(this._formateDate())
        this._events();
    }

    _events() {
        this.btnsMonth.forEach(el => {
            el.addEventListener('click', this._monthLayoutChange.bind(this))
        });


        // modal For Input NewNote
        this.btnAddNewNote.addEventListener('click', (e) => {
            this.modalForInputNewNote.style.display = 'block';
            this.mainLayout.style.filter = 'blur(3px)'
        });
        this.modalForInputNewNote.querySelector('form').addEventListener('submit', this._getData.bind(this));
        this.modalClose.addEventListener('click', () => {
            this.modalForInputNewNote.style.display = null
            this.mainLayout.style.filter = null
        });

        this.notesList.addEventListener('click', this._itemBtnsHandler.bind(this));
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

    _addEl(itemKey) {
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
        let item = this._localStorageRead(itemKey) || 0;
        let currentListLength = document.querySelector('.notes-list').children.length;
        if (item.length === currentListLength) return;
        if (item.length - currentListLength > 0) {
            for (let i = currentListLength; i < (currentListLength + item.length - currentListLength); i++) {
                let newLi = document.createElement('LI');
                    newLi.classList.add('notes-item')
                    newLi.innerHTML = el;
                    newLi.querySelector('.item-title').innerHTML = item[i].title;
                    newLi.querySelector('.item-text').innerHTML = item[i].note;
                    newLi.querySelector('.item-date').innerHTML = item[i].date;
                document.querySelector('.notes-list').appendChild(newLi);
            }
        }        
    }

    _getData(e) { 
        e.preventDefault();
        let target = e.currentTarget;
        let newNoteData  = {
            title: target.querySelector('[name="title"]').value, 
            date: target.querySelector('[name="date"]').value, 
            note: target.querySelector('[name="note"]').value
        }

        this._localStoragePush(newNoteData);
        
        target.querySelectorAll('[name]').forEach((el) => {
            el.value = '';
        })
        this.modalForInputNewNote.style.display = null;
        this.mainLayout.style.filter = null;
    }

    _itemBtnsHandler(e) {
        e.preventDefault();
        let noteItemIndex = this._findIndexElInList(e.target.closest("LI"));
        
        let target = e.target.closest('a.item-btn');
        if(!target) return;
         
        let id = target.getAttribute('href');
        switch (id) {
            case '#done': 
            target.classList.toggle('item-btn--done');
            target.closest('LI').classList.toggle('notes-item--complete');
                break;
                case '#remove':
                    this._localStorageRemove(noteItemIndex)
                    target.closest('LI').remove();
                break;
            }
        }
        
    _localStoragePush(noteData) {
        let itemsArr = (localStorage.getItem(noteData.date)) ? JSON.parse(localStorage.getItem(noteData.date)) : [];
        itemsArr.push(noteData);
        let itemsArrJson = JSON.stringify(itemsArr);
        localStorage.setItem(noteData.date, itemsArrJson);
        
        let NameFormateDate = this._formateDate();
        
        if (noteData.date == NameFormateDate) {
            this._addEl(noteData.date);
        }
    }
    
    _localStorageRead(...rest) {
        if(rest) {
            let item = JSON.parse(localStorage.getItem(rest[0]));
            return item
        } 
    }
    
    _localStorageRemove(index) {
        let date = this._formateDate();
        let itemsArr = this._localStorageRead(date);
        itemsArr.splice(index, 1);
        let itemsArrJson = JSON.stringify(itemsArr);
        localStorage.setItem(date, itemsArrJson);
    }
    
    _formateDate() {
        let monthNameFormate = (String(this.month).length === 1) ? '0' + (this.month + 1) : this.month + 1;
        let dateNameFormate = (String(this.date).length === 1) ? '0' + this.date : this.date;
        return String(this.year + '-' + monthNameFormate + '-' + dateNameFormate)
    }

    _findIndexElInList(item) {
        let parentEl = item.parentElement.children; 
        let itemsArr = [].slice.call(parentEl);
        let count = -1;
        let currentItem = item;
        while(currentItem) {
            currentItem = currentItem.previousElementSibling;
            count++
        }
        return count;
    }

}


let newCalendar = new Calendar;



}








