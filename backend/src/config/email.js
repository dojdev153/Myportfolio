const nodemailer = require('nodemailer');

const emailEnabled = String(process.env.ENABLE_EMAIL).toLowerCase() === 'true';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send contact notification to admin
const sendContactNotification = async (contactData) => {
  if (!emailEnabled) {
    console.log('📭 Email disabled — skipping admin contact notification.');
    return;
  }
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `🚀 New Portfolio Contact: ${contactData.subject}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #ffffff; border-radius: 10px; overflow: hidden; border: 2px solid #00D9FF;">
        <div style="background: linear-gradient(135deg, #00D9FF, #B847FF); padding: 20px; text-align: center;">
          <h1 style="margin: 0; color: #000; font-size: 24px; text-shadow: 0 0 10px rgba(255,255,255,0.5);">
            🎯 NEW PORTFOLIO CONTACT
          </h1>
        </div>
        
        <div style="padding: 30px; background: rgba(26, 26, 46, 0.8);">
          <div style="margin-bottom: 20px; padding: 15px; background: rgba(0, 217, 255, 0.1); border-left: 4px solid #00D9FF; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #00D9FF;">👤 Contact Details</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${contactData.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${contactData.email}" style="color: #00FF88;">${contactData.email}</a></p>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background: rgba(184, 71, 255, 0.1); border-left: 4px solid #B847FF; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #B847FF;">📧 Message</h3>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
            <div style="margin-top: 10px; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 5px; border: 1px solid rgba(255,255,255,0.1);">
              ${contactData.message.replace(/\\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background: rgba(0, 255, 136, 0.1); border-left: 4px solid #00FF88; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #00FF88;">🔍 Technical Info</h3>
            <p style="margin: 5px 0; font-size: 12px; color: #999;">
              IP: ${contactData.ipAddress || 'Unknown'}<br>
              User Agent: ${contactData.userAgent || 'Unknown'}<br>
              Time: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #FF1B7A, #00FF88); padding: 15px; text-align: center;">
          <p style="margin: 0; color: #000; font-weight: bold;">
            🎉 Time to connect with a potential opportunity!
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Contact notification email sent successfully');
  } catch (error) {
    console.error('❌ Error sending contact notification email:', error);
    throw error;
  }
};

// Send auto-reply to visitor
const sendAutoReply = async (contactData) => {
  if (!emailEnabled) {
    console.log('📭 Email disabled — skipping auto-reply.');
    return;
  }
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: contactData.email,
    subject: `Thanks for reaching out! 🚀 - dojdev Portfolio`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #ffffff; border-radius: 10px; overflow: hidden; border: 2px solid #00D9FF;">
        <div style="background: linear-gradient(135deg, #00D9FF, #B847FF); padding: 20px; text-align: center;">
          <h1 style="margin: 0; color: #000; font-size: 24px; text-shadow: 0 0 10px rgba(255,255,255,0.5);">
            🎯 DOJDEV PORTFOLIO
          </h1>
          <p style="margin: 5px 0; color: #000; font-weight: bold;">HITAYEZU Frank Duff</p>
        </div>
        
        <div style="padding: 30px; background: rgba(26, 26, 46, 0.8);">
          <h2 style="color: #00D9FF; margin-bottom: 20px;">Hi ${contactData.name}! 👋</h2>
          
          <p style="margin-bottom: 15px; line-height: 1.6;">
            Thanks for reaching out through my portfolio! I've received your message about 
            "<strong style="color: #00FF88;">${contactData.subject}</strong>" and I'm excited to connect.
          </p>
          
          <div style="margin: 20px 0; padding: 20px; background: rgba(0, 217, 255, 0.1); border-left: 4px solid #00D9FF; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #00D9FF;">⚡ What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>I'll review your message within <strong>24 hours</strong></li>
              <li>You'll get a personalized response from me</li>
              <li>We can discuss your project in more detail</li>
            </ul>
          </div>
          
          <div style="margin: 20px 0; padding: 20px; background: rgba(184, 71, 255, 0.1); border-left: 4px solid #B847FF; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #B847FF;">🚀 In the meantime:</h3>
            <p style="margin: 0; line-height: 1.6;">
              Feel free to check out my latest projects and connect with me on social media. 
              I'm always excited to discuss new opportunities and innovative ideas!
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #00FF88; font-weight: bold; margin: 0;">
              Looking forward to our conversation! 🌟
            </p>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #FF1B7A, #00FF88); padding: 15px; text-align: center;">
          <p style="margin: 0; color: #000; font-weight: bold;">
            🎉 Let's build something amazing together!
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Auto-reply email sent successfully');
  } catch (error) {
    console.error('❌ Error sending auto-reply email:', error);
    throw error;
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  if (!emailEnabled) {
    console.log('📭 Email disabled — skipping email configuration verification.');
    return false;
  }
  // Skip verification if email credentials are not provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
      process.env.EMAIL_PASS === 'your-16-character-app-password-here') {
    console.log('⚠️  Email credentials not configured. Email features disabled.');
    return false;
  }

  const transporter = createTransporter();
  try {
    await transporter.verify();
    console.log('✅ Email configuration verified successfully');
    return true;
  } catch (error) {
    console.log('⚠️  Email configuration error:', error.message);
    console.log('💡 Email features will be disabled. Configure Gmail app password to enable.');
    return false;
  }
};

module.exports = {
  sendContactNotification,
  sendAutoReply,
  verifyEmailConfig
};
