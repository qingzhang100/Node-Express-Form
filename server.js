/*********************************************************************************
 * Used Express to route webpages
 * CSS stylesheet is in views/layouts folder
 * 
 * Instruction: 
 * 1. In the Terminal panel, type "node server.js", then "app listening on: 8080" appears
 * 2. Go to the browser address bar, enter "http://localhost:8080/", a welcome message appears
 * 3. Enter http://localhost:8080/parttimer to see the route /PartTimer
 * 4. Enter http://localhost:8080/employees to see the route /employees
 * 5. Enter http://localhost:8080/employees/add, the form is displayed, try to enter the information accordingly and click "Add Student"
 ********************************************************************************/

const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const data = require("./modules/officeData.js");

const app = express();

app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

const HTTP_PORT = process.env.PORT || 8080;


app.use(express.urlencoded({ extended: true }));


// Returns the html code from the home.html file located within the views directory
app.get("/", (req, res) => {
    res.send(" == Home Page loaded successfully == ");
});

app.get("/PartTimer", (req, res) => {
    data.getPartTimers().then((data) => {
        res.json(data);
    });
});

app.get("/employees", (req, res) => {
    data.getAllEmployees()
        .then((data) => {
            res.render('employees', { employees: data });
        })
        .catch((data) => {
            res.render('employees', { message: "no result" })
        });
})

app.get("/employees/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
})

app.post("/employees/add", (req, res) => {
    data.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    })
})

app.get("/description", (req, res) => {
    res.render('description')
})

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


data.initialize().then(function() {
    app.listen(HTTP_PORT, function() {
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err) {
    console.log("unable to start server: " + err);
});
