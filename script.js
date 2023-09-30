       // const todos = ['Get groceries', 'Wash car', 'Make dinner'];
       // Common sources of bugs in Javascript: Type Errors; it's why typescript is popular

       // MODEL Section - anything related to maaging data in the model section

       let todos;
       let editingTodoId = null;

       const datePicker = document.getElementById('date-picker');
       const today = new Date();
       const formattedDate = today.toISOString().split('T')[0];

       const todoTitleInput = document.getElementById('todo-title');
       const addButton = document.getElementById('add-todo');


       // Get local storage
       const savedTodos = JSON.parse(localStorage.getItem('todos'));

    
       if (Array.isArray(savedTodos)) {
        todos = savedTodos;
       } else {
        todos = [
            {
                title: 'Get groceries',
                dueDate: '2021-10-04',
                id: 'id1'
            }, 
        
            {
                title: 'Wash car',
                dueDate: '2021-10-05',
                id: 'id2'
            }, 
            
            {
                title: 'Make dinner',
                dueDate: '2021-03-04',
                id: 'id3'
            }
        ]

       }


       function toggleAddButtonState() {
            addButton.disabled = todoTitleInput.value.trim() === '';
        }

        todoTitleInput.addEventListener('input', toggleAddButtonState);
        toggleAddButtonState();


        // Creates a todo
        function createTodo(title, dueDate) {
            const id = '' + new Date().getTime();
            todos.push({
                title: title,
                dueDate: dueDate,
                id: id

            });

            saveTodos(); // Call saveTodo in functions whenever array is modified
        }

        // Deletes a todo 
        function removeTodo(idToDelete) {
            todos = todos.filter(function(todo) {

                // filter loops through the array
                // check if the loop reaches an id that matches with idToDelete, remove from the array
                if(todo.id === idToDelete) {
                    return false;
                } else {
                    return true;
                }

            });

            saveTodos();
        }

        // See if todo is checked
        function toggleTodo(todoId, checked) {
            todos.forEach(function (todo) {
            if (todo.id === todoId) {
                todo.isDone = checked;
            }
            });
        }

       // See if todo is being edited
        function editTodo(newTodoId, editCheck) {
            todos.forEach(function (todo) {
            if (todo.id === newTodoId) {
                todo.isEditing = editCheck;
            }
            });
        }
     
        // Change todo title and due date in array
        function changeTodo(updateId, newTitle, newDueDate) {
            todos.forEach(function(todo) {
                if (todo.id === updateId) {
                    todo.title = newTitle;
                    todo.dueDate = newDueDate;

                    todo.isEditing = false;
                }
            });

            saveTodos();

        }


        // Local storage
        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(todos));
        }

      

        render();

        // VIEW Section

        function render() {

            datePicker.value = formattedDate;

            // Resets the list
            document.getElementById('todo-list').innerHTML = ' ';

            todos.forEach(function (todo) {
                const element = document.createElement('div');
        
                if (todo.isEditing === true) {
                    const newTextbox = document.createElement('input');
                    newTextbox.id = 'newTextBox';
                    newTextbox.type = 'text';
                    newTextbox.style = 'margin-left: 5px;';
                    
                    // Check if the to-do item is currently being edited and set the input value accordingly
                    if (editingTodoId === todo.id) {
                        newTextbox.value = todo.title;
                    }
        
                    const newDatePicker = document.createElement('input');
                    newDatePicker.type = 'date';
                    newDatePicker.style = 'margin-left: 5px;';
                    newDatePicker.id = 'newDatePicker';
                    newDatePicker.value= todo.dueDate;
        
        
                    const updateButton = document.createElement('button');
                    updateButton.innerText = 'Update';
                    updateButton.dataset.id = todo.id;
                    updateButton.style = 'margin-left: 5px;';
        
                    element.appendChild(newTextbox);
                    element.appendChild(newDatePicker);
                    element.appendChild(updateButton);
        
                    updateButton.onclick = updatingTodo;

                } else {
                    element.innerText = todo.title + ' ' + todo.dueDate;

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    
                    checkbox.dataset.todoId = todo.id;
                    checkbox.onchange = checkTodo;

        
                    if (todo.isDone === true) {
                        checkbox.checked = true;
                    } else {
                        checkbox.checked = false;
                    }
                    element.prepend(checkbox);


                    const deleteButton = document.createElement('button');
                    deleteButton.innerText = 'Delete';
                    deleteButton.style = 'margin-left: 12px;';
                    deleteButton.onclick = deleteTodo; // No parenthesis
                    deleteButton.id = todo.id;
                    element.appendChild(deleteButton);

                    const editButton = document.createElement('button');
                    editButton.innerText = 'Edit';
                    editButton.style = 'margin-left: 5px;';
                    editButton.onclick = updateTodo;
                    editButton.id = todo.id;
                    element.appendChild(editButton);

                }
        
                const todoList = document.getElementById('todo-list');
                todoList.appendChild(element);
            });
        } 

    

        // CONTROLLER Section (anything the user interacts with)

        function addTodo() {
            // Check if the input has content before adding a todo
            if (todoTitleInput.value.trim() !== '') {
                const title = todoTitleInput.value;
                const datePicker = document.getElementById('date-picker');
                const dueDate = datePicker.value;
        
                createTodo(title, dueDate);
                render();
        
                // Clear the input after adding a todo
                todoTitleInput.value = '';
        
                // Disable the "Add todo" button again
                toggleAddButtonState();
            }
        }

        function updateTodo() {
            const editButton = event.target;
            const newTodoId = editButton.id;
        
            // Set the currently edited to-do item's ID
            editingTodoId = newTodoId;
        
            editTodo(newTodoId, true);
            render();
        }
        
        function updatingTodo() {
            const updateButton = event.target;
            const updateId = updateButton.dataset.id;
        
            const editedTextbox = document.getElementById('newTextBox');
            let newTitle = editedTextbox.value;
        
            const editedDatePicker = document.getElementById('newDatePicker');
            let newDueDate = editedDatePicker.value;
        
            changeTodo(updateId, newTitle, newDueDate);
        
            // Clear the currently edited to-do item's ID
            editingTodoId = null;
        
            render();
        }
        
        function deleteTodo(event) {
            const deleteButton = event.target;
            const idToDelete = deleteButton.id;

           removeTodo(idToDelete);
            render();
        }

        function checkTodo(event) {
        const checkbox = event.target;

        const todoId = checkbox.dataset.todoId;
        const checked = checkbox.checked;

        toggleTodo(todoId, checked);
        render();
      }

    

// localStorage.clear();