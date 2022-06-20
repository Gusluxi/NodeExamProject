import bcrypt from "bcrypt";
const saltRounds = 12;

export async function hashPassword(newPass) {
    return await bcrypt.hash(newPass, saltRounds);
};

export async function compareToDatabase(plainPass, hashedPass) {
    return await bcrypt.compare(plainPass, hashedPass);
};