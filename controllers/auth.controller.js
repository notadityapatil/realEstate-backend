import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {

    console.log("Registering...");

    // db logic
    const { username, email, password } = req.body;

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    // CREATE USER AND SAVE TO DB
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    });

    console.log(newUser)
}

export const login = (req, res) => {
    // db logic
    console.log("Logging in...");
}

export const logout = (req, res) => {
    // db logic
    console.log("Logging out...");
}

