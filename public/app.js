$(document).ready(function(){
    $.getJSON("/api/todos")
    .then(addTodos)

    $('#todoInput').keypress(function(event){
        if (event.which == 13) {
            createTodo(); 
        }
    });

    $('.list').on('click', 'span', function(event){
        event.stopPropagation();
        removeToDo($(this).parent())
    })

    $('.list').on('click', 'li', function(){
        updateTodo($(this)); 
    })
});

function addTodos(todos) {
    todos.forEach(element => {
        addTodo(element);
    });
}

function updateTodo(todo) {
    var clickedID = todo.data('id');
    var isDone = !todo.data('completed'); 
    var updateData = {completed: isDone}; 
    $.ajax({
        method: 'PUT',
        url: '/api/todos/' + clickedID, 
        data: updateData
    })
    .then(function(updatedTodo){
        todo.toggleClass("done")
        todo.data('completed', isDone);
    })
}

function removeToDo(todo) {
    var clickedID = todo.data('id'); 
    $.ajax({
        method: 'DELETE',
        url: '/api/todos/' + clickedID
    })
    .then(function(data){
        todo.remove();
    })
    .catch(function(err){
        console.log(err);
    })
}

function addTodo(todo) {
    var newTodo = $('<li class = "task">' + todo.name + '<span>X</span></li>');
    newTodo.data('id', todo._id); 
    newTodo.data('completed', todo.completed);
    if(todo.completed) {
        newTodo.addClass("done"); 
    } 
    $('.list').append(newTodo); 
}

function createTodo(){
    var userInput = $('#todoInput').val();
    $.post("/api/todos", {name: userInput})
    .then(function(newTodo){
        $('#todoInput').val('')
        addTodo(newTodo)
    })
    .catch(function(err){
        console.log(err)
    })
}