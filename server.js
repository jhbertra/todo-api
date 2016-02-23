var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 0;

app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.send('Todo API Root');
});

// GET /todos/
app.get('/todos', function (request, response) {
    response.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (request, response) {
    var todoId = parseInt(request.params.id);
    var todo = _.findWhere(todos, {id: todoId});

    if (todo) {
        response.json(todo);
    } else {
        response.status(404).send();
    }
});

// POST /todos
app.post('/todos', function (request, response) {
    var body = _.pick(request.body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || !_.isString(body.description) ||
            body.description.trim().length === 0) {
        return response.status(400).send();
    }

    body.description = body.description.trim();
    body.id = todoNextId++;

    todos.push(body);
    response.json(body);
});

// DELETE /todos/:id

app.delete('/todos/:id', function (request, response) {
    var todoId = parseInt(request.params.id);
    var todo = _.findWhere(todos, {id: todoId});

    if (todo) {
        todos = _.without(todos, todo);
        response.json(todo);
    } else {
        response.status(404).json({error: 'no todo found with id ' + todoId});
    }
});

// PUT /todos/:id
app.put('/todos/:id', function (request, response) {
    var todoId = parseInt(request.params.id);
    var todo = _.findWhere(todos, {id: todoId});

    if (!todo) {
        return response.status(404).send();
    }

    var body = _.pick(request.body, 'description', 'completed');
    var validAttributes = {};

    if (body.hasOwnProperty('completed')) {
        if (_.isBoolean(body.completed)) {
            validAttributes.completed = body.completed;
        } else {
            return response.status(400).send();
        }
    }

    if (body.hasOwnProperty('description')) {
        if (_.isString(body.description) && body.description.trim().length > 0) {
            validAttributes.description = body.description.trim();
        } else {
            return response.status(400).send();
        }
    }

    _.extend(todo, validAttributes);
    response.json(todo);
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});
