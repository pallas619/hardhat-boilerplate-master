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

// Define view routes
app.get('/entry', (req, res) => {
    res.render('entry');
});

app.get('/', (req, res) => {
    res.render("tambahstaff");
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/tambahdoc', (req, res) => {
    res.render('tambahdoc');
});

app.get('/tambahpatient', (req, res) => {
    res.render('tambah');
});

app.get('/registration', (req, res) => {
    res.render('registration');
});

app.get('/entrydoc', (req, res) => {
    res.render('entrydoc');
});

// Add Patient Route
app.post('/add_patient', async (req, res) => {
    const { address, name, age, gender, medicalHistory } = req.body;

    console.log("Menambahkan pasien dengan detail:", { address, name, age, gender, medicalHistory });

    let genderEnum;
    if (gender === 'Laki-laki') {
        genderEnum = 0;
    } else if (gender === 'Perempuan') {
        genderEnum = 1;
    } else {
        return res.status(400).send('Gender tidak valid');
    }

    try {
        const RC = await tools.constructSmartContract();
        const transaction = await RC.addPatient(address, name, age, medicalHistory, genderEnum);
        await transaction.wait(); // Wait for the transaction to be mined
        res.status(200).json({ message: 'Pasien berhasil ditambahkan!' });

        // Optionally, fetch and log the patient
        // const patient = await RC.getPatient(address);
        // console.log("Data pasien:", patient);
    } catch (error) {
        console.error('Error adding patient:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add Doctor Route
app.post('/add_doc', async (req, res) => {
    const { address, name, specialty } = req.body;

    console.log("Menambahkan Doctor dengan detail:", { address, name, specialty});


    let specialtyEnum;
    if (specialty === 'Bedah') {
        specialtyEnum = 0;
    } else if (specialty === 'Umum') {
        specialtyEnum = 1;
    } else if (specialty === 'Anak') {
        specialtyEnum = 2;
    } else {
        return res.status(400).send('Spesialisasi tidak valid');
    }

    try {
        const RC = await tools.constructSmartContract();
        const transaction = await RC.addDoctor(address, name, specialtyEnum);
        await transaction.wait(); // Wait for the transaction to be mined
        res.status(200).send('Dokter berhasil ditambahkan!');
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/get_patient', async (req, res) => {
    const { id } = req.query;

    try {
        const RC = await tools.constructSmartContract();
        const patient = await RC.getPatient(id);
        const genderString = ['Laki-Laki', 'Perempuan'][patient[1]];
        const patientData = {
            address: patient[0],
            name: patient[1],
            age: patient[2],
            medicalHistory: patient[3],
            gender: genderString
        };

        res.render('patientdata', { patient: patientData });
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/registration", async (req, res) => {
    const { name, addr, password } = req.body;

    try {
        const newStaff = await prisma.staff.create({
            data: {
                address: addr,
                password: password,
            }
        });

        const RC = await tools.constructSmartContract();
        let sub = await RC.addStaff(name, addr);
        console.log(sub);
        res.redirect('/login');
    } catch (error) {
        console.error('Error adding staff', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/auth', async (req, res) => {
    const addr = req.body.address;
    const pwd = req.body.password;

    try {
        const staff = await prisma.staff.findUnique({
            where: {
                address: addr
            },
        });

        if (staff && staff.password === pwd) {
            res.cookie("address", addr, { maxAge: 90000, httpOnly: true });
            res.redirect("/entry");
        } else {
            res.redirect("/login");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
