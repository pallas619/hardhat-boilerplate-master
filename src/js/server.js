import express from "express";
import dotenv from "dotenv";
import moment from "moment";
import axios from "axios";
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

app.use(express.json());
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



//create 
// app.post("/Patient", async (req, res) => {
//     const newPatientData = req.body;

//     const patient = await prisma.patient.create({
//         data: {
//             firstName: newPatientData.firstName,
//             lastName: newPatientData.lastName,    
//             email: newPatientData.email,       
//             age:newPatientData.age,
//             diagnosis: newPatientData.diagnosis,
//             gender: newPatientData.gender,    
//             phoneNumber: newPatientData.phoneNumber,
//             dateOfBirth: newPatientData.dateOfBirth,
//             doctors: newPatientData.doctors,
//             staff: newPatientData.staff,      
//             staffId:newPatientData.staff,
//         },

//     });
//    res.send({
//     data: patient,
//     message:"add patient success"
//    });
// });

// Route untuk menambah Staff
app.post('/staff', async (req, res) => {
    const { name } = req.body;
    try {
        const staff = await prisma.staff.create({
            data: {
                name: name,
            },
        });
        res.status(201).json(staff);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Route untuk menambah Doctor
app.post('/doctor', async (req, res) => {
    const { address, name, specialization, staffId } = req.body;
    try {
        const doctor = await prisma.doctor.create({
            data: {
                address: address,
                name: name,
                specialization: specialization,
                staffId: staffId,
            },
        });
        res.status(201).json(doctor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route untuk menambah Patient
app.post('/patient', async (req, res) => {
    const { address, name, age, medicalHistory, doctorId, staffId } = req.body;
    try {
        const patient = await prisma.patient.create({
            data: {
                address: address,
                name: name,
                age: age,
                medicalHistory: medicalHistory,
                doctorId: doctorId,
                staffId: staffId,
            },
        });
        res.status(201).json(patient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// app.post("/Patient", async (req, res) => {
//     const newPatientData = req.body;

//     // Format dateOfBirth using moment.js
//     const formattedDateOfBirth = moment(newPatientData.dateOfBirth).format();

//     // Validate dateOfBirth format
//     if (!moment(newPatientData.dateOfBirth, moment.ISO_8601, true).isValid()) {
//         return res.status(400).send({
//             message: "Invalid dateOfBirth format"
//         });
//     }

//     // Ensure that doctors is an array of IDs
//     let doctorsArray = [];
//     if (Array.isArray(newPatientData.doctors)) {
//         doctorsArray = newPatientData.doctors;
//     } else if (typeof newPatientData.doctors === 'string') {
//         // Assuming the string is a single doctor ID, wrap it in an array
//         doctorsArray = [newPatientData.doctors];
//     }

//     try {
//         const patient = await prisma.patient.create({
//             data: {
//                 PatientName: newPatientData.PatientName,
//                 email: newPatientData.email,
//                 age: newPatientData.age,
//                 diagnosis: newPatientData.diagnosis,
//                 gender: newPatientData.gender,
//                 phoneNumber: newPatientData.phoneNumber,
//                 dateOfBirth: formattedDateOfBirth,
//                 doctors: {
//                     connect: doctorsArray.map(doctorId => ({
//                         id: parseInt(doctorId) // Ensure doctorId is an integer
//                     }))
//                 },
//                 staff: newPatientData.staff ? {
//                     connectOrCreate: {
//                         where: { id: parseInt(newPatientData.staff) }, // Ensure staff id is an integer
//                         create: { id: parseInt(newPatientData.staff) }
//                     }
//                 } : undefined,
//                 staffId: newPatientData.staff ? parseInt(newPatientData.staff) : undefined,
//             }
//         });

//         res.send({
//             data: patient,
//             message: "Add patient success"
//         });
//     } catch (error) {
//         console.error("Error creating patient:", error);
//         res.status(500).send({
//             message: "An error occurred while adding the patient.",
//             error: error.message
//         });
//     }
// });




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});