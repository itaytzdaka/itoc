
function isLoggedIn(request, response, next) {

    const cookies = request.cookies;

    if (!cookies?.session) {
        response.status(401).send("You are not logged-in");
        return;
    }

    next();

}

module.exports = isLoggedIn;