const Joi = require("joi");

class Status {
    constructor(requestId, date, userName, fullName, shift, comment, status) {
        this.requestId = requestId;
        this.date = date;
        this.userName = userName;
        this.fullName = fullName;
        this.shift = shift;
        this.comment = comment;
        this.status = status;
    }

    validatePostOrPut() {
        const result = Joi.validate(this, Status.#postValidationSchema, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }



    static #postValidationSchema = {
        requestId: Joi.optional(),
        date: Joi.string().required().min(2).max(50).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "חסר תאריך"
                        break;
                    case "any.empty": err.message = "חסר תאריך"
                        break;
                    case "string.min": err.message = "תאריך חייב להיות לפחות 2 תווים"
                        break;
                    case "string.max": err.message = "תאריך לא יכול להיות יותר מ-50 תווים"
                        break;
                }
            }
            return errors;
        }),
        userName: Joi.string().required().min(2).max(11).regex(/^[a-zA-Z]+$/).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "יש לציין שם משתמש"
                        break;
                    case "any.empty": err.message = "שם משתמש לא יכול להיות ריק"
                        break;
                    case "string.min": err.message = "שם משתמש חייב להיות לפחות 2 תווים"
                        break;
                    case "string.max": err.message = "שם משתמש לא יכול להיות יותר מ-10 תווים"
                        break;
                    case "string.regex.base": err.message = "שם משתמש חייב להיות רשום באותיות באנגלית"
                        break;
                }
            }
            return errors;
        }),
        fullName: Joi.string().required().min(2).max(15).regex(/^([א-ת]+\s*)*$/).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "מלא שם פרטי"
                        break;
                    case "any.empty": err.message = "שם מלא לא יכול להיות ריק"
                        break;
                    case "string.min": err.message = "שם מלא חייב להיות לפחות 2 תווים"
                        break;
                    case "string.max": err.message = "שם מלא לא יכול להיות יותר מ-10 תווים"
                        break;
                    case "string.regex.base": err.message = "שם מלא חייב להיות רשום באותיות בעברית"
                        break;
                }
            }
            return errors;
        }),
        shift: Joi.string().required().min(2).max(11).regex(/^([א-ת]+\s*)+$/).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "יש לציין משמרת"
                        break;
                    case "any.empty": err.message = "משמרת לא יכולה להיות ריקה"
                        break;
                    case "string.min": err.message = "משמרת חייבת להיות לפחות 2 תווים"
                        break;
                    case "string.max": err.message = "משמרת לא יכול להיות יותר מ-10 תווים"
                        break;
                    case "string.regex.base": err.message = "משמרת חייבת להיות רשומה באותיות בעברית"
                        break;
                }
            }
            return errors;
        }),
        comment: Joi.string().allow('').max(50).regex(/^([א-ת]+\s*)*$/).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "string.max": err.message = "הערה לא יכולה להיות יותר מ-50 תווים"
                        break;
                    case "string.regex.base": err.message = "הערה חייבת להיות רשומה באותיות בעברית"
                        break;
                }
            }
            return errors;
        }),
        status: Joi.string().min(2).max(20).regex(/^([א-ת]+\s*)+$/).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "לציין משמרת סטטוס"
                        break;
                    case "any.empty": err.message = "סטטוס לא יכול להיות ריק"
                        break;
                    case "string.max": err.message = "סטטוס לא יכול להיות יותר מ-20 תווים"
                        break;
                    case "string.regex.base": err.message = "סטטוס חייב להיות רשום באותיות בעברית"
                        break;
                }
            }
            return errors;
        })
    };
}


module.exports = Status;