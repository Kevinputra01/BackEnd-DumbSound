const multer = require("multer");

module.exports = (fileUpload) => {
    // fileUpload = field file will upload in array

    // initialization multer diskstorage
    // make destination file for upload
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploadMusics`); //file storage location
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "")); // rename filename by date now + original filename
        },
    });

    // function for file filter based on extension
    const fileFilter = function (req, file, cb) {
        if (file.fieldname === fileUpload[0]) {
            // file upload 0 is music
            if (!file.originalname.match(/\.(mp3|MP3)$/)) {
                req.fileValidationError = {
                    message: "Only music files are allowed!",
                };
                return cb(new Error("Only music files are allowed!"), false);
            }
        }
        if (file.fieldname === fileUpload[1]) {
            // file upload 0 is cover image = thumbnail
            if (!file.originalname.match(/\.(JPG|jpg|JPEG|jpeg|PNG|png)$/)) {
                req.fileValidationError = {
                    message: "Only image files are allowed!",
                };
                return cb(new Error("Only image files are allowed!"), false);
            }
        }
        cb(null, true);
    };

    const sizeInMB = 10;
    const maxSize = sizeInMB * 1024 * 1024; // Maximum file size in MB

    // generate multer instance for upload include storage, validation and max file size
    const upload = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSize,
        },
    }).fields([
        { name: fileUpload[0], maxCount: 1 },
        { name: fileUpload[1], maxCount: 1 },
    ]);

    // middleware handler
    return (req, res, next) => {
        upload(req, res, function (err) {
            // show an error if validation failed
            if (req.fileValidationError) {
                req.session.message = {
                    type: "danger",
                    message: "Please select files to upload",
                };
                return res.redirect(req.originalUrl);
            }

        // show an error if file doesn't provided in req
        // if (!req.file && !err) {
        //   req.session.message = {
        //     type: 'danger',
        //     message: 'Please select files to upload',
        //   };
        //   return res.redirect(req.originalUrl);
        // }

            // show an error if it exceeds the max size
            if (err) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    req.session.message = {
                        type: "danger",
                        message: "Error, Max file sized 10MB",
                    };
                return res.redirect(req.originalUrl);
                }
                req.session.message = {
                    type: "danger",
                    message: err,
                };
                console.log("error", err);
                return res.redirect(req.originalUrl);
            }

        // if okay next to controller
        // in the controller we can access using req.file
        return next();
        });
    };
};
