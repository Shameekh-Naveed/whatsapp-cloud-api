import multer from 'multer';
import path from 'path';

// const storage = multer.memoryStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, 'uploads/'); // specify the destination folder
// 	},
// 	filename: (req, file, cb) => {
// 		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
// 		cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
// 	},
// });

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export default upload;
