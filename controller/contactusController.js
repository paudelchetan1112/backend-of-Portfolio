import Contact from '../model/contactModel.js'; 
import nodemailer from 'nodemailer'; 

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.EMAIL_PORT || '2525', 10), // Ensures port is a numeric value
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * @desc Handle public contact form submission
 * @route POST /api/contact
 * @access Public
 */
export const handleContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, honeypot } = req.body;

    // Honeypot spam mitigation
    if (honeypot) {
      return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    }

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'Please provide all fields.' });
    }

    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Save to Database
    const newContact = await Contact.create({ name, email, subject, message, ipAddress: clientIp });

    const mailOptions = {
      from: `"Website Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      replyTo: email,
      subject: `[New Contact] ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</p>
        <hr />
        <small>Database ID: ${newContact._id} | IP: ${clientIp}</small>
      `,
    };

    // Await ensures delivery completes safely before runtime cuts off execution
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Notification email sent: ${info.messageId}`);
    } catch (err) {
      console.error('Email failed to send, but data is safe in MongoDB:', err);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been safely received.',
    });
  } catch (error) {
    console.error('Contact Controller Error:', error);
    
    if (error.name === 'ValidationError' && error.errors) {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    
    return res.status(500).json({ success: false, error: 'Server error. Please try again later.' });
  }
};

/**
 * @desc Get all contact messages for the Admin Dashboard
 * @route GET /api/contact/admin/messages
 * @access Private (Admin Only)
 */
export const getAdminMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    console.error('Fetch Dashboard Messages Error:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc Update contact message status (e.g., read, replied, archived)
 * @route PATCH /api/contact/admin/messages/:id
 * @access Private (Admin Only)
 */
export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value.' });
    }

    const updatedMessage = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }

    return res.status(200).json({ success: true, message: `Message status updated to ${status}`, data: updatedMessage });
  } catch (error) {
    console.error('Update Status Error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Malformed Document ID format.' });
    }
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc Delete a contact message
 * @route DELETE /api/contact/admin/messages/:id
 * @access Private (Admin Only)
 */
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Contact.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }

    return res.status(200).json({ success: true, message: 'Message deleted successfully from database.' });
  } catch (error) {
    console.error('Delete Message Error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Malformed Document ID format.' });
    }
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};
