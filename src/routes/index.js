const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const uploadFile = require("../middlewares/uploadFile");
const uploadMusic = require("../middlewares/uploadMusic");

const { login, register, checkAuth } = require("../controllers/auth");
router.post("/login", login);
router.post("/register", register);
router.get("/check-auth", auth, checkAuth);

const { getAllUsers, getUser, editUser, deleteUser } = require("../controllers/user");
router.get("/users", getAllUsers);
router.get("/user/:id", getUser);
router.patch("/user/:id", auth, uploadFile("image"), editUser);
router.delete("/user/:id", deleteUser);

const { addMusic, deleteMusic, getAllMusic } = require("../controllers/music");
router.get("/musics", getAllMusic);
router.delete("/music/:id", deleteMusic);
router.post("/add-music", auth, uploadMusic(["attache", "thumbnail"]), addMusic);

const { getAllArtists, getArtist, addArtist } = require("../controllers/artist");
router.get("/artists", getAllArtists);
router.get("/artist/:id", getArtist);
router.post("/add-artist", auth, addArtist);

const { getAllPayment, addPayment, approvePayment, canclePayment } = require("../controllers/payment");
router.get("/payments", getAllPayment);
router.post("/add-payment", auth, uploadFile("attache"), addPayment);
router.patch("/approvePayment/:id", auth, approvePayment);
router.patch("/rejectPayment/:id", auth, canclePayment);

module.exports = router;