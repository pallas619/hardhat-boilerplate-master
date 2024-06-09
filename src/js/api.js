import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get("/api", (req, res) => {
    res.send("Hello Worlhalod");
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});