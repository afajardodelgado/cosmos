import React, { useState } from 'react';
import './CustomerSupport.css';
import backgroundImage from '../assets/images/Background-1Component4.png';

interface FormData {
  userType: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  priority: string;
  message: string;
  attachment: File | null;
}

const CustomerSupport: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    userType: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    priority: '',
    message: '',
    attachment: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, attachment: file }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.userType) newErrors.userType = 'Please select user type';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (formData.userType === 'partner' && !formData.company) {
      newErrors.company = 'Company is required for partners';
    }
    if (!formData.category) newErrors.category = 'Please select a support category';
    if (!formData.priority) newErrors.priority = 'Please select priority level';
    if (!formData.message) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission (replace with actual email service)
    try {
      const emailBody = `
User Type: ${formData.userType}
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company: ${formData.company || 'Not provided'}
Category: ${formData.category}
Priority: ${formData.priority}

Message:
${formData.message}

${formData.attachment ? `Attachment: ${formData.attachment.name}` : 'No attachment'}
      `;

      console.log('Form submission:', { formData, emailBody });
      
      // Here you would integrate with your email service
      alert('Support request submitted successfully! We will get back to you soon.');
      
      // Reset form
      setFormData({
        userType: '',
        name: '',
        email: '',
        phone: '',
        company: '',
        category: '',
        priority: '',
        message: '',
        attachment: null
      });
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="customer-support-page" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="support-hero">
        <div className="support-badge">Customer Support</div>
        <h1 className="support-title">
          <span className="title-blue">Get Help</span> When You Need It
        </h1>
        <p className="support-subtitle">
          Fill out the form below and our support team will get back to you as soon as possible
        </p>
      </div>

      <div className="support-form-container">
        <form onSubmit={handleSubmit} className="support-form">
          
          {/* User Type */}
          <div className="form-group">
            <label htmlFor="userType">I am a *</label>
            <select 
              id="userType" 
              name="userType" 
              value={formData.userType} 
              onChange={handleInputChange}
              className={errors.userType ? 'error' : ''}
            >
              <option value="">Select user type</option>
              <option value="partner">Partner</option>
              <option value="homeowner">Homeowner</option>
              <option value="other">Other</option>
            </select>
            {errors.userType && <span className="error-message">{errors.userType}</span>}
          </div>

          {/* Contact Information */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">
                Company {formData.userType === 'partner' && '*'}
              </label>
              <input 
                type="text" 
                id="company" 
                name="company" 
                value={formData.company} 
                onChange={handleInputChange}
                className={errors.company ? 'error' : ''}
              />
              {errors.company && <span className="error-message">{errors.company}</span>}
            </div>
          </div>

          {/* Support Category */}
          <div className="form-group">
            <label htmlFor="category">Support Category *</label>
            <select 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleInputChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select category</option>
              <option value="hardware">Hardware Support</option>
              <option value="financing">Financing (Enfin)</option>
              <option value="installation">Installation</option>
              <option value="sales">Sales</option>
              <option value="general">General Inquiries</option>
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          {/* Priority Level */}
          <div className="form-group">
            <label htmlFor="priority">Priority Level *</label>
            <select 
              id="priority" 
              name="priority" 
              value={formData.priority} 
              onChange={handleInputChange}
              className={errors.priority ? 'error' : ''}
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            {errors.priority && <span className="error-message">{errors.priority}</span>}
          </div>

          {/* Message */}
          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea 
              id="message" 
              name="message" 
              value={formData.message} 
              onChange={handleInputChange}
              rows={5}
              placeholder="Please describe your issue or question in detail..."
              className={errors.message ? 'error' : ''}
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          {/* File Attachment */}
          <div className="form-group">
            <label htmlFor="attachment">Attachment</label>
            <input 
              type="file" 
              id="attachment" 
              name="attachment" 
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            />
            <small className="file-hint">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB)
            </small>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Support Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerSupport;