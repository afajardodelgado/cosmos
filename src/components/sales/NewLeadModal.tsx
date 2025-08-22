import React, { useState } from 'react';
import './NewLeadModal.css';
import { SalesFormData, SalesFormErrors, NewLeadData } from '../../types/salesTypes';

interface NewLeadModalProps {
  onClose: () => void;
  onSubmit: (leadData: NewLeadData) => Promise<void>;
}

const NewLeadModal: React.FC<NewLeadModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<SalesFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    street: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: 'United States',
    monthlyElectricBill: '',
    kwhRate: '',
    leadType: '',
    referredBy: '',
    communicationPreference: '',
    gcid: ''
  });

  const [errors, setErrors] = useState<SalesFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: SalesFormErrors = {};

    // Required field validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const leadData: NewLeadData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        street: formData.street.trim() || undefined,
        city: formData.city.trim() || undefined,
        stateProvince: formData.stateProvince.trim() || undefined,
        postalCode: formData.postalCode.trim() || undefined,
        country: formData.country.trim() || 'United States',
        monthlyElectricBill: formData.monthlyElectricBill ? parseFloat(formData.monthlyElectricBill) : undefined,
        kwhRate: formData.kwhRate ? parseFloat(formData.kwhRate) : undefined,
        leadType: formData.leadType.trim() || undefined,
        referredBy: formData.referredBy.trim() || undefined,
        communicationPreference: formData.communicationPreference.trim() || undefined,
        gcid: formData.gcid.trim() || undefined
      };

      await onSubmit(leadData);
    } catch (error) {
      console.error('Failed to create lead:', error);
      alert('Failed to create lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="new-lead-modal">
        <div className="modal-header">
          <h2 className="modal-title">New Lead</h2>
          <button className="modal-close-btn" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="lead-form">
          <div className="form-section">
            <h3 className="section-title">LEAD INFORMATION</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'error' : ''}
                  required
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'error' : ''}
                  required
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Primary Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="monthlyElectricBill">Monthly Electric Bill</label>
                <input
                  type="number"
                  id="monthlyElectricBill"
                  name="monthlyElectricBill"
                  value={formData.monthlyElectricBill}
                  onChange={handleInputChange}
                  placeholder="150.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="kwhRate">kWh Rate</label>
                <input
                  type="number"
                  id="kwhRate"
                  name="kwhRate"
                  value={formData.kwhRate}
                  onChange={handleInputChange}
                  placeholder="0.12"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="leadType">Lead Type</label>
                <select
                  id="leadType"
                  name="leadType"
                  value={formData.leadType}
                  onChange={handleInputChange}
                >
                  <option value="">--None--</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="gcid">gcId</label>
                <input
                  type="text"
                  id="gcid"
                  name="gcid"
                  value={formData.gcid}
                  onChange={handleInputChange}
                  placeholder="GC1234"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="communicationPreference">Communication Preference</label>
                <select
                  id="communicationPreference"
                  name="communicationPreference"
                  value={formData.communicationPreference}
                  onChange={handleInputChange}
                >
                  <option value="">--None--</option>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="Text">Text</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="referredBy">Referred By</label>
                <input
                  type="text"
                  id="referredBy"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleInputChange}
                  placeholder="Search Contacts..."
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">ADDRESS INFORMATION</h3>
            
            <div className="form-group full-width">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="street">Street</label>
              <textarea
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                rows={3}
                placeholder="Additional address information..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Los Angeles"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stateProvince">State/Province</label>
                <input
                  type="text"
                  id="stateProvince"
                  name="stateProvince"
                  value={formData.stateProvince}
                  onChange={handleInputChange}
                  placeholder="CA"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="90210"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLeadModal;