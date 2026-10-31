import express from 'express';
import { 
  handleContactForm, 
  getAdminMessages,
  updateMessageStatus,
  deleteMessage 
} from '../controller/contactusController.js';
// 💡 Make sure to import your authentication middleware from its actual path:
import { isAuthenticate } from '../middleware/AuthMiddleware.js';

const contactRoute = express.Router();

// Public Route
contactRoute.post('/', handleContactForm);

// Admin Dashboard Routes (Fixed variable names to contactRoute)
contactRoute.get('/admin/messages', isAuthenticate, getAdminMessages); 
contactRoute.patch('/admin/messages/:id', isAuthenticate, updateMessageStatus); 
contactRoute.delete('/admin/messages/:id', isAuthenticate, deleteMessage);      

// Fixed export to match the initialized variable name
export default contactRoute;
