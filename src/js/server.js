import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import * as tools from './tools.mjs';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();
const RC = await tools.constructSmartContract();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static('src'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get("/api", (req, res) => {
    res.send("Hello ddsadsWorld");
});

app.get("/Doctor", async (req, res) => {
    console.log("GET /Doctor route hit");
    try {
        const doctors = await prisma.doctor.findMany();
        console.log("Fetched doctors:", doctors);
        res.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).send({ error: "An error occurred while fetching doctors." });
    }
});
app.get("/Patient", async (req, res) => {
    console.log("GET /Patient route hit");
    try {
        const patient = await prisma.patient.findMany();
        console.log("Fetched patient:", patient);
        res.json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).send({ error: "An error occurred while fetching patients." });
    }
});
app.get("/Staff", async (req, res) => {
    console.log("GET /Staff route hit");
    try {
        const staff = await prisma.staff.findMany();
        console.log("Fetched staff:", staff);
        res.json(staff);
    } catch (error) {
        console.error("Error fetching staff:", error);
        res.status(500).send({ error: "An error occurred while fetching staff." });
    }
});

// Commented out code for future implementation

// app.post('/registration', async (req, res) => {
//     var addr = req.body.address;
//     var pwd = req.body.password;
//     try {
//         let tx = await RC.registerVoter(addr);
//         console.log(tx);
//         res.send("<p id='accountAddress'>Successfully Registered: " + addr + "</p>");
//     } catch (err) {
//         console.log(err);
//     }
// });

// app.post('/auth', async (req, res) => {
//     var addr = req.body.address;
//     var pwd = req.body.password;

//     try {
//         RC.getVoter(addr).then(function(res) {
//             console.log(res);
//             if (res == true) {
//                 res.cookie('addr', addr);
//                 res.redirect('/voting');
//             } else {
//                 res.send();
//             }
//         });
//     } catch (err) {
//         console.log(err);
//     }
// });

// app.get('/voting', async (req, res) => {
//     let candidateCounter = await RC.candCounter();
//     var _addr = req.cookies.addr
//     var _candObj = [];
//     for (let i = 1; i <= candidateCounter; i++) {
//         let _candidates = await RC.candidates(i);
//         _candObj[i - 1] = { id: _candidates['id'], name: _candidates['name'], voteCount: _candidates['voteCount'] };
//     }
//     res.render('pages/voting', {
//         candList: _candObj,
//         addr: _addr
//     });
// });

// app.post('/vote', async function (req, res) {
//     console.log(req.body);
//     var candId = req.body.candSelect;
//     var addr = req.body.accountAddress;
//     try {
//         let tx = await RC.vote(candId, addr);
//         console.log(tx);
//         res.redirect('/voting');
//     } catch (err) {
//         console.log(err);
//     }
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});