const dal = require("../data-access-layer/dal");

async function getAllRequests() {
    const sql = "SELECT * FROM requests ORDER BY date";
    const requests = await dal.executeAsync(sql);
    return requests;
}

async function getRequestsOfUser(userName) {
    const sql = "SELECT * FROM requests WHERE userName =? ORDER BY date";
    const requests = await dal.executeAsync(sql, [userName]);
    return requests;
}

//add a request
async function addRequest(request) {

    const { date, userName, fullName, shift, comment, status } = request;

    const sql = `INSERT INTO requests VALUES(?,?,?,?,?,?,?)`;

    const info = await dal.executeAsync(sql, [null, date, userName, fullName, shift, comment, status]); 
    request.requestId = info.insertId;
    return request;
}


//update a request
async function updateFullRequest(request) {
    const { requestId, date, fullName, shift, comment, status } = request;

    const sql = `UPDATE requests SET date = ?, fullName = ?, shift = ?, comment = ?, status = ? WHERE requestId = ?`;
    const info = await dal.executeAsync(sql, [date, fullName, shift, comment, status, requestId]);
    return info.affectedRows === 0 ? null : request;
};

module.exports = {
    getAllRequests,
    getRequestsOfUser,
    addRequest,
    updateFullRequest
}