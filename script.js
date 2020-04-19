
function main() {
    let tasks = []
    let columnItems = []
    const addColumnButton = document.querySelector('.addColumnButton')
    const columns = document.querySelector('.columns')

    addColumnButton.addEventListener('click', addColumn)

    function addColumn() {
        const column = document.createElement('div')
        column.classList.add('columns__item')

        const columnContent = document.createElement('div')
        columnContent.classList.add('column__content')

        const columnName = document.createElement('input')
        columnName.value = 'Название колонки'
        columnName.classList.add('columns__name')

        const addTaskButton = document.createElement('button')
        addTaskButton.classList.add('addTaskButton')
        addTaskButton.innerHTML = '+ Добавить задание'
        addTaskButton.addEventListener('click', addTask)

        columnContent.appendChild(columnName)
        column.appendChild(columnContent)
        column.appendChild(addTaskButton)
        columns.appendChild(column)
        columnEventListeners(columnContent)

        columnItems = document.querySelectorAll('.columns__item')
        // Обновление данных о колонках
    }
    function getTasks() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const url = `${proxy}https://perpower.ru/tasks/get_tasks`;
        fetch(url)
            .then(res => res.json())
            .then(data => () => {
                console.log(data)
            })
    }

    function addTask() {

        const task = document.createElement('div')
        task.classList.add('task')
        task.draggable = true;

        const taskName = document.createElement('input')
        taskName.classList.add('task__name')
        
        task.appendChild(taskName)
        taskEventListeners(task)
        this.parentElement.firstChild.appendChild(task)
        taskName.focus()

        tasks = document.querySelectorAll('.task')
        // Обновление данных о задачах
    }
    
    function taskEventListeners(task){
        task.addEventListener('dragstart',dragStart)
        task.addEventListener('dragend',dragEnd)
        task.addEventListener('dragenter',dragEnter)
        task.addEventListener('dragleave',dragLeave)
        task.addEventListener('dragover',dragOver)
        task.addEventListener('drop',dragDrop)
    }
    function columnEventListeners(column) {
        // column.addEventListener('dragenter',dragEnter)
        // column.addEventListener('dragleave',dragLeave)
        // column.addEventListener('dragover',dragOver)
        // column.addEventListener('drop',dragDrop)
    }
    
    let selectedTask 

    function dragStart() {
        setTimeout(() => {
            this.classList.add('hideDraggableTask')
        }, 0);
        selectedTask = this
    }
    function dragEnd() {
        this.classList.remove('hideDraggableTask')
    }
    function dragEnter() {
        console.log('enter')
        this.classList.add('highlightSelectedPlaceBottom')
    }
    function dragOver(event) {
        event.preventDefault()
    }
    function dragLeave() {
        this.classList.remove('highlightSelectedPlaceBottom')
    }
    function dragDrop() {
        console.log('drop')
        this.parentElement.insertBefore(selectedTask,this.nextSibling)
        this.classList.remove('highlightSelectedPlaceBottom')
    }

    
    getTasks()
}








main()


