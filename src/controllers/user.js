const { user } = require("../../models");

exports.getAllUsers = async (req, res) => {
    try {
        const data = await user.findAll({ attributes: { exclude: ["password", "createdAt", "updatedAt"] } });
        res.status(200).send({
            status: "success",
            data: {
                user: data,
            },
        });
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { id } = req.users.id;
        const data = await user.findOne({ 
            where: { id },
            attributes: { exclude: ["password", "createdAt", "updatedAt"] } 
        });
        res.status(200).send({
            status: "success",
            data: {
                user: data,
            },
        });
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};

exports.editUser = async (req, res) => {
    try {
        const { id } = req.users.id;
        const body = {
            ...req.body,
            image: req.file.filename,
        };
        const data = await user.findOne({
            where: { id },
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        });
        await user.update({
            fullname: body.fullname,
            gender: body.gender,
            phone: body.phone,
            address: body.address,
            image: req.file.filename,
        });
        res.status(200).send({
          status: "success",
          data,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          status: "failed",
          message: "Server error",
        });
      }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await user.destroy({ where: { id } });
        if (result == 1) {
            res.status(200).send({
                status: "success",
                data: {
                id,
                },
            });
        } else {
        res.status(400).send({
            status: "error",
            message: "User doesn't exist",
        });
        }
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};
