const express = require("express");
const router = express.Router();
const requestLogic = require("../itoc-logic/request-logic");
const Request = require("../models/request-model");
const errorHandler = require("../helpers/error-handler");
const isLoggedIn = require("../middleware/is-logged-in");
const isAdmin = require("../middleware/is-admin");

//GET - get all requests - http://localhost:3000/api/requests
router.get("/", isAdmin,  async (request, response) => {
    try {
        const requests = await requestLogic.getAllRequests();
        response.json(requests);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});


//GET - get requests of user - http://localhost:3000/api/:userName
router.get("/:userName", isLoggedIn, async (request, response) => {
    try {
        const userName = request.params.userName;
        const requests = await requestLogic.getRequestsOfUser(userName);
        console.log(requests);
        response.json(requests);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});


//POST - add a request - http://localhost:3000/api/requests
router.post("/", isLoggedIn, async (request, response) => {
    try {        
        const requestToAdd = new Request(
            null, //requestId
            request.body.date,
            request.body.userName,
            request.body.fullName,
            request.body.shift,
            request.body.comment,
            request.body.team,
            request.body.status
        );

        // Validate request data: 
        const errors = requestToAdd.validatePostOrPut();
        if (errors) {
            response.status(400).send(errors);
            return;
        }

        //register user (not admin)
        const requestAdded = await requestLogic.addRequest(requestToAdd);

        //return user and accessToken
        response.status(201).json(requestAdded);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

//PUT - update full request - http://localhost:3000/api/requests/:id
router.put("/:id", isLoggedIn, async (request, response) => {
    try {
        const requestId = +request.params.id;
        const {date, userName, fullName, shift, comment, team, status} = request.body;

        const requestToUpdate = new Request(requestId, date, userName, fullName, shift, comment, team, status);

        // Validate vacation data: 
        const errors = requestToUpdate.validatePostOrPut();

        if(errors) {
            response.status(400).send(errors);
            return;
        }

        const updatedRequest = await requestLogic.updateFullRequest(requestToUpdate);
        if (!updatedRequest) {
            response.sendStatus(404);
            return;
        }
        response.json(updatedRequest);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});



module.exports = router;