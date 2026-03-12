const fs = require("node:fs/promises");

const path = require("path");
const USERS_FILE = path.join(__dirname, "../data/users.json");

async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, "utf8");
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}
async function writeUsers(users) {
    await fs.writeFile(
        USERS_FILE,
        JSON.stringify(users, null, 2)
    );
}

async function registerUser(userName, fullName, password) {
    const users = await readUsers();
    if (users[userName]) {
        throw new Error("Username already exists");
    }
    users[userName] = {
        fullName,
        password
    };
    await writeUsers(users);
}

async function authenticateUser(userName, password) {
    const users = await readUsers();

    const user = users[userName];

    if (!user) return false;

    return user.password === password;
}

module.exports = {
    registerUser,
    authenticateUser
};