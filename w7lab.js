let mongoose = require('mongoose');
let morgan = require('morgan');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.engine("html", require('ejs').renderFile);
app.set("viewengine")//rendering
let Task = require('./models/task');
let Developer = require('./models/developer');

app.use(express.static('images'));
app.use(express.static('css')); 
app.use(morgan('common'));
let viewsPath=__dirname+'/views/';//bring current path then attach views

let url='mongodb://localhost:27017/lab7DB';

mongoose.connect(url, function (err) {
    if (err) {
        console.log("Could not connect", {err});
        // throw err;
    } else {
        console.log("Successfully connected");
    }
});

// Get Home Page

app.get('/', function (req, res) {
    res.sendFile(__dirname +'/views/home.html');
});

// get add Tasks Page
app.get('/addtask', function (req, res) {
    Task.find().exec(function (err, data) {
        res.render(viewsPath +'addtask.html', {tasks: data});
    });
});

 //Add Task
app.post('/addtask', function (req, res) {
    //const {name, due, description, assignto, status} = req.body
    console.log(req.body)
    const newTask = new Task({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        due: req.body.due,
        description: req.body.description,
        assignto: req.body.assignto,
        status: req.body.status
    });
    newTask.save(function (err, resp) {
        if (err) throw err;
        console.log('Task successfully added to DB', resp);
        res.redirect('/listtasks');
    });
    // res.redirect('/listtasks');  
});

// Remove Tasks by id Page
app.get('/deletebyid', function (req, res) {
    Task.find({}, function (err, data) {
        res.render(viewsPath+"deletebyid.html", {tasks: data});
    });
});

//Remove Task
app.post('/deletebyid', function (req, res) {
    let id = new mongoose.Types.ObjectId(req.body._id);
    Task.deleteOne({_id: id}, function (err) {
        if (err) throw err;
    });
    res.redirect('/listtasks');
    //res.render(viewsPath +'listtasks.html');
});

// List Tasks Page
app.get('/listtasks', function (req, res) {
    Task.find().exec(function(err,data){
        res.render(viewsPath+"listtasks.html", {tasks: data});
    });
    
});

//List Developers Page
app.get('/getdevelopers', function (req, res) {
    Developer.find({}).exec(function(err,data){
        res.render(viewsPath+"getdevelopers.html", {developers: data});
    })
});
// Add Developer
app.post('/insertdeveloper', function (req, res) {
    let newDeveloper = new Developer({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: req.body.firstName,
            surname: req.body.surname
        },
        level: req.body.level,
        address: {
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: req.body.unit
        }
    });

    newDeveloper.save(function (err) {
        if (err) {
            throw err
        }
        else {
            console.log("Developer successfully added to DB");
            res.redirect('/getdevelopers');
        }
    
    });
    
    // res.render(viewsPath +'getdevelopers.html');
});


//Add new Developer Page

app.get('/insertdeveloper', function (req, res) {
    res.render(viewsPath +'insertdeveloper.html');
    // Developer.find().exec(function (err, data) {
    //     res.render(viewsPath +'insertdeveloper.html', {developers: data});
    // })
});

//Get Update Tasks Page

app.get("/updatebyid", function (req, res) {
    Task.find().exec(function(err,data) {
        res.render(viewsPath+'updatebyid.html', {tasks: data});
    });
});
// Update Task
app.post("/updatebyid", function (req, res) {
    let id = new mongoose.Types.ObjectId(req.body._id);
    Task.updateOne({_id: id}, {$set: {'status': req.body.newTaskStatus}}, function (err) {
        if (err) throw err;
    });
    res.redirect('/listtasks');
});


// Remove Complete Tasks Page
app.get("/deletecompletedtasks", function (req, res) {
    Task.find({'status':'Complete'}).exec(function(err,data) {
        if (err) throw err;
        res.render(viewsPath+'deletecompletedtasks.html', {tasks: data});
    });
});

//Remove Complete
app.post('/deletecompletedtasks', function(req, res){
    Task.deleteMany({'status':'Complete'}, function (err) {
        if (err) throw err;
    });
    res.redirect('/listtasks');
});


    app.listen(8080);