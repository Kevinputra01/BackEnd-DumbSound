const { music, artist } = require("../../models");

exports.getAllMusic = async (req, res) => {
    try {
        const data = await music.findAll({
            include: [
                {
                    model: artist,
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                },
            ],
            order: [["id", "DESC"]],
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });
        res.status(200).send({
            status: "success",
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};

exports.getMusic = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await music.findOne({
            where: { id },
            attributes: { exclude: ["createdAt", "updatedAt"] },
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

exports.addMusic = async (req, res) => {
    console.log(req.users);
    try {
        const image = req.files.thumbnail[0].filename;
        const audio = req.files.attache[0].filename;
        const data = await music.create({
            ...req.body,
            attache: audio,
            thumbnail: image,
        });
        const artistData = await artist.findOne({
            where: { id: data.id_artist },
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });
        const response = {
            id: data.id,
            title: data.title,
            thumbnail: data.thumbnail,
            year: data.year,
            attache: data.attache,
            artist: artistData,
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

exports.editMusic = async (req, res) => {
    try {
        const image = req.files.thumbnail[0].filename;
        const audio = req.files.attache[0].filename;
        const { id } = req.params;
        const artistData = await artist.findOne({
            where: { id: data.id_artist },
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });
        const body = {
            ...req.body,
            attache: audio,
            thumbnail: image,
            id_artist: artistData,
        };
      await music.update(body, { where: { id } });
      const data = await music.findOne({
        where: { id },
        attributes: { exclude: [ "createdAt", "updatedAt"] },
      });
      res.status(200).send({
        status: "success",
        data
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "failed",
        message: "Server error",
      });
    }
};

exports.deleteMusic = async (req, res) => {
    try {
        const { id } = req.params;
        await music.destroy({ where: { id } });
        res.status(200).send({
            status: "Success",
            data: id,
        });
    } catch (error) {
        res.status(500).send({
            status: "failed",
            message: "Server error",
        });
    }
};
