const { payment, user } = require("../../models");

exports.getAllPayment = async (req, res) => {
    try {
        const data = await payment.findAll({
        include: [
            {
                model: user,
                as: "userId",
                attributes: { exclude: ["createdAt", "updatedAt"] },
            },
        ],
        attributes: { exclude: ["id_user", "updatedAt"] },
        });

        res.status(200).send({
            status: "success",
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};

exports.addPayment = async (req, res) => {
    console.log(req.users);

    //date handling
    const date = new Date();
    const numberOfDaysToAdd = 30;
    const result = date.setDate(date.getDate() + numberOfDaysToAdd);
    const dueDate = new Date(result);
    const readyDueDate = dueDate.toISOString().slice(0, 19).replace("T", " ");
    console.log(readyDueDate);
    try {
        const cekPayment = await payment.findOne({
            where: { id_user: req.users.id },
        });
        
        if (cekPayment) {
            if (cekPayment.status === "Approved" || cekPayment.status === "Pending") {
                return res.send({
                    status: "error",
                    message: `You can't create a new payment, because your payment status is ${cekPayment.status}`,
                });
            }
        }
        const data = await payment.create({
            status: "Pending",
            attache: req.file.filename,
            dueDate: readyDueDate,
            id_user: req.users.id,
        });
        console.log(data)
        const value = data.dataValues;

        const dataUser = await user.findOne({
            where: { id: req.users.id },
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });

        const response = {
            id: value.id,
            startDate: value.createdAt,
            dueDate: value.dueDate,
            userId: { ...dataUser.dataValues},
            attache: value.attache,
            status: value.status,
        };
        res.status(200).send({
            status: "success",
            data: response,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};

exports.approvePayment = async (req, res) => {
    try {
        const response = await payment.update({ status: "Approved" }, { where: { id: req.params.id } });
        res.status(200).send({
        status: "success",
        data: response,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
    };

    exports.canclePayment = async (req, res) => {
    try {
        const response = await payment.update({ status: "Cancel" }, { where: { id: req.params.id } });
        res.status(200).send({
            status: "success",
            data: response,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};
