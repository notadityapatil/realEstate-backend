import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {

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

        res.status(201).json({ message: "User created successfully!" });

    } catch (err) {
        res.status(500).json({ message: "Something went wrong!" });
        console.log(err);
    }

}

export const login = async (req, res) => {

    const { username, password } = req.body;

    try {

        // CHECK IF USER EXISTS

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // CHECK IF PASSWORD IS CORRECT

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // GENERATE TOKEN AND SEND TO USER
        const age = 60 * 60 * 24 * 7; // 1 week

        const token = jwt.sign({

            id: user.id
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: age
        });


        res.cookie("token", token, {
            httpOnly: true,
            maxAge: age,

        })
            .status(200)
            .json({ message: "Login successful!" });


    } catch (err) {
        console.log(err);
        res.send(500).json({ message: "Something went wrong!" });
    }
}

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout successful!" });
}

