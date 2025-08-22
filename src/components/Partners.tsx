import React, { useState } from 'react';
import './Partners.css';
import backgroundImage from '../assets/images/BACKGROUND_GROUP.png';
import partnerPortalIcon from '../assets/icons/partner_portal.png';
import qcellsProductIcon from '../assets/icons/qcells_hw_products.png';
import customerSupportIcon from '../assets/icons/customer_support.png';
import esPartnerPortalIcon from '../assets/icons/ES-Partner-Portal.png';
import enfinPartnerPortalIcon from '../assets/icons/Enfin-Partner-Portal.png';
import installingLogoIcon from '../assets/icons/Installing-Logo.png';

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

const Partners: React.FC = () => {
  const [showSupportForm, setShowSupportForm] = useState(false);
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
      
      alert('Support request submitted successfully! We will get back to you soon.');
      
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
      setShowSupportForm(false);
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="partners-page" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="partners-hero">
        <div className="partners-badge">For Partners</div>
        <h1 className="partners-title">
          <span className="title-blue">All-in-One</span> Solution
        </h1>
      </div>
      
      <div className="partners-grid">
        <div className="partner-card partner-portal-card">
          <div className="card-icon">
            <img src={partnerPortalIcon} alt="Partner Portal" className="icon-image" />
          </div>
          <h3 className="card-title">Partner Portals</h3>
          <div className="card-link">Select Portal</div>
          
          <div className="portal-options">
            <div className="partner-portal-row">
              <a href="/partners/es-portal" className="portal-option mini-card">
                <div className="portal-icon">
                  <img src={esPartnerPortalIcon} alt="ES Partner Portal" className="portal-icon-image" />
                </div>
                <div className="portal-text">
                  <div className="portal-name">ES Partner</div>
                  <div className="portal-subtitle">Portal</div>
                </div>
              </a>
              
              <a href="https://partner.enfin.com/pi/s/login/" target="_blank" rel="noopener noreferrer" className="portal-option mini-card">
                <div className="portal-icon">
                  <img src={enfinPartnerPortalIcon} alt="Enfin Partner Portal" className="portal-icon-image" />
                </div>
                <div className="portal-text">
                  <div className="portal-name">Enfin Partner</div>
                  <div className="portal-subtitle">Portal</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="partner-card qcells-hardware-card">
          <div className="card-icon">
            <img src={qcellsProductIcon} alt="Qcells Hardware Product" className="icon-image" />
          </div>
          <h3 className="card-title">Qcells Hardware Product</h3>
          <div className="card-link">Select Hardware</div>
          
          <div className="hardware-options">
            <div className="hardware-portal-row">
              <button className="hardware-option mini-card">
                <div className="portal-icon">
                  <img src={installingLogoIcon} alt="Installing" className="portal-icon-image" />
                </div>
                <div className="portal-text">
                  <div className="portal-name">Installing</div>
                  <div className="portal-subtitle"></div>
                </div>
              </button>
              
              <a href="https://www.portal-q-cells.us/#/login" target="_blank" rel="noopener noreferrer" className="hardware-option mini-card">
                <div className="portal-icon">
                  <img src={qcellsProductIcon} alt="Solar Monitoring" className="portal-icon-image" />
                </div>
                <div className="portal-text">
                  <div className="portal-name">Solar Monitoring</div>
                  <div className="portal-subtitle"></div>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="partner-card" onClick={() => setShowSupportForm(true)}>
          <div className="card-icon">
            <img src={customerSupportIcon} alt="Customer Support" className="icon-image" />
          </div>
          <h3 className="card-title">Customer Support</h3>
          <div className="card-link">Get Started →</div>
        </div>
      </div>

      {/* Support Form Modal */}
      {showSupportForm && (
        <div className="support-modal-overlay" onClick={() => setShowSupportForm(false)}>
          <div className="support-modal" onClick={(e) => e.stopPropagation()}>
            <div className="support-modal-header">
              <h2>Customer Support</h2>
              <button className="close-button" onClick={() => setShowSupportForm(false)}>×</button>
            </div>
            
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
                  rows={4}
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
      )}
    </div>
  );
};

export default Partners;