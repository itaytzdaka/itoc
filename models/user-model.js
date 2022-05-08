const Joi = require("joi");

class User {
    constructor(userName, firstName, lastName, password, isAdmin) {
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    validatePostOrPut() {
        const result = Joi.validate(this, User.#postValidationSchema, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }



    static #postValidationSchema = {
        userName: Joi.string().required().min(2).max(15).regex(/^[a-zA-Z]+$/).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "חסר שם משתמש"
                        break;
                    case "any.empty": err.message = "שם משתמש לא יכול להיות ריק"
                        break;
                    case "string.min": err.message = "שם משתמש חייב להיות לפחות 2 תווים"
                        break;
                    case "string.max": err.message = "שם משתמש לא יכול להיות יותר מ-15 תווים"
                        break;
                    case "string.regex.base": err.message = "שם משתמש חייב להיות רשום באותיות באנגלית וללא רווחים"
                        break;
                }
            }
            return errors;
        }),
        firstName: Joi.string().required().min(2).max(10).regex(/^[א-ת]+$/).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "חסר שם פרטי"
                        break;
                    case "any.empty": err.message = "שם פרטי לא יכול להיות ריק"
                        break;
                    case "string.min": err.message = "שם פרטי חייב להיות לפחות 2 תווים"
                        break;
                    case "string.max": err.message = "שם פרטי לא יכול להיות יותר מ-10 תווים"
                        break;
                    case "string.regex.base": err.message = "שם פרטי חייב להיות רשום באותיות באנגלית וללא רווחים"
                        break;
                }
            }
            return errors;
        }),
        lastName: Joi.string().required().min(2).max(10).regex(/^[א-ת]+$/).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "חסר שם משפחה"
                        break;
                    case "any.empty": err.message = "שם משפחה לא יכול להיות ריק"
                        break;
                    case "string.min": err.message = "שם משפחה חייב להיות לפחות 2 תווים"
                        break;
                    case "string.max": err.message = "שם משפחה לא יכול להיות יותר מ-10 תווים"
                        break;
                    case "string.regex.base": err.message = "שם משפחה חייב להיות רשום באותיות בעברית וללא רווחים"
                        break;
                }
            }
            return errors;
        }),
        password: Joi.string().required().min(1).max(200).error(errors => {
            for (const err of errors) {
                switch (err.type) {
                    case "any.required": err.message = "חסרה סיסמה"
                        break;
                    case "any.empty": err.message = "סיסמה לא יכולה להיות ריקה"
                        break;
                    case "string.min": err.message = "סיסמה חייבת להיות מעל 6 תווים"
                        break;
                    case "string.max": err.message = "סיסמה חייבת להיות עד 200 תווים"
                        break;
                }
            }
            return errors;
        }),
        isAdmin: Joi.number().min(0).max(1)
    };
}


module.exports = User;