
function main() {
    let tasks = []
    let columnItems = []
    let mainData
    let selectedTask
    let selectedColumn
    let lastTaskID
    const addColumnButton = document.querySelector('.addColumnButton')
    const columns = document.querySelector('.columns')

    addColumnButton.addEventListener('click',{handleEvent: addColumn, name:'Название колонки'} )

    function addColumnFromApi(name) {
        const column = document.createElement('div')
        column.draggable = true
        column.classList.add('columns__item')

        const columnContent = document.createElement('div')
        columnContent.classList.add('column__content')

        const columnName = document.createElement('input')
        columnName.value = name
        columnName.classList.add('columns__name')
        columnName.addEventListener('blur', editColumnName)

        const addTaskButton = document.createElement('button')
        addTaskButton.classList.add('addTaskButton')
        addTaskButton.innerHTML = '+ Добавить задание'
        addTaskButton.addEventListener('click', addTask)

        columnContent.appendChild(columnName)
        column.appendChild(columnContent)
        column.appendChild(addTaskButton)
        columns.appendChild(column)
        columnEventListeners(column)

        columnItems = document.querySelectorAll('.columns__item')
        return column
        // Обновление данных о колонках
    }
    async function addColumn() {
        const column = document.createElement('div')
        column.draggable = true
        column.classList.add('columns__item')

        const columnContent = document.createElement('div')
        columnContent.classList.add('column__content')

        const columnName = document.createElement('input')
        columnName.placeholder = 'Название колонки'
        columnName.addEventListener('blur', saveColumnName)
        columnName.classList.add('columns__name')

        const addTaskButton = document.createElement('button')
        addTaskButton.classList.add('addTaskButton')
        addTaskButton.innerHTML = '+ Добавить задание'
        addTaskButton.addEventListener('click', addTask)

        columnContent.appendChild(columnName)
        column.appendChild(columnContent)
        column.appendChild(addTaskButton)
        columns.appendChild(column)
        columnEventListeners(column)
        column.setAttribute('data-id',await updateData())
        columnItems = document.querySelectorAll('.columns__item')
        return column
        // Обновление данных о колонках
    }

    async function getTasks() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const url = `${proxy}https://perpower.ru/tasks/get_tasks`;
        let response = await fetch(url)
        let jsonData = await response.json()
        let panels = jsonData.panels
        console.log(panels)
        let taskIDs = []
        for (let i = 0; i < panels.length; i++){

            let column = addColumnFromApi(panels[i].name)
            column.setAttribute('data-id',panels[i].id)
            for(let k = 0; k < panels[i].tasks.length; k++){

                let task = addTaskFromApi(panels[i].tasks[k].name, column)
                task.setAttribute('data-id',panels[i].tasks[k].id)
                taskIDs.push(panels[i].tasks[k].id)

            }
        }
        lastTaskID = Math.max.apply(Math, taskIDs)
    }

    function addTaskFromApi(name,column) {

        const task = document.createElement('div')
        task.classList.add('task')
        task.draggable = true;

        const taskName = document.createElement('input')
        taskName.value = name
        taskName.classList.add('task__name')
        taskName.addEventListener('blur', editTaskName)
        // Функция saveTaskName срабатывает после того, как пользователь ввёл данные и кликнул в другое место 

        task.appendChild(taskName)
        taskEventListeners(task)
        column.firstChild.appendChild(task)
        
        tasks = document.querySelectorAll('.task')
        return task
        // Обновление данных о задачах
    }
    function addTask() {

        const task = document.createElement('div')
        task.classList.add('task')
        task.draggable = true;

        const taskName = document.createElement('input')
        taskName.classList.add('task__name')
        taskName.addEventListener('blur', saveTaskName)
        
        task.appendChild(taskName)
        taskEventListeners(task)
        this.parentElement.firstChild.appendChild(task)
        taskName.focus()

        tasks = document.querySelectorAll('.task')
        // Обновление данных о задачах
    }
    
    function taskEventListeners(task){
        task.addEventListener('dragstart',dragStartTask)
        task.addEventListener('dragend',dragEnd)
        task.addEventListener('dragenter',dragEnterTask)
        task.addEventListener('dragleave',dragLeaveTask)
        task.addEventListener('dragover',dragOver)
        task.addEventListener('drop',dragDropTask)
    }
    function columnEventListeners(column) {
        column.addEventListener('dragstart',dragStartColumn)
        column.addEventListener('dragend',dragEnd)
        column.addEventListener('dragenter',dragEnterColumn)
        column.addEventListener('dragleave',dragLeaveColumn)
        column.addEventListener('dragover',dragOver)
        column.addEventListener('drop',dragDropColumn)
    }
    function deleteEventListeners() {
        const deleteBlock = document.querySelector('.delete')
        deleteBlock.addEventListener('dragover',dragOver)
        deleteBlock.addEventListener('drop',dragDropDelete)
    }
    deleteEventListeners()
    
    function dragDropDelete(event) {
        console.log('drop')
        try {
            selectedColumn.classList.add('deletedElement')
            deleteColumn(selectedColumn)
            
        } catch (error) {
            selectedTask.classList.add('deletedElement')
            deleteTask(selectedTask)
        }
        
        event.stopPropagation()
    }
    function dragStartTask(event) {
        setTimeout(() => {
            this.classList.add('hideDraggableTask')
        }, 0);
        selectedTask = this
        console.log(selectedTask)
        event.stopPropagation()
    }
    function dragStartColumn(event) {
        setTimeout(() => {
            this.classList.add('hideDraggableTask')
        }, 0);
        selectedColumn = this
        console.log(selectedColumn)
        event.stopPropagation()
    }
    function dragEnd() {
        this.classList.remove('hideDraggableTask')
        selectedTask = null
        selectedColumn = null
        event.stopPropagation()
    }
    function dragEnterTask(event) {
        console.log('enter')
        this.classList.add('highlightSelectedPlaceBottom')
        event.stopPropagation()
    }
    function dragEnterColumn(event) {
        console.log('enter')
        this.classList.add('highlightSelectedPlaceRight')
        event.stopPropagation()
    }
    function dragOver(event) {
        event.preventDefault()
        event.stopPropagation()
    }
    function dragLeaveTask(event) {
        this.classList.remove('highlightSelectedPlaceBottom')
        event.stopPropagation()
    }
    function dragLeaveColumn(event) {
        this.classList.remove('highlightSelectedPlaceRight')
        event.stopPropagation()
    }
    function dragDropTask(event) {
        taskID = selectedTask.getAttribute('data-id')
        columnID = this.parentElement.parentElement.getAttribute('data-id')
        moveTask(taskID,columnID)
        this.parentElement.insertBefore(selectedTask,this.nextSibling)
        this.classList.remove('highlightSelectedPlaceBottom')

        event.stopPropagation()
    }
    function dragDropColumn(event) {
        this.parentElement.insertBefore(selectedColumn,this.nextSibling)
        this.classList.remove('highlightSelectedPlaceRight')
        const selectedColumnID = selectedColumn.getAttribute('data-id')
        const targetColumnID = this.getAttribute('data-id')
        moveColumn(selectedColumnID, targetColumnID)
        event.stopPropagation()
    }
    
    function saveColumnName() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const url = `${proxy}https://perpower.ru/tasks/create_status`;
        const data = {
            status_name: this.value
        };
        console.log(JSON.stringify(data))
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => console.log(res))
        this.removeEventListener('blur', saveColumnName)
        this.addEventListener('blur', editColumnName)
        

    }
    async function saveTaskName() {

        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const url = `${proxy}https://perpower.ru/tasks/create_task`;
        const data = {
            name: this.value,
            desc: this.value,
            status_id: this.parentElement.parentElement.parentElement.getAttribute('data-id'),

        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => console.log(res))

        lastTaskID = lastTaskID + 1
        this.parentElement.setAttribute('data-id',lastTaskID)
        this.removeEventListener('blur', saveTaskName)
        this.addEventListener('blur', editTaskName)
    }

    function editTaskName() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const url = `${proxy}https://perpower.ru/tasks/rename_task`;
        console.log(this.value)
        const data = {
            name: this.value,
            task_id: this.parentElement.getAttribute('data-id'),

        };
        console.log(JSON.stringify(data))
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }
    function editColumnName() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const url = `${proxy}https://perpower.ru/tasks/rename_status`;
        console.log(this.value)
        const data = {
            status_name: this.value,
            id: this.parentElement.parentElement.getAttribute('data-id'),

        };
        console.log(JSON.stringify(data))
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }


    async function updateData() {

        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const url = `${proxy}https://perpower.ru/tasks/get_tasks`;
        let response = await fetch(url)
        let jsonData = await response.json()
        mainData = jsonData
        let panels = jsonData.panels
        lastColumnID = panels[panels.length-1].id + 1
        console.log(lastColumnID)
        return lastColumnID
    }
    function deleteColumn(column){
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const url = `${proxy}https://perpower.ru/tasks/delete_status`;
        const data = {
            id: column.getAttribute('data-id'),
        };
        console.log(JSON.stringify(data))
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }
    function deleteTask(task){
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const url = `${proxy}https://perpower.ru/tasks/delete_task`;
        console.log()
        const data = {
            task_id: task.getAttribute('data-id'),

        };
        console.log(JSON.stringify(data))
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }

    function moveTask(taskID,columnID) {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const url = `${proxy}https://perpower.ru/tasks/move_task`;
        const data = {
            task_id: taskID,
            status_id: columnID,

        };
        console.log(JSON.stringify(data))
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }
    function moveColumn(selectedColumnID, targetColumnID) {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const url = `${proxy}https://perpower.ru/tasks/move_panel`;
        const data = {
            id: selectedColumnID,
            index: targetColumnID,

        };
        console.log(JSON.stringify(data))
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }

    getTasks()
}








main()


