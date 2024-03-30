import nodemailer from 'nodemailer';

export default async function sendEmail(req, res) {
    if (req.method === 'POST') {
        const { recipientEmail, orderInfo } = req.body;

        // 這裡設置你的SMTP服務器資料
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // 如果是465端口，則設為true
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 這裡設置郵件內容
        const mailOptions = {
            from: '"跳蚤市場" <timothyshih1203007@gmail.com>', // 發送者顯示名稱和郵箱地址
            to: 'tim@teachcake.com', // 測試
            //to: recipientEmail, // 
            subject: '跳蚤市場訂單資訊', // 郵件主題
            text: orderInfo, // 郵件內文
            // 如果需要寄送HTML格式的郵件，可以使用html鍵來指定HTML內容
        };

        // 發送郵件
        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Error sending email' });
        }
    } else {
        // 如果不是POST請求，返回405方法不允許
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
