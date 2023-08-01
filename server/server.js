const express = require('express')
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const cors = require('cors')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const axios = require("axios")
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const multer = require("multer");
const Profile = require('./models/profileModel.js');
const Ass = require('./models/assModel.js');
const Eve= require('./models/eveModel.js');
const Credit= require('./models/creditModel.js');
const Expense= require('./models/expenseModel.js');

const app = express()

const client_id = "300155728118-6h29j4fmc5g5jtnoeb6b84g8v1m90pjc.apps.googleusercontent.com";
const client_secret = "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";
const redirect = "http://localhost:5000/redirect";
const api_key = "AIzaSyBezdbNGhAYnDGKabFqNH4JC5CqaXS6uQs";

const dbURI = 'mongodb+srv://user:1234@cluster.trkj9sy.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(dbURI)
    .then(() => { console.log('Connected to database') })
    .catch((err) => { console.log(err) })

const authClient = new google.auth.OAuth2({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect,
    // apiKey: api_key, // Pass the API key here
});

const authLink = authClient.generateAuthUrl({
    access_type: "offline",
    scope: [
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/calendar.calendarlist",
        "https://www.googleapis.com/auth/calendar"
    ],
    prompt: "consent",
    version: "v3",
})

// const upload = multer({
//     dest: 'public/images',
//     fileFilter: (req, file, cb) => {
//       if (
//         file.mimetype === 'image/jpeg' ||
//         file.mimetype === 'image/jpg' ||
//         file.mimetype === 'image/png'
//       ) {
//         cb(null, true);
//       } else {
//         cb(new Error('Invalid file type. Only JPEG, JPG, and PNG files are allowed.'));
//       }
//     },
//   });
  
//   app.post('/upload', upload.single('image'), async (req, res) => {
//     const imagePath = `${req.file.filename}`;
    
//   });

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
        optionsSuccessStatus: 200
    })
)

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json())
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));


app.post('/login', async (req, res) => {
    const user = await Profile.findOne({ username: req.body.username })
    req.session.isLoggedIn = false
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            req.session.isLoggedIn = true
            req.session.name = user.name
            req.session.email = user.username
            req.session.userid = user._id.toString()
            return res.send({ message: 'Login Successful', msg_type: 'success' })
        }
        else {
            return res.send({ message: 'Password Incorrect', msg_type: 'error' })
        }
    }
    else {
        return res.send({ message: 'No user with that Email', msg_type: 'error' })
    }
})

app.post('/register', async (req, res) => {
    const user = await Profile.findOne({ username: req.body.username })
    if (user) {
        res.send({ message: 'Email id  already Taken', msg_type: 'error' })
    }
    else {
        const data = new Profile({
            name: req.body.name,
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 10)
        })
        data.save()
            .then((result) => {
                res.send({ message: 'Registration Successful', msg_type: 'success' })
            })
            .catch(err => console.log(err));
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.status(500).send({ msg_type: 'error', message: 'Logout failed' });
        } else {
            res.clearCookie('connect.sid');
            res.send({ msg_type: 'success', message: 'Logout successful' });
        }
    });
});

app.get("/session", (req, res) => {
    if (req.session.isLoggedIn) {
        res.send({ msg_type: "success", session: req.session });
    } else {
        res.send({ msg_type: "error" })
    }
})

app.get("/courses", (req, res) => {
    const filePath = path.join(__dirname, "public", "courses.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return res.status(500).send({ error: "Error reading data" });
        }

        try {
            const coursesData = JSON.parse(data);
            res.send({ response: coursesData });
        } catch (parseError) {
            console.log("Error parsing JSON:", parseError);
            res.status(500).send({ error: "Error parsing JSON data" });
        }
    });
});

app.get("/gAuth", (req, res) => {
    res.redirect(authLink);
});

app.get("/checkgAuth", async (req, res) => {
    if (req.session.isLoggedIn) {
        const user = await Profile.findOne({ username: req.session.email });
        if (user.refresh_token) {
            const headers = {
                Authorization: `Bearer ${user.access_token}`,
                Accept: 'application/json',
            };
            authClient.setCredentials({ refresh_token: user.refresh_token, });
            const calendar = google.calendar({ version: "v3", auth: authClient });
            try {
                calendar.events.list({ headers, calendarId: "primary" }, (error, response) => {
                    if (error) {
                        console.log(error)
                        res.send({ msg_type: "error" });
                    } else {
                        if (response) {
                            // console.log(response.data)
                            res.send({ msg_type: "success" });
                        }
                    }
                });
            } catch (error) {
                console.log(error.message);
                res.send({ msg_type: "error" });
            }
        } else {
            res.send({ msg_type: "error" });
        }
    }
})

app.get("/redirect", async (req, res) => {
    const code = req.query.code;
    const response = await axios.post("https://accounts.google.com/o/oauth2/token", {
        code: code,
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect,
        grant_type: "authorization_code",
    });
    await Profile.updateOne(
        { username: req.session.email },
        { $set: { refresh_token: response.data.refresh_token, access_token: response.data.access_token } }
    );
    req.session.token = response.data.refresh_token;
    req.session.access_token = response.data.access_token;
    // await createWatchChannel(req.session.email)
    //     .catch(err => console.error('Error creating watch channel:', err));
    res.redirect("http://localhost:3000/create");
});


app.post("/addCalendar", async (req, res) => {
    const { name, branch, sem, course, due } = req.body;
    const user = await Profile.findOne({ username: req.session.email });
    authClient.setCredentials({ refresh_token: user.refresh_token, });
    const calendar = google.calendar({ version: "v3", auth: authClient });
    const response = calendar.events.insert({
        auth: authClient,
        calendarId: "primary",
        requestBody: {
            summary: name,
            description: `${branch}_sem${sem}_${course}`,
            location: "",
            colorId: 9,
            start: {
                dateTime: new Date(due),
            },
            end: {
                dateTime: new Date(due),
            },
        },
    });
    const data = new Ass({
        user: req.session.userid,
        name: req.body.name,
        branch: req.body.branch,
        sem: req.body.sem,
        course: req.body.course,
        due: req.body.due,
    })
    data.save()
        .then((result) => {
            res.send(response);
        })
        .catch(err => console.log(err));
});

app.post("/addEvent", async (req, res) => {
    const { name, Desc, start, end } = req.body;
    const user = await Profile.findOne({ username: req.session.email });
    authClient.setCredentials({ refresh_token: user.refresh_token, });
    const calendar = google.calendar({ version: "v3", auth: authClient });
    const response = calendar.events.insert({
        auth: authClient,
        calendarId: "primary",
        requestBody: {
            summary: name,
            description: Desc,
            location: "",
            colorId: 4,
            start: {
                dateTime: new Date(start),
            },
            end: {
                dateTime: new Date(end),
            },
        },
    });
    const data = new Eve({
        user: req.session.userid,
        name: name,
        desc: Desc,
        start: start,
        end: end
    })
    data.save()
        .then((result) => {
            res.send(response);
        })
        .catch(err => console.log(err));
});

app.post("/addCredit", async (req, res) => {
    const data = new Credit({
        user: req.session.userid,
        amount: req.body.Amount,
        desc: req.body.desc,
        date: req.body.date
    })
    data.save()
        .then((result) => {
            res.send({ msg_type: 'success' })
        })
        .catch(err => console.log(err));
})

app.post("/addExpense", async (req, res) => {
    const data = new Expense({
        user: req.session.userid,
        amount: req.body.Amount,
        desc: req.body.desc,
        type: req.body.type,
        date: req.body.date
    })
    data.save()
        .then((result) => {
            res.send({ msg_type: 'success' })
        })
        .catch(err => console.log(err));
})



// const formatDate = (input) => {
//     const date = new Date(input);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     let day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
// }

// function formatDateToYYYYMMDD(inputDate) {
//     // Step 1: Create a new Date object from the input date string
//     const dateObject = new Date(inputDate);

//     // Step 2: Extract the year, month, and day from the Date object
//     const year = dateObject.getFullYear();
//     const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1
//     const day = String(dateObject.getDate()).padStart(2, "0");

//     // Step 3: Format the values into the "yyyy-mm-dd" format
//     const formattedDate = `${year}-${month}-${day}`;

//     return formattedDate;
// }


app.post("/calendarList", async (req, res) => {
    const user = await Profile.findOne({ username: req.session.email });
    if (!user) console.log("User not found")

    authClient.setCredentials({ refresh_token: user.refresh_token });
    const calendar = google.calendar({ version: "v3", auth: authClient });
    // const startDate = formatDateToYYYYMMDD(req.query.start);
    // const endDate = formatDateToYYYYMMDD(req.query.end)

    const accessToken = user.access_token || req.session.access_token;
    if (!accessToken) {
        throw new Error("Access token missing or invalid");
    }

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
    };

    calendar.events.list({
        params: {
            headers,
        },
        calendarId: "primary",
        alwaysIncludeEmail: "true",
        // timeMin: (req.body.start).toISOString(),
        // timeMax: (req.body.end).toISOString(),
        orderBy: "startTime",
        showDeleted: false,
        singleEvents: true,
    }, (error, response) => {
        if (error) console.log(error)
        if (response && response.data && response.data.items) {
            const events = response.data.items;
            // createWatchChannel(req.session.email)
            res.send(events);
        }
    })
});

function generateUUID() {
    return uuidv4();
}

async function createWatchChannel(email) {
    const user = await Profile.findOne({ username: email });
    authClient.setCredentials({ refresh_token: user.refresh_token });

    const headers = {
        Authorization: `Bearer ${user.access_token}`,
        Accept: 'application/json',
    };

    const calendar = google.calendar({ version: 'v3', auth: authClient });
    const watchResponse = await calendar.events.watch({
        params: {
            headers,
        },
        calendarId: 'primary',
        requestBody: {
            id: generateUUID(),
            type: 'web_hook',
            address: 'https://8518-103-142-108-65.ngrok.io/notifications',
        },
    });
    console.log('Watch Channel Response:', watchResponse.data);
}

app.post('/notifications', (req, res) => {
    console.log('Received notification from Google Calendar API:', req.body);
    req.session.noti = req.body;
    res.sendStatus(200);
});

// app.get('/notifications', (req, res) => {
//     res.send(req.session.noti)
// })

app.get("/assignments", async (req, res) => {
    id = req.session.userid;
    const records = await Ass.find({ user: id });
    // console.log(records);
    res.send (records);
})

app.get("/events", async (req, res) => {
    id = req.session.userid;
    const records = await Eve.find({ user: id });
    // console.log(records);
    res.send (records);
})

app.get("/expenses", async (req, res) => {
    id = req.session.userid;
    const records = await Expense.find({ user: id });
    // console.log(records);
    res.send (records);
})

app.get("/credits", async (req, res) => {
    id = req.session.userid;
    const records = await Credit.find({ user: id });
    // console.log(records);
    res.send (records);
})


app.use((req, res, next) => {
    if (req.session) {
        if (req.session.isLoggedIn) { next() }
        else { res.send('error') }
    } else {
        res.send('error')
    }
})

app.listen(5000, () => console.log('Port Connected to 5000'))