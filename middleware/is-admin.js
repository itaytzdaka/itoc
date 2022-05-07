
function isAdmin(request, response, next) {

    const cookies = request.cookies;

    if (!cookies?.session) {
        response.status(401).send("You are not logged-in");
        return;
    }

    const user = cookies.session;
    if(!user.isAdmin){
        response.status(401).send("You are not admin");
        return;
    }

    next();
}

module.exports = isAdmin;

