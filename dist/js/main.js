window.addEventListener('DOMContentLoaded', init);


function init () {
    
    class Calendar {
    constructor () {
        // helpers variable
        this.year = new Date().getFullYear();
        this.month = new Date().getMonth();
        this.date = new Date().getDate();
        this.weekDays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
        this.currentNoteIndex = -1;
        this.currentSortStatus;
        
        // DOM
        // calendar
        this.mainLayout = document.querySelector('.main');
        this.calendarWrap = document.querySelector('.calendar-layout');
        this.calendarWeekDays = document.querySelector('.calendar-days');
        this.btnsMonth = document.querySelectorAll('.btn');
        this.dateName = document.querySelector('.date-name');
        this.monthName = document.querySelector('.month-name');
        this.yearName = document.querySelector('.year-name');
        // notes
        this.btnAddNewNote = document.querySelector('.addNoteBtn');
        this.notesList = document.querySelector('.notes-list');
        // modal For Input NewNote
        this.modalForInputNewNote = document.querySelector('.modal-newNote');
        this.modalForInputNewNoteOverlay = document.querySelector('.modal-wrap');
        this.modalClose = document.querySelector('.cancel');
        // sort btns
        this.sortBtnsList = document.querySelector('.sort_btns-list');
        // start
        this._initCalendarLayout('day', 'day--active', 'day-tasksqty');
        this._initComponents(this.calendarWeekDays, 'dayWeek');
        this._createNewNoteEl(this._formateDate())
        this._events();
    }
    
    _events() {
        // next/prev month (btns)
        this.btnsMonth.forEach(el => {
            el.addEventListener('click', this._monthLayoutChange.bind(this))
        });
        // select date in calendar layout
        this.calendarWrap.addEventListener('click', this._changeDayInCalendar.bind(this));
        // add new note (btn)
        this.btnAddNewNote.addEventListener('click', this._btnAddNewNoteModal.bind(this));
        // modal for input new note data
        this.modalForInputNewNote.querySelector('form').addEventListener('submit', this._handlerDataFromModal.bind(this));
        this.modalClose.addEventListener('click', this._hideModalForInputNewNote.bind(this));
        this.modalForInputNewNoteOverlay.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this._hideModalForInputNewNote.apply(this);
            }
        })
        // sort btns
        this.sortBtnsList.addEventListener('click', this._changeSortStatus.bind(this));
        // note items (card btns like edit, remove, delete)
        this.notesList.addEventListener('click', this._itemBtnsHandler.bind(this));
    }
    
    
    
    // calendar layout
    
    _initComponents(weekDays, weekDaysClass) {
        this.weekDays.forEach(el => {
            let day = document.createElement('LI');
                day.innerHTML = el;
                day.classList.add(weekDaysClass);
            weekDays.appendChild(day);
        });
    }

    _initCalendarLayout(dayClass, dayActiveClass, taskQtyElClass) {
        let d = new Date(this.year, this.month);
        let daysInMonth = this._getQtyDaysInMonth(this.year, this.month)
        let firstDayInMonth = d.getDay();
        for (let i = 0; i < daysInMonth; i++) {
            let dayElem = document.createElement('LI');
            (this.date - 1 == i) ? dayElem.classList.add(dayClass, dayActiveClass) : dayElem.classList.add(dayClass);
            dayElem.dataset.date = i + 1;
            dayElem.innerHTML = i + 1;
            this.calendarWrap.appendChild(dayElem);
            let taskQtyInDayEl = document.createElement('SPAN');
            taskQtyInDayEl.classList.add(taskQtyElClass);
            dayElem.appendChild(taskQtyInDayEl);
        }
        this.calendarWrap.firstChild.style.marginLeft = (firstDayInMonth !== 0) ? `${100 / 7 * (firstDayInMonth - 1)}%` : `${100 / 7 * 6}%`
        this.dateName.innerHTML = this.date;
        this.monthName.innerHTML = d.toLocaleString('en', { month: "long" });
        this.yearName.innerHTML = this.year;
        this._addTaskQtyInDateEl(taskQtyElClass);
    }
    
    _clearCalendarLayout() {
        while (this.calendarWrap.firstChild) {
            this.calendarWrap.removeChild(this.calendarWrap.firstChild);
        }
    }
    
    _changeDayInCalendar(e) {
        if(e.target === e.currentTarget) return;
        this._clearNotes(); 
        document.querySelector('.day--active').classList.remove('day--active');
        let target = e.target.closest('li');
            target.classList.add('day--active');
        let date = target.dataset.date;
        this.date = (date.length == 1) ? '0' + date : date;
        this._createNewNoteEl(this._formateDate());
        this._sort();
    }
    
    _getQtyDaysInMonth(year, month) {
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
                this.date = 1;
                this.month++;
            } 
        } else {
            if (this.month === 0) {
                this.month = 11;
                this.year--
            } else {
                this.date = 1;
                this.month--;
            } 
        }
        this._clearNotes();
        this._clearCalendarLayout();
        this._initCalendarLayout('day', 'day--active', 'day-tasksqty');
        this._createNewNoteEl(this._formateDate());

    }
    
    _addTaskQtyInDateEl(taskQtyElClass) {
        let taskQtyInDayEl = document.querySelectorAll('.' + taskQtyElClass);
        taskQtyInDayEl.forEach((el) => {
            let date = el.parentElement.dataset.date;
            let elLength = this._getTaskQtyInDate(date);
            if (elLength && elLength !== el.innerHTML) {
                el.innerHTML = elLength;
                el.style.display = 'inline';  
            } else {
                el.style.display = null;
            }
        }) 
    }
    
    _getTaskQtyInDate(i) {
        let date = (i < 10) ? '0' + i : i;
        let localStorage = this._localStorageRead(this._formateDate().slice(0, -2) + date);
        if (!localStorage || !localStorage.length) return;
        return localStorage.length;
    }
    
    // sort function
    
    _changeSortStatus(e) {
        e.preventDefault();
        if(e.target === e.currentTarget) return;
        let target = e.target.closest('a');
        this.currentSortStatus = target.getAttribute('href');
        e.currentTarget.querySelector('.sort_btns-link--active').classList.remove('sort_btns-link--active');
        target.classList.add('sort_btns-link--active');
        this._sort();
    }
    
    _sort() {
        if(!this.currentSortStatus) return; 
        let status = this.currentSortStatus.slice(1) || null;
        let sortList = this.notesList.querySelectorAll('li');
        sortList.forEach((el) => {
            el.style.display = 'none';
            if(el.dataset.status !== status) {
                el.style.display = '';
            } 
        })    
    }
    
    
    // notes block
    
    _btnAddNewNoteModal(e) {
        this.modalForInputNewNote.parentElement.style.display = 'block';
        this.modalForInputNewNote.querySelector('[name="date"]').value = this._formateDate();
    }
    
    _getValues() {
        let title = this.modalForInputNewNote.querySelector('[name="title"]').value;
        let date = this.modalForInputNewNote.querySelector('[name="date"]').value;
        let note = this.modalForInputNewNote.querySelector('[name="note"]').value;
        return {
            title: title,
            date: date,
            note: note,
            done: false
        }
    }
    
    _handlerDataFromModal(e) { 
        e.preventDefault();
        if(this.currentNoteIndex === -1) {
            let data = this._getValues();
            this._localStoragePush(data);
        } else if (this.currentNoteIndex >= 0){
            let data = this._getValues();
            let itemsArr = this._localStorageRead(data.date);
            if (!itemsArr || data.date !== this._formateDate()) {
                this._localStoragePush(data);
                this._localStorageRemove(this.currentNoteIndex);
                document.querySelectorAll('.notes-item')[this.currentNoteIndex].remove();
            } else if (data.date == this._formateDate()) {
                let currentArr = this._localStorageRead(data.date);
                currentArr[this.currentNoteIndex] = data;
                this._localStorageChange(currentArr)
                this._changeEl(data.date);
            }
            this.currentNoteIndex = -1;
        }
        this._hideModalForInputNewNote();
        this._addTaskQtyInDateEl('day-tasksqty');
    }

    _hideModalForInputNewNote() {
        this.modalForInputNewNote.querySelectorAll('[name]').forEach((el) => {
            el.value = '';
        })
        this.modalForInputNewNoteOverlay.style.display = null;
        this.mainLayout.style.filter = null;
    }
    
    _clearNotes() {
        this.notesList.querySelectorAll('li').forEach((el) => {
            el.remove()
        })
    }

    _createNewNoteEl(itemKey) {
      let el = `<h3 class="item-title"></h3>
                <p class="item-text"></p>
                <p class="item-date"></p>
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
                if (item[i].done) {
                    newLi.dataset.status = 'done';
                    newLi.querySelector('[href="#done"]').classList.add('item-btn--done');
                    newLi.classList.add('notes-item--complete');
                } else {
                    newLi.dataset.status = 'notdone';
                }
                document.querySelector('.notes-list').appendChild(newLi);
            }
        }
        this._sort();        
    }

    _changeEl(itemKey) {
        let item = this._localStorageRead(itemKey)[this.currentNoteIndex];
        if (item) {
            let li = document.querySelectorAll('.notes-item')[this.currentNoteIndex];
                li.querySelector('.item-title').innerHTML = item.title;
                li.querySelector('.item-text').innerHTML = item.note;
                li.querySelector('.item-date').innerHTML = item.date;
        }
    }


    _itemBtnsHandler(e) {
        e.preventDefault();
        let noteItemIndex = this._findIndexElInList(e.target.closest("LI"));
        let target = e.target.closest('a.item-btn');
        if(!target) return;
        
        let id = target.getAttribute('href');
        switch (id) {
            case '#done':
            let itemsArr = this._localStorageRead(this._formateDate());
            let targetItem = itemsArr[noteItemIndex];
                targetItem.done = !targetItem.done;
                this._localStorageChange(itemsArr);
                target.classList.toggle('item-btn--done');
            let parent = target.closest('LI');
                parent.classList.toggle('notes-item--complete');
                parent.dataset.status = (parent.dataset.status === 'done') ? 'notdone' : 'done';
                this._sort();
                break;
            case '#remove':
                this._localStorageRemove(noteItemIndex);
                target.closest('LI').remove();
                this._addTaskQtyInDateEl('day-tasksqty');
                break;
            case '#edit':
                this.modalForInputNewNoteOverlay.style.display = 'block';
                let itemData = this._localStorageRead(this._formateDate())[noteItemIndex];
                this.modalForInputNewNote.querySelector('[name="title"]').value = itemData.title;
                this.modalForInputNewNote.querySelector('[name="date"]').value = itemData.date;
                this.modalForInputNewNote.querySelector('[name="note"]').value = itemData.note;
                this.currentNoteIndex = noteItemIndex;
                break;
        }
    }
        
    
    // helpers functions
    
    _localStoragePush(noteData) {
        let itemsArr = (localStorage.getItem(noteData.date)) ? JSON.parse(localStorage.getItem(noteData.date)) : [];
        itemsArr.push(noteData);
        let itemsArrJson = JSON.stringify(itemsArr);
        localStorage.setItem(noteData.date, itemsArrJson);
        
        let nameFormateDate = this._formateDate();
        
        if (noteData.date == nameFormateDate) {
            this._createNewNoteEl(noteData.date);
        }
    }

    _localStorageChange(itemsArr) {
        let itemsArrJson = JSON.stringify(itemsArr);
        localStorage.setItem(this._formateDate(), itemsArrJson);
    }
    
    _localStorageRead(date) {
        if(date) {
            let item = JSON.parse(localStorage.getItem(date));
            return item
        } else {
            return window.localStorage;
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








