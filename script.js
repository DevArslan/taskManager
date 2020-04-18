

function main() {
    const addColumnButton = document.querySelector('.addColumnButton')
    const columns = document.querySelector('.columns')
    addColumnButton.addEventListener('click', addColumn)
    function addColumn() {
        const column = document.createElement('div')
        column.classList.add('columns__item')

        const columnName = document.createElement('input')
        columnName.classList.add('columns__name')

        const addTaskButton = document.createElement('button')
        addTaskButton.classList.add('addTaskButton')
        addTaskButton.innerHTML = 'Добавить задание'
        addTaskButton.addEventListener('click', addTask)

        column.appendChild(columnName)
        columns.appendChild(column)
        column.appendChild(addTaskButton)
    }
    function addTask() {
        const task = document.createElement('div')
        task.classList.add('task')

        const taskName = document.createElement('input')
        taskName.classList.add('task__name')
        console.log('asdasd')
        task.appendChild(taskName)
        this.parentElement.insertBefore(task,this)

    }
}

main()
