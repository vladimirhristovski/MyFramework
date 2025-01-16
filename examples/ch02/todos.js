import {createApp, h, hFragment} from 'https://unpkg.com/@vladimirhristovski/my-framework'

const state = {
    currentTodo: '', edit: {
        idx: null, original: null, edited: null,
    }, todos: ['Walk the dog', 'Water the plants'],
}

const reducers = {
    'update-current-todo': (state, currentTodo) => ({ // --1--
        ...state, currentTodo, // --2--
    }),

    'add-todo': (state) => ({
        ...state, currentTodo: '', // --3--
        todos: [...state.todos, state.currentTodo], // --4--
    }),

    'start-editing-todo': (state, idx) => ({ // --5--
        ...state, edit: {
            idx, original: state.todos[idx], // --6--
            edited: state.todos[idx], // --7--
        },
    }),

    'edit-todo': (state, edited) => ({  // --8--
        ...state, edit: {...state.edit, edited}, // --9--
    }),

    'save-edited-todo': (state) => {
        const todos = [...state.todos] // --10--
        todos[state.edit.idx] = state.edit.edited // --11--

        return {
            ...state, edit: {idx: null, original: null, edited: null}, // --12--
            todos,
        }
    },

    'cancel-editing-todo': (state) => ({
        ...state, edit: {idx: null, original: null, edited: null}, // --13--
    }),

    'remove-todo': (state, idx) => ({ // --14--
        ...state, todos: state.todos.filter((_, i) => i !== idx), // --15--
    }),
}

function App(state, emit) {
    return hFragment([h('h1', {}, ['My TODOs']), CreateTodo(state, emit), TodoList(state, emit),])
}

function CreateTodo({currentTodo}, emit) { // --1--
    return h('div', {}, [h('label', {for: 'todo-input'}, ['New TODO']), // --2--
        h('input', {
            type: 'text', id: 'todo-input', value: currentTodo, // --3--
            on: {
                input: ({target}) => emit('update-current-todo', target.value), // --4--
                keydown: ({key}) => {
                    if (key === 'Enter' && currentTodo.length >= 3) { // --5--
                        emit('add-todo') // --6--
                    }
                },
            },
        }), h('button', {
            disabled: currentTodo.length < 3, // --7--
            on: {click: () => emit('add-todo')}, // --8--
        }, ['Add']),])
}

function TodoList({todos, edit}, emit) {
    return h('ul', {}, todos.map((todo, i) => TodoItem({todo, i, edit}, emit)))
}

function TodoItem({todo, i, edit}, emit) {
    const isEditing = edit.idx === i

    return isEditing ? h('li', {}, [ // --1--
        h('input', {
            value: edit.edited, // --2--
            on: {
                input: ({target}) => emit('edit-todo', target.value) // --3--
            },
        }), h('button', {
            on: {
                click: () => emit('save-edited-todo') // --4--
            }
        }, ['Save']), h('button', {
            on: {
                click: () => emit('cancel-editing-todo') // --5--
            }
        }, ['Cancel']),]) : h('li', {}, [ // --6--
        h('span', {
                on: {
                    dblclick: () => emit('start-editing-todo', i) // --7--
                }
            }, [todo] // --8--
        ), h('button', {
            on: {
                click: () => emit('remove-todo', i) // --9--
            }
        }, ['Done']),])
}

createApp({state, reducers, view: App}).mount(document.body)