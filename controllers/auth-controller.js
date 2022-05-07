const express = require("express");
const router = express.Router();
const authLogic = require("../itoc-logic/auth-logic");
const User = require("../models/user-model");
// const jwt = require("jsonwebtoken");
const isAdmin = require("../middleware/is-admin");
// const isHuman = require("../middleware/captcha-validate");
const errorHandler = require("../helpers/error-handler");
// const svgCaptcha = require("svg-captcha");


// router.get("/captcha", (request, response)=>{
//     const captcha = svgCaptcha.create();
//     const captchaText = captcha.text;
//     const captchaImage = captcha.data;

//     request.session.captchaText = captchaText;

//     response.type("svg").send(captchaImage);
// }); 

//POST - register a new user - http://localhost:3000/api/auth/register
router.post("/register", async (request, response) => {
    try {        
        const userToAdd = new User(
            request.body.userName,
            request.body.firstName,
            request.body.lastName,
            request.body.password,
            0 //not admin
        );

        // Validate user data: 
        const errors = userToAdd.validatePostOrPut();

        if (errors) {
            response.status(400).send(errors);
            return;
        }

        //register user (not admin)
        const user = await authLogic.register(userToAdd);

        response.cookie("session", user, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        //return user and accessToken
        response.status(201).json(user);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

//POST - login with user name and password - http://localhost:3000/api/auth/login
router.post("/login", async (request, response) => {
    try {
        
        const credentials = request.body;
        const user = await authLogic.login(credentials);

        //if user with these credentials not exist
        if (!user) {
            response.status(401).send("Illegal username or password");
            return;
        }

        response.cookie("session", user, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        //return user and accessToken
        response.json(user);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

//GET - getting all registered Users for register page - http://localhost:3000/api/auth/usersNames
router.get("/users-names", async (request, response) => {
    try {
        const usersNames = await authLogic.getAllUsersNames();
        response.json(usersNames);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});


//GET - getting all Users - http://localhost:3000/api/auth
router.get("/", isAdmin, async (request, response) => {
    try {
        const users = await authLogic.getAllUsers();
        response.json(users);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

//PUT - Update FULL User - http://localhost:3000/api/auth/:userName
router.put("/:userName", isAdmin, async (request, response) => {
    try {

        const { firstName, lastName, password, isAdmin } = request.body;
        const userName = request.params.userName;

        const userToUpdate = new User(userName, firstName, lastName, password, +isAdmin);

        // Validate user data 
        const errors = userToUpdate.validatePostOrPut();

        if (errors) {
            response.status(400).send(errors);
            return;
        }

        // update the user
        const updatedUser = await authLogic.updateFullUser(userToUpdate);
        if (!updatedUser) {
            response.sendStatus(404);
            return;
        }

        //return the user updated 
        response.json(updatedUser);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});



//GET - logout - http://localhost:3000/api/auth/logout
router.get("/logout", (request, response) => {
    try {
        const cookies = request.cookies;
        if (cookies?.user) {
            response.clearCookie("user", {httpOnly: true});
        }
        return response.sendStatus(204); //No content
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

module.exports = router;