import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'your-email@gmail.com',
		pass: 'your-email-password',
	},
});

export default transporter;
