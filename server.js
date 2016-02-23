var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 0,
    description: 'Kill the bugs',
    completed: false
}, {
    id: 1,
    description: 'Plan bug funeral',
    completed: false
}];

app.get('/', function (request, response) {
    response.send('Todo API Root');
});

// GET /todos/
app.get('/todos', function (request, response) {
    response.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (request, response) {
    var todoId = request.params.id;
    var todo = todos.find(
        function(element, index, array) {
            return element.id == todoId;
        }
    );

    if(todo) {
        response.json(todo);
    } else {
        response.status(404).send();
    }
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});
