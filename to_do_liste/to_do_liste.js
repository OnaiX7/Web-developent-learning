const todo = document.getElementById('todo');
const addButton = document.getElementById('add-button');
const todoTable = document.getElementById('todo-table');
let todoList = JSON.parse(sessionStorage.getItem('todos')) || [];

addButton.addEventListener('click', addTodo)

function addTodo() {
    let newEntry = {
        id: crypto.randomUUID(),
        name: todo.value,
        done: false
    }
    todoList.push(newEntry);
    sessionStorage.setItem('todos', JSON.stringify(todoList));
    displayTodos();
}

function displayTodos() {
    todoTable.innerHTML = '';
    todoList = JSON.parse(sessionStorage.getItem('todos')) || [];
    console.log(todoList);
    todoList.forEach(entry => {
        const row = document.createElement('tr');

        const todoCell = createTodoCell(entry.name, entry.done);
        const statusCell = createStatusCell(entry.done);

        const actionsCell = document.createElement('td');
        const actions = document.createElement('div');
        actions.className = 'actions';
        actions.appendChild(createActionButton('Bearbeiten', '', 'edit', entry.id));
        actions.appendChild(createActionButton(entry.done ? 'Offen' : 'Erledigt', 'done', 'toggle', entry.id));
        actions.appendChild(createActionButton('Löschen', 'delete', 'delete', entry.id));
        actionsCell.appendChild(actions);

        row.append(todoCell, statusCell, actionsCell);
        todoTable.appendChild(row);
    })

}

function createActionButton(label, className, action, id) {
    console.log(label);
    const actionButton = document.createElement('button');
    actionButton.className = `${className} action-button`;
    actionButton.textContent = label;
    actionButton.dataset.id = id;
    actionButton.dataset.action = action;
    return actionButton;
}
function createTodoCell(todoName, className) {
    const todoCell = document.createElement('td');
    const todoText = document.createElement('span');
    todoText.className = `todo-text${className ? ' done' : ''}`;
    todoText.textContent = todoName;
    todoCell.appendChild(todoText);
    return todoCell;
}
function createStatusCell(done) {
    const statusCell = document.createElement('td');
    const status = document.createElement('span');
    status.className = `status${done ? ' done' : ''}`;
    status.textContent = done ? 'Erledigt' : 'Offen';
    statusCell.appendChild(status);
    return statusCell;
}

todoTable.addEventListener('click', (e) => {
    e.preventDefault();
    const buttonClicked = e.target.closest('button');
    const {action, id} = buttonClicked.dataset;
    console.log(id);
    console.log(action);
    if (action === 'toggle') {
        toggleTodo(id);
    }
    if (action === 'delete') {
        deleteTodo(id);
    }
})

function toggleTodo(todoId) {
    let entry = todoList.findIndex(item => item.id === todoId);
    console.log(todoList[entry].done);
    todoList[entry].done = !todoList[entry].done;
    sessionStorage.setItem('todos', JSON.stringify(todoList));

    displayTodos();
}

function deleteTodo(todoId) {
    let entry = todoList.findIndex(item => item.id === todoId);
    todoList.splice(entry, 1);
    sessionStorage.setItem('todos', JSON.stringify(todoList));
    displayTodos();
}

function editTodo() {

}

displayTodos();