import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

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
        res.cookie("test2", "myvalue2", {
            httpOnly: true,
        })
            .status(200)
            .json({ message: "Login successful!" });


    } catch (err) {
        console.log(err);
        res.send(500).json({ message: "Something went wrong!" });
    }
}

export const logout = (req, res) => {
    // db logic
    console.log("Logging out...");
}

