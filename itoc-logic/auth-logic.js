const dal = require("../data-access-layer/dal");
const hash = require("../helpers/hash");

//register a user
async function register(user) {

    // Hash user password: 
    user.password = hash(user.password);

    //user not admin
    user.isAdmin = 0;

    const sql = `INSERT INTO users VALUES(?,?,?,?,?,?,?)`;

    await dal.executeAsync(sql, [null, user.userName, user.firstName, user.lastName, user.password, user.team, user.isAdmin]); // 0 = Not Admin

    //delete password for security
    delete user.password;

    return user;
}

//login a user
async function login(credentials) {

    // Hash user password:
    credentials.password = hash(credentials.password);

    const sql = `
    SELECT firstName, lastName, userName, team, isAdmin
    FROM users
    WHERE username = ? AND password = ?`;
    const users = await dal.executeAsync(sql, [credentials.userName, credentials.password]);
    const user = users[0];

    return user;
}

//update a user
async function updateFullUser(user) {

    // Hash user password: 
    user.password = hash(user.password);

    const sql = `UPDATE users SET firstName = ?, lastName = ?, password = ?, team = ?, isAdmin = ? WHERE userName = ?`;
    const info = await dal.executeAsync(sql, [user.firstName, user.lastName, user.password, user.team, user.isAdmin, user.userName]);

    //for security
    delete user.password;

    return info.affectedRows === 0 ? null : user;
};

//get All Users Names
async function getAllUsersNames() {
    const sql = `SELECT userName FROM users`;
    const usersNames = await dal.executeAsync(sql);
    return usersNames;
}

//get All Users Names
async function getAllUsers() {
    const sql = `SELECT firstName, lastName, userName, team, isAdmin FROM users`;
    const users = await dal.executeAsync(sql);
    return users;
}

module.exports = {
    register,
    login,
    updateFullUser,
    getAllUsersNames,
    getAllUsers
};
