import nodemailer from "nodemailer";
import SendmailTransport from "nodemailer/lib/sendmail-transport";
const sendEmail = async (options: any) => {
	// create reusable transporter object
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD
		}
	});

	// send mail with transport object
	const message = {
		from: `${process.env.FROM_EMAIL}`,
		to: options.email,
		subject: options.subject,
		text: options.message // plain text body
	};

	try {
		const info = await transporter.sendMail(message);
		console.log("Message sent: %s", info.messageId);
	} catch (err) {
		console.log("err");
	}
};

export default sendEmail;
