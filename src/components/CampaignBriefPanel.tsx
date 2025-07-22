import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function CampaignBriefPanel() {
  // Update the import path to your actual mutation function, for example:
    // Update this to match the actual mutation path in your convex functions
    const createBrief = useMutation(api.aiTown.main.sendInput);
  // Make sure 'campaignBrief.create' matches the actual export in your convex functions
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    product: '',
    objective: '',
    targetAudience: '',
    budget: '',
    timeline: '',
    constraints: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBrief(formData);
      alert('Campaign brief submitted! Watch your marketing team discuss it.');
      setFormData({
        company: '',
        product: '',
        objective: '',
        targetAudience: '',
        budget: '',
        timeline: '',
        constraints: '',
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating brief:', error);
      alert('Error creating brief. Check console for details.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            ...buttonStyle,
            backgroundColor: '#007bff',
            color: 'white',
          }}
        >
          📋 Create Campaign Brief
        </button>
      ) : (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          width: '400px',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
            Create Campaign Brief
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Company Name"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              required
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Product/Service"
              value={formData.product}
              onChange={(e) => setFormData({...formData, product: e.target.value})}
              required
              style={inputStyle}
            />
            <textarea
              placeholder="Campaign Objective (e.g., Increase brand awareness by 30%)"
              value={formData.objective}
              onChange={(e) => setFormData({...formData, objective: e.target.value})}
              required
              style={{...inputStyle, minHeight: '80px', resize: 'vertical'}}
            />
            <input
              type="text"
              placeholder="Target Audience (e.g., 25-35 urban professionals)"
              value={formData.targetAudience}
              onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
              required
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Budget (e.g., $500,000)"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              required
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Timeline (e.g., 3 months, Q1 2024)"
              value={formData.timeline}
              onChange={(e) => setFormData({...formData, timeline: e.target.value})}
              required
              style={inputStyle}
            />
            <textarea
              placeholder="Constraints/Special Requirements (optional)"
              value={formData.constraints}
              onChange={(e) => setFormData({...formData, constraints: e.target.value})}
              style={{...inputStyle, minHeight: '60px', resize: 'vertical'}}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                type="submit" 
                style={{
                  ...buttonStyle,
                  backgroundColor: '#28a745',
                  color: 'white',
                  flex: 1,
                }}
              >
                Submit Brief
              </button>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)} 
                style={{
                  ...buttonStyle,
                  backgroundColor: '#6c757d',
                  color: 'white',
                  flex: 1,
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}