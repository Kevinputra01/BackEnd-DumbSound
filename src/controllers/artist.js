const { artist } = require("../../models");

exports.getAllArtists = async (req, res) => {
    try {
        const data = await artist.findAll({ 
            attributes: { exclude: [ "createdAt", "updatedAt"] } 
        });
        res.status(200).send({
            status: "success",
            data
        });
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};

exports.getArtist = async (req, res) => {
    try {
        const { id } = req.params;
    
        const data = await artist.findOne({
            where: {
                id,
            },
            attributes: {
            exclude: [ "id", "createdAt", "updatedAt"],
            },
        });
    
        res.send({
            status: "success",
            data
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.addArtist = async (req, res) => {
    try {
        const { name, old, tipe, career } = req.body;
        const data = await artist.create({ name, old, tipe, career });
        const response = {
            id: data.id,
            name: data.name,
            old: data.old,
            tipe: data.tipe,
            career: data.career,
        };
        res.send({
            status: "success...",
            data: response,
        });
        } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};