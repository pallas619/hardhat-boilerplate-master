const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Healthcare", function () {
    let Healthcare;
    let healthcare;
    let admin;
    let doctor;
    let patient;

    beforeEach(async function () {
        [admin, doctor, patient] = await ethers.getSigners();
        Healthcare = await ethers.getContractFactory("Healthcare");
        healthcare = await Healthcare.deploy();
        await healthcare.deployed();
    });

    it("Should set the right admin", async function () {
        expect(await healthcare.admin()).to.equal(admin.address);
    });

    it("Should authorize a doctor", async function () {
        await healthcare.connect(admin).authorizeDoctor(doctor.address, "Dr. Smith", "Cardiology");
        const doctorRecord = await healthcare.doctors(doctor.address);
        expect(doctorRecord.name).to.equal("Dr. Smith");
    });

    it("Should add a patient record", async function () {
        await healthcare.connect(admin).authorizeDoctor(doctor.address, "Dr. Smith", "Cardiology");
        await healthcare.connect(doctor).addPatientRecord(patient.address, "John Doe", 30, "No history");
        const patientRecord = await healthcare.patientRecords(patient.address);
        expect(patientRecord.name).to.equal("John Doe");
    });
});
