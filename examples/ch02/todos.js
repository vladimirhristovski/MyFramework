// State of the app
const todos = [
    {description: 'Walk the dog', done: false},
    {description: 'Water the plants', done: false},
    {description: 'Sand the chairs', done: false},
]
// HTML element references
const addTodoInput = document.getElementById('todo-input')
const addTodoButton = document.getElementById('add-todo-btn')
const todosList = document.getElementById('todos-list')
// Initialize the view
for (const todo of todos) {
    todosList.append(renderTodoInReadMode(todo))
}
addTodoInput.addEventListener('input', () => {
    addTodoButton.disabled = addTodoInput.value.length < 3
})
addTodoInput.addEventListener('keydown', ({key}) => {
    if (key === 'Enter' && addTodoInput.value.length >= 3) {
        addTodo()
    }
})
addTodoButton.addEventListener('click', () => {
    addTodo()
})

// Functions
function renderTodoInReadMode(todo) {
    const li = document.createElement('li')

    const span = document.createElement('span')
    span.textContent = todo.description

    if (todo.done) {
        span.classList.add('done')
    }

    if (!todo.done) {
        span.addEventListener('dblclick', () => {
            const idx = todos.indexOf(todo)

            todosList.replaceChild(
                renderTodoInEditMode(todo),
                todosList.childNodes[idx]
            )
        })
    }
    li.append(span)

    if (!todo.done) {
        const button = document.createElement('button')
        button.textContent = 'Done'
        button.addEventListener('click', () => {
            const idx = todos.indexOf(todo)
            removeTodo(idx)
        })
        li.append(button)
    }

    return li
}

function addTodo() {
    const description = addTodoInput.value

    if (todoExists(description)) {
        alert('Todo already exists')
        return
    }

    const newItem = {
        description: description,
        done: false
    }
    todos.push(newItem)
    const todo = renderTodoInReadMode(newItem)
    todosList.append(todo)
    addTodoInput.value = ''
    addTodoButton.disabled = true

    readTodo(description)
}

function readTodo(description) {
    const message = new SpeechSynthesisUtterance()
    message.text = description
    message.voice = speechSynthesis.getVoices()[0]
    speechSynthesis.speak(message)
}

function todoExists(description) {
    const cleanTodos = todos.map((todo) => todo.description.trim().toLowerCase())
    return cleanTodos.includes(description.trim().toLowerCase())
}

function removeTodo(index) {
    todos[index].done = true
    const todo = renderTodoInReadMode(todos[index])
    todosList.replaceChild(todo, todosList.childNodes[index])
}

function renderTodoInEditMode(todo) {
    const li = document.createElement('li')
    const input = document.createElement('input')
    input.type = 'text'
    input.value = todo.description
    li.append(input)
    const saveBtn = document.createElement('button')
    saveBtn.textContent = 'Save'
    saveBtn.addEventListener('click', () => {
        const idx = todos.indexOf(todo)
        updateTodo(idx, input.value)
    })
    li.append(saveBtn)
    const cancelBtn = document.createElement('button')
    cancelBtn.textContent = 'Cancel'
    cancelBtn.addEventListener('click', () => {
        const idx = todos.indexOf(todo)
        todosList.replaceChild(renderTodoInReadMode(todo), todosList.childNodes[idx])
    })
    li.append(cancelBtn)
    return li
}

function updateTodo(index, description) {
    todos[index].description = description
    const todo = renderTodoInReadMode(todos[index])
    todosList.replaceChild(todo, todosList.childNodes[index])
}