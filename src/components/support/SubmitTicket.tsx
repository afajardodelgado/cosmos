import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubmitTicket.css';
import { supportTicketService } from '../../services/supportTicketService';
import { CreateTicketData, TicketCategory, TicketPriority } from '../../types/supportTypes';
import axiaIcon from '../../assets/icons/axia-icon.jpeg';
import qcellsLogo from '../../assets/icons/qcells-logo.png';
import enfinLogo from '../../assets/icons/enfin-logo.png';
import cosmosIcon from '../../assets/icons/Cosmos bu Qcells_Navy 1_icon.png';
import supportIcon from '../../assets/icons/support.jpeg';

interface Platform {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface FormData {
  userType: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  category: TicketCategory | '';
  priority: TicketPriority | '';
  subject: string;
  message: string;
  attachment: File | null;
}

const SubmitTicket: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'platform' | 'form'>('platform');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  
  const platforms: Platform[] = [
    {
      id: 'axia',
      title: 'Axia By Qcells',
      description: 'Find tailored support for your Axia By Qcells products and services.',
      icon: axiaIcon
    },
    {
      id: 'qpartner',
      title: 'Q.Partner',
      description: 'Assistance for our Q.Partner network and collaboration tools.',
      icon: qcellsLogo
    },
    {
      id: 'enfin',
      title: 'EnFin',
      description: 'Get help with EnFin financial solutions and energy financing.',
      icon: enfinLogo
    },
    {
      id: 'cosmos',
      title: 'Cosmos By Qcells',
      description: 'Cosmos Platform support',
      icon: cosmosIcon
    },
    {
      id: 'other',
      title: 'Other Inquiries',
      description: 'For any other questions not covered by the categories above.',
      icon: supportIcon
    }
  ];

  const [formData, setFormData] = useState<FormData>({
    userType: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    priority: '',
    subject: '',
    message: '',
    attachment: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<string | null>(null);

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setStep('form');
  };

  const handleBackToPlatforms = () => {
    setStep('platform');
    setSelectedPlatform(null);
  };

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
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const ticketData: CreateTicketData = {
        subject: formData.subject,
        category: formData.category as TicketCategory,
        priority: formData.priority as TicketPriority,
        description: formData.message,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone || undefined,
        customerCompany: formData.company || undefined,
        userType: formData.userType
      };

      const newTicket = await supportTicketService.createTicket(ticketData);
      
      setCreatedTicket(newTicket.ticketNumber);
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        userType: '',
        name: '',
        email: '',
        phone: '',
        company: '',
        category: '',
        priority: '',
        subject: '',
        message: '',
        attachment: null
      });

      // Auto-redirect to tickets page after 3 seconds
      setTimeout(() => {
        navigate('/partners/es-portal/support/tickets');
      }, 3000);

    } catch (error) {
      console.error('Error creating ticket:', error);
      setErrors({ submit: 'Error submitting ticket. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="submit-success">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Ticket Created Successfully!</h2>
          <div className="success-details">
            <p>Your support ticket has been created with ID:</p>
            <div className="ticket-number-display">{createdTicket}</div>
            <p>Our support team will review your request and get back to you soon.</p>
          </div>
          <div className="success-actions">
            <button 
              onClick={() => navigate('/partners/es-portal/support/tickets')}
              className="view-tickets-btn"
            >
              View My Tickets
            </button>
            <button 
              onClick={() => {
                setSubmitSuccess(false);
                setCreatedTicket(null);
              }}
              className="create-another-btn"
            >
              Create Another Ticket
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Platform Selection Step
  if (step === 'platform') {
    return (
      <div className="submit-ticket">
        <div className="submit-header">
          <h2 className="submit-title">Submit Support Ticket</h2>
          <p className="submit-subtitle">
            Select the platform or service you need help with:
          </p>
        </div>

        <div className="platform-selection">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="platform-card"
              onClick={() => handlePlatformSelect(platform)}
            >
              <div className="platform-icon">
                <img 
                  src={platform.icon} 
                  alt={`${platform.title} Logo`} 
                  className={`platform-logo ${platform.id === 'axia' ? 'axia-logo' : platform.id === 'qpartner' ? 'qpartner-logo' : platform.id === 'other' ? 'other-logo' : ''}`}
                />
              </div>
              <div className="platform-content">
                <h3 className="platform-title">{platform.title}</h3>
                <p className="platform-description">{platform.description}</p>
                <div className="platform-arrow">Access Portal →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="submit-ticket">
      <div className="submit-header">
        <button 
          className="back-to-platforms-btn" 
          onClick={handleBackToPlatforms}
          type="button"
        >
          ← Back to Platform Selection
        </button>
        <h2 className="submit-title">Submit Support Ticket</h2>
        <p className="submit-subtitle">
          Creating ticket for: <strong>{selectedPlatform?.title}</strong>
        </p>
      </div>

      <div className="submit-form-container">
        <form onSubmit={handleSubmit} className="submit-form">
          
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

          {/* Ticket Details */}
          <div className="form-row">
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
          </div>

          {/* Subject */}
          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              value={formData.subject} 
              onChange={handleInputChange}
              placeholder="Brief description of your issue"
              className={errors.subject ? 'error' : ''}
            />
            {errors.subject && <span className="error-message">{errors.subject}</span>}
          </div>

          {/* Message */}
          <div className="form-group">
            <label htmlFor="message">Description *</label>
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

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Ticket...' : 'Create Support Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitTicket;