import React from 'react';
import './ProductCards.css';
import { FlowState } from './ConsultationFlow';
import vppLogo from '../../assets/icons/vpp-logo.jpeg';

interface ProductCardsProps {
  flowState: FlowState;
  onUpdate: (updates: Partial<FlowState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProductCards: React.FC<ProductCardsProps> = ({
  flowState,
  onUpdate,
  onNext,
  onBack
}) => {
  const toggleProduct = (product: string) => {
    const currentProducts = flowState.selectedProducts;
    const updatedProducts = currentProducts.includes(product)
      ? currentProducts.filter(p => p !== product)
      : [...currentProducts, product];
    
    onUpdate({ selectedProducts: updatedProducts });
  };

  const isSelected = (product: string) => flowState.selectedProducts.includes(product);

  return (
    <div className="product-cards">
      <div className="products-grid">
        <div className={`product-card ${isSelected('solar') ? 'selected' : ''}`}>
          <div className="product-video-placeholder">
            <div className="play-button">▶</div>
            <img src={vppLogo} alt="Solar Panels" className="product-placeholder" />
          </div>
          
          <div className="product-content">
            <h3 className="product-title">Solar Panels</h3>
            <p className="product-description">
              Control your home energy costs with renewable solar energy by harnessing the
              potential of reliable Qcells solar panels.
            </p>
          </div>
          
          <div className="product-actions">
            <button 
              className={`select-btn ${isSelected('solar') ? 'selected' : ''}`}
              onClick={() => toggleProduct('solar')}
            >
              {isSelected('solar') ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>
        
        <div className={`product-card ${isSelected('battery') ? 'selected' : ''}`}>
          <div className="product-video-placeholder">
            <div className="play-button">▶</div>
            <img src={vppLogo} alt="Battery" className="product-placeholder" />
          </div>
          
          <div className="product-content">
            <h3 className="product-title">Battery</h3>
            <p className="product-description">
              Protect your home against power outages. Reduce your reliance on the grid
              and enjoy uninterrupted power when you need it most.
            </p>
          </div>
          
          <div className="product-actions">
            <button 
              className={`select-btn ${isSelected('battery') ? 'selected' : ''}`}
              onClick={() => toggleProduct('battery')}
            >
              {isSelected('battery') ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="navigation-buttons">
        <button className="back-btn" onClick={onBack}>
          Back
        </button>
        <button 
          className="next-btn"
          disabled={flowState.selectedProducts.length === 0}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductCards;