const { user } = require("../../models");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    const data = req.body;
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(6).required(),
        fullname: Joi.string().required(),
        gender: Joi.string().required(),
        phone: Joi.string().min(10).required(),
        address: Joi.string().required(),
    });

    const { error } = schema.validate(data);

    if (error) {
        return res.send({
            status: "error",
            message: error.details[0].message,
        });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const userExist = await user.findOne({
            where: {
            email: data.email,
            },
        });

        if (userExist) {
            return res.send({
                status: "error",
                message: "email already used",
            });
        }

        const newUser = await user.create({
            email: req.body.email,
            password: hashedPassword,
            fullname: req.body.fullname,
            gender: req.body.gender,
            status: 0,
            phone: req.body.phone,
            address: req.body.address,
        });

        const dataToken = {
            email: newUser.email,
        };
        const token = jwt.sign(dataToken, process.env.TOKEN_API);
        res.send({
            status: "success",
            data: {
                user: {
                    id: newUser.id,
                    fullname: newUser.fullname,
                    email: newUser.email,
                    gender: newUser.gender,
                    phone: newUser.phone,
                    address: newUser.address,
                    token,
                },
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};

exports.login = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(5).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.send({
            status: "error",
            message: error.details[0].message,
        });
    }
    try {
        const userExist = await user.findOne({
            where: {
                email: req.body.email,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        if (!userExist) {
            return res.send({
                status: "error",
                message: "user doesn't exist",
            });
        }
        const isValid = await bcrypt.compare(req.body.password, userExist.password);

        if (!isValid) {
        return res.send({
                status: "error",
                message: "Wrong Email or Password",
            });
        }

        const dataToken = {
            id: userExist.id,
        };
        const token = jwt.sign(dataToken, process.env.TOKEN_API);

        res.status(200).send({
            status: "success",
            data: {
                user: {
                    id: userExist.id,
                    fullname: userExist.fullname,
                    email: userExist.email,
                    gender: userExist.gender,
                    phone: userExist.phone,
                    address: userExist.address,
                    status: userExist.status,
                    token,
                },
            },
        });
    } catch (error) {
        res.status(500).send({
        status: "failed",
        message: "Server error",
        });
    }
    };

exports.checkAuth = async (req, res) => {
    try {
        const id = req.users.id;
        const dataUser = await user.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        });

        if (!dataUser) {
        return res.status(404).send({
            status: "failed",
        });
        }

        res.status(200).send({
            status: "success",
            data: {
                user: {
                id: dataUser.id,
                fullname: dataUser.fullname,
                email: dataUser.email,
                status: dataUser.status,
                },
            },
        });
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};
