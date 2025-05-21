import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (
	to: string,
	subject: string,
	body: string
) => {
	const transporter = nodemailer.createTransport({
		service: process.env.MAIL_HOST,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
	});

	const mailOptions = {
		from: "brianpericon.e92@gmail.com",
		to: to,
		subject: subject,
		text: body,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.info('Email sent: ' + info.response);
		}
	});
};
