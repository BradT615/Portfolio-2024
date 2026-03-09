import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const MY_EMAIL = 'bradtitus615@gmail.com';
export const FROM_EMAIL = 'noreply@bradtitus.dev';
export const FROM_NAME = 'Brad Titus';

export const LOGO_IMG = `<img src="https://bradtitus.dev/Logo.png" alt="Logo" style="width: 100px; height: auto;" />`;

export const emailStyle = `
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

export const headerStyle = `
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #eaeaea;
`;

export const contentStyle = `
  background-color: #f3f4f6;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`;

export { sgMail };
