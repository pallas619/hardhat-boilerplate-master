// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Healthcare {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    enum Specialty {
        Bedah,
        Umum,
        Anak
    }
    enum Gender {
        LakiLaki,
        Perempuan
    }

    struct Patient {
        address id;
        string name;
        uint age;
        string medicalHistory;
        Gender gender;
    }

    struct Doctor {
        address id;
        string name;
        Specialty specialty;
    }

    struct Staff {
        string name;
    }

    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    mapping(address => Staff) public staff;
    uint public patientCounter;
    address[] public doctorList;

    event PatientAdded(address patientId, string name, uint age, string medicalHistory, Gender gender);
    event DoctorAdded(address doctorId, string name, Specialty specialty);
    event StaffAdded(string name, address addr);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function addStaff(string memory _name, address _addr) public onlyAdmin {
        staff[_addr] = Staff(_name);
        emit StaffAdded(_name, _addr);
    }

    function addDoctor(
        address _id,
        string memory _name,
        Specialty _specialty
    ) public {
        doctors[_id] = Doctor(_id, _name, _specialty);
        emit DoctorAdded(_id, _name, _specialty);
    }


    function addPatient(
        address id,
        string memory _pname,
        uint age,
        string memory medicalHistory,
        Gender gender
    ) public {
        patients[id] = Patient(id, _pname, age, medicalHistory, gender);
        emit PatientAdded(id, _pname, age, medicalHistory, gender);
    }

    function getPatient(
        address id
    ) public view returns (address, string memory, uint, string memory ,Gender) {
        Patient memory patient = patients[id];
        return (patient.id, patient.name, patient.age, patient.medicalHistory, patient.gender);
    }

    function getDoctor(
        address _id
    ) public view returns (address, string memory, Specialty) {
        Doctor memory doctor = doctors[_id];
        return (doctor.id, doctor.name, doctor.specialty);
    }
}
