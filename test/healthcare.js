import { expect } from "chai";
// import { ethers } from "hardhat";
// import ethers from 'ethers'


describe("Healthcare Contract", function () {


    describe("Adding Doctors", function () {
        it("Should allow admin to add a doctor", async function () {
            const Healthcare = await ethers.getContractFactory("Healthcare");
            const healthcare = await Healthcare.deploy();
            const [addr1] = await ethers.getSigners();
            await expect(healthcare.addDoctor(addr1.address, "Dr. Smith",0));
            //   const doctor = await healthcare.getDoctor(addr1.address);
            //   expect(doctor.name).to.equal("Dr. Smith");
            //   expect(doctor.specialization).to.equal("Cardiology");
        });

        it("Should emit DoctorAdded event", async function () {
            const Healthcare = await ethers.getContractFactory("Healthcare");
            const healthcare = await Healthcare.deploy();
            const [doctorAddr] = await ethers.getSigners();
            await expect(healthcare.addDoctor(doctorAddr.address, "Dr. Smith", 0))
            .to.emit(healthcare, "DoctorAdded")
            .withArgs(doctorAddr.address, "Dr. Smith", 0);
        });
    });

    describe("Adding Patients", function () {
        it("Should allow adding a patient", async function () {
            const Healthcare = await ethers.getContractFactory("Healthcare");
            const healthcare = await Healthcare.deploy();
            const [staffAddr] = await ethers.getSigners();
            await expect(healthcare.addPatient("Alice", 30, "No allergies", 1, staffAddr.address));
        });

        

       
    });

    // describe("Adding Patients", function () {
    //     it("Should allow adding a patient", async function () {
    //         const Healthcare = await ethers.getContractFactory("Healthcare");
    //         const healthcare = await Healthcare.deploy();
    //         const [addr1] = await ethers.getSigners();
    //         await expect(healthcare.addPatient("Alice", 30, "No allergies"));
    //     });

    //     it("Should emit PatientAdded event", async function () {
    //         const Healthcare = await ethers.getContractFactory("Healthcare");
    //         const healthcare = await Healthcare.deploy();
    //         await expect(healthcare.addPatient("Alice", 30, "No allergies"))
    //             .to.emit(healthcare, "PatientAdded")
    //             .withArgs(0, "Alice", 30);
    //     });

    //     it("Should increment patientCounter", async function () {
    //         const Healthcare = await ethers.getContractFactory("Healthcare");
    //         const healthcare = await Healthcare.deploy();
    //         await healthcare.addPatient("Alice", 30, "No allergies");
    //         expect(await healthcare.patientCounter()).to.equal(1);
    //     });
    // });

    describe("Getting Patient Data", function () {
        it("Should return the correct patient data", async function () {
            const Healthcare = await ethers.getContractFactory("Healthcare");
            const healthcare = await Healthcare.deploy();
            await expect(healthcare.addPatient("Alice", 30, "No allergies"));
        });

        it("Should return the correct doctor data", async function () {
            const Healthcare = await ethers.getContractFactory("Healthcare");
            const healthcare = await Healthcare.deploy();
            const [addr1] = await ethers.getSigners();
            await expect(healthcare.addDoctor(addr1.address, "Dr. Smith", "Cardiology"));
        });
    });


    describe("Adding Staff", function () {
        it("Should allow admin to add staff", async function () {
            const Healthcare = await ethers.getContractFactory("Healthcare");
            const healthcare = await Healthcare.deploy();
            const [addr1, addr2] = await ethers.getSigners();
            await expect(healthcare.addStaff("Nurse Joy", addr2.address));
        });
    
        it("Should emit StaffAdded event", async function () {
            const Healthcare = await ethers.getContractFactory("Healthcare");
            const healthcare = await Healthcare.deploy();
            const [addr1, addr2] = await ethers.getSigners();
          await expect(healthcare.addStaff("Nurse Joy", addr2.address))
            .to.emit(healthcare, "StaffAdded")
            .withArgs("Nurse Joy", addr2.address);
        });
      });
    
     
});