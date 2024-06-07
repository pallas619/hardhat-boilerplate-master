import express from 'express';
import * as tools from './tools.mjs';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HC = await tools.constructSmartContract(); // Menginisialisasi kontrak Healthcare
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static('src'));
app.use(cookieParser());

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Home page route
app.get('/', function(request, response) {
    response.render('pages/home');
});

// Endpoint untuk otorisasi dokter
app.post('/authorize-doctor', async (request, response) => {
    const { doctorAddress, name, specialization } = request.body;
    try {
        let tx = await HC.authorizeDoctor(doctorAddress, name, specialization);
        console.log(tx);
        response.send(`Doctor authorized: ${name}, Specialization: ${specialization}`);
    } catch (err) {
        console.log(err);
        response.status(500).send("Authorization failed.");
    }
});

// Endpoint untuk menambah catatan pasien
app.post('/add-patient-record', async (request, response) => {
    const { patientAddress, name, age, medicalHistory } = request.body;
    try {
        let tx = await HC.addPatientRecord(patientAddress, name, age, medicalHistory);
        console.log(tx);
        response.send(`Patient record added: ${name}`);
    } catch (err) {
        console.log(err);
        response.status(500).send("Failed to add patient record.");
    }
});

// Endpoint untuk memperbarui catatan pasien
app.post('/update-patient-record', async (request, response) => {
    const { patientAddress, name, age, medicalHistory } = request.body;
    try {
        let tx = await HC.updatePatientRecord(patientAddress, name, age, medicalHistory);
        console.log(tx);
        response.send(`Patient record updated: ${name}`);
    } catch (err) {
        console.log(err);
        response.status(500).send("Failed to update patient record.");
    }
});

// Endpoint untuk mendapatkan catatan pasien
app.get('/get-patient-record/:patientAddress', async (request, response) => {
    const { patientAddress } = request.params;
    try {
        let patientRecord = await HC.getPatientRecord(patientAddress);
        console.log(patientRecord);
        response.json(patientRecord);
    } catch (err) {
        console.log(err);
        response.status(500).send("Failed to get patient record.");
    }
});

// Endpoint untuk mendapatkan dokter berdasarkan spesialisasi
app.get('/get-doctors-by-specialization/:specialization', async (request, response) => {
    const { specialization } = request.params;
    try {
        let doctors = await HC.getDoctorsBySpecialization(specialization);
        console.log(doctors);
        response.json(doctors);
    } catch (err) {
        console.log(err);
        response.status(500).send("Failed to get doctors by specialization.");
    }
});

app.listen(3000, () => {
    console.log("I'm listening on port 3000");
});
