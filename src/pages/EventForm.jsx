import React, { useState, useEffect } from 'react';

// Step 1: Event Creation Form Component
const EventCreationForm = ({ formData, setFormData, nextStep }) => {
  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');

  const eventTypes = [
    'Festival',
    'Sports Tournament',
    'Stand Up Comedy',
    'Conference',
    'Technology Event',
    'Corporate Event',
    'Private Event/Party',
    'Drive-in Event',
    'Comedy Show'
  ];

  const requiredFields = ['brand', 'eventName', 'eventStartDate', 'eventEndDate', 'venue', 'eventType'];

  useEffect(() => {
    if (formData.eventStartDate && !formData.eventEndDate) {
      const startDate = new Date(formData.eventStartDate);
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 3);
      setFormData(prev => ({
        ...prev,
        eventEndDate: endDate.toISOString().slice(0, 16)
      }));
    }
  }, [formData.eventStartDate]);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'eventName':
        if (!value.trim()) {
          error = 'Event name is required';
        } else if (value.length < 3) {
          error = 'Event name must be at least 3 characters';
        }
        break;

      case 'eventLink':
        if (value && !isValidUrl(value)) {
          error = 'Please enter a valid URL';
        }
        break;

      case 'eventStartDate':
        if (!value) {
          error = 'Start date is required';
        } else if (new Date(value) < new Date()) {
          error = 'Start date cannot be in the past';
        }
        break;

      case 'eventEndDate':
        if (!value) {
          error = 'End date is required';
        } else if (formData.eventStartDate && new Date(value) <= new Date(formData.eventStartDate)) {
          error = 'End date must be after start date';
        }
        break;

      case 'brand':
        if (!value.trim()) {
          error = 'Brand is required';
        }
        break;

      case 'venue':
        if (!value.trim()) {
          error = 'Venue is required';
        }
        break;

      case 'eventType':
        if (!value) {
          error = 'Please select an event type';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (requiredFields.includes(name)) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      if (!formData.tags.includes(newTag.trim())) {
        if (formData.tags.length < 10) {
          setFormData(prev => ({
            ...prev,
            tags: [...prev.tags, newTag.trim()]
          }));
          setNewTag('');
        } else {
          alert('Maximum 10 tags allowed');
        }
      } else {
        alert('This tag already exists');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (formData.eventStartDate && formData.eventEndDate) {
      if (new Date(formData.eventEndDate) <= new Date(formData.eventStartDate)) {
        newErrors.eventEndDate = 'End date must be after start date';
      }
    }

    if (formData.ticketSalesStart && formData.ticketSalesEnd) {
      if (new Date(formData.ticketSalesEnd) <= new Date(formData.ticketSalesStart)) {
        newErrors.ticketSalesEnd = 'Ticket sales end must be after start';
      }
      if (new Date(formData.ticketSalesStart) > new Date(formData.eventStartDate)) {
        newErrors.ticketSalesStart = 'Ticket sales should start before the event';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateForm()) {
      nextStep();
    } else {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  const getTodayDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const isRequired = (fieldName) => requiredFields.includes(fieldName);

  return (
    <div className="space-y-8 ">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
        <p className="text-gray-600">Step 1: Event Details</p>
      </div>

      <form onSubmit={handleNext} className="space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Event Details</h2>
          
          <div className="space-y-4">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                {isRequired('brand') && <span className="ml-1 text-red-500">*</span>}
              </div>
              <p className="text-sm text-gray-500 mb-2">Search for the brand running this event</p>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.brand ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Search for brand..."
              />
              {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
            </div>

            {/* Event Name */}
            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Event Name
                </label>
                {isRequired('eventName') && <span className="ml-1 text-red-500">*</span>}
              </div>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.eventName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Short Event Name"
              />
              {errors.eventName && <p className="mt-1 text-sm text-red-600">{errors.eventName}</p>}
            </div>

            {/* Event Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Link
              </label>
              <input
                type="url"
                name="eventLink"
                value={formData.eventLink}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.eventLink ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="https://www.clientsafety.com/events"
              />
              {errors.eventLink && <p className="mt-1 text-sm text-red-600">{errors.eventLink}</p>}
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Event Start Date
                  </label>
                  {isRequired('eventStartDate') && <span className="ml-1 text-red-500">*</span>}
                </div>
                <input
                  type="datetime-local"
                  name="eventStartDate"
                  value={formData.eventStartDate}
                  onChange={handleInputChange}
                  min={getTodayDate()}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.eventStartDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.eventStartDate && <p className="mt-1 text-sm text-red-600">{errors.eventStartDate}</p>}
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Event End Date
                  </label>
                  {isRequired('eventEndDate') && <span className="ml-1 text-red-500">*</span>}
                </div>
                <input
                  type="datetime-local"
                  name="eventEndDate"
                  value={formData.eventEndDate}
                  onChange={handleInputChange}
                  min={formData.eventStartDate || getTodayDate()}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.eventEndDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.eventEndDate && <p className="mt-1 text-sm text-red-600">{errors.eventEndDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Sales Start (optional)
                </label>
                <input
                  type="datetime-local"
                  name="ticketSalesStart"
                  value={formData.ticketSalesStart}
                  onChange={handleInputChange}
                  max={formData.eventStartDate}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.ticketSalesStart ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.ticketSalesStart && <p className="mt-1 text-sm text-red-600">{errors.ticketSalesStart}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Sales End (optional)
                </label>
                <input
                  type="datetime-local"
                  name="ticketSalesEnd"
                  value={formData.ticketSalesEnd}
                  onChange={handleInputChange}
                  min={formData.ticketSalesStart}
                  max={formData.eventStartDate}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.ticketSalesEnd ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.ticketSalesEnd && <p className="mt-1 text-sm text-red-600">{errors.ticketSalesEnd}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donor Open Time (optional)
                </label>
                <input
                  type="datetime-local"
                  name="donorOpenTime"
                  value={formData.donorOpenTime}
                  onChange={handleInputChange}
                  max={formData.eventStartDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum age
                </label>
                <select
                  name="minimumAge"
                  value={formData.minimumAge}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All Ages</option>
                  <option>18+</option>
                  <option>21+</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Venue Details */}
            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Venue Details
                </label>
                {isRequired('venue') && <span className="ml-1 text-red-500">*</span>}
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Can't Find Your Venue? Enter Address Manually
              </p>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.venue ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Search for a Venue, Address or City"
              />
              {errors.venue && <p className="mt-1 text-sm text-red-600">{errors.venue}</p>}
            </div>
          </div>

          <hr className="my-6" />

          {/* Google Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Google</h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="disabledAccess"
                  checked={formData.disabledAccess}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">This venue has disabled access</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="hideVenue"
                  checked={formData.hideVenue}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Hide this venue from customers</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Description Date (optional)
                </label>
                <input
                  type="datetime-local"
                  name="locationDescriptionDate"
                  value={formData.locationDescriptionDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="sendAltInfo"
                  checked={formData.sendAltInfo}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Send alternative information for RSVPs</span>
              </label>
            </div>
          </div>

          <hr className="my-6" />

          {/* Additional Location Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800">Additional Location Information</h3>
            <p className="text-sm text-gray-600">
              For the best display, use 1200 x 630 pixels
            </p>
            <p className="text-sm text-gray-600">
              Use a ratio of 2:1 between 300 x 157 and 4006 x 4006 pixels
            </p>
          </div>
        </div>

        {/* Event Types Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Event Types {isRequired('eventType') && <span className="text-red-500">*</span>}
          </h2>
          {errors.eventType && <p className="mb-3 text-sm text-red-600">{errors.eventType}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {eventTypes.map((type) => (
              <label key={type} className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                formData.eventType === type ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="eventType"
                  value={type}
                  checked={formData.eventType === type}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Tags</h2>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a tag"
                maxLength={20}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500">Press Enter or click Add. Max 10 tags, 20 characters each.</p>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                      aria-label={`Remove ${tag} tag`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next: Payment Configuration →
          </button>
        </div>
      </form>
    </div>
  );
};

// Step 2: Payment Configuration Form Component
const PaymentConfigurationForm = ({ formData,  prevStep, handleFinalSubmit, isSubmitting }) => {
  const [errors, setErrors] = useState({});
  const [ticketTypes, setTicketTypes] = useState([
    { id: 1, name: 'General Admission', price: 50, quantity: 100, description: 'Standard entry ticket' },
    { id: 2, name: 'VIP', price: 150, quantity: 50, description: 'VIP access with perks' }
  ]);

  const [paymentMethods, setPaymentMethods] = useState({
    creditCard: true,
    paypal: true,
    bankTransfer: false,
    crypto: false,
    applePay: true,
    googlePay: true
  });

  const [taxConfig, setTaxConfig] = useState({
    includeTax: true,
    taxRate: 10,
    taxInclusive: true
  });

  const [payoutConfig, setPayoutConfig] = useState({
    payoutMethod: 'bankTransfer',
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    frequency: 'afterEvent',
    holdPercentage: 0
  });

  const handlePaymentMethodChange = (method) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
  };

  const handleTaxConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaxConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePayoutChange = (e) => {
    const { name, value } = e.target;
    setPayoutConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTicketTypeChange = (id, field, value) => {
    setTicketTypes(prev => 
      prev.map(ticket => 
        ticket.id === id ? { ...ticket, [field]: value } : ticket
      )
    );
  };

  const addTicketType = () => {
    const newId = Math.max(...ticketTypes.map(t => t.id)) + 1;
    setTicketTypes(prev => [
      ...prev,
      { id: newId, name: '', price: 0, quantity: 0, description: '' }
    ]);
  };

  const removeTicketType = (id) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(prev => prev.filter(ticket => ticket.id !== id));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!ticketTypes.every(t => t.name && t.price > 0 && t.quantity > 0)) {
      newErrors.ticketTypes = 'All ticket types must have a name, positive price, and quantity';
    }
    
    if (!payoutConfig.accountName || !payoutConfig.accountNumber) {
      newErrors.payout = 'Payout account details are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const paymentData = {
        ticketTypes,
        paymentMethods,
        taxConfig,
        payoutConfig
      };
      
      // Merge payment data with event data
      const finalData = {
        ...formData,
        paymentConfiguration: paymentData,
        eventId: `EVT-${Date.now()}`
      };
      
      handleFinalSubmit(finalData);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Payment Configuration</h1>
        <p className="text-gray-600">Step 2: Set up payments for your event</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Ticket Types Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Ticket Types & Pricing</h2>
            <button
              type="button"
              onClick={addTicketType}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
            >
              + Add Ticket Type
            </button>
          </div>
          
          {errors.ticketTypes && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{errors.ticketTypes}</p>
          )}
          
          <div className="space-y-4">
            {ticketTypes.map((ticket) => (
              <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-700">Ticket Type #{ticket.id}</h3>
                  {ticketTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketType(ticket.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ticket Name *
                    </label>
                    <input
                      type="text"
                      value={ticket.name}
                      onChange={(e) => handleTicketTypeChange(ticket.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., General Admission"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={ticket.price}
                      onChange={(e) => handleTicketTypeChange(ticket.id, 'price', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={ticket.quantity}
                      onChange={(e) => handleTicketTypeChange(ticket.id, 'quantity', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={ticket.description}
                      onChange={(e) => handleTicketTypeChange(ticket.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="What's included?"
                    />
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  Total revenue potential: ${(ticket.price * ticket.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Tickets Available:</span>
              <span className="font-bold text-lg">{ticketTypes.reduce((sum, t) => sum + t.quantity, 0)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-medium">Maximum Revenue Potential:</span>
              <span className="font-bold text-lg text-green-600">
                ${ticketTypes.reduce((sum, t) => sum + (t.price * t.quantity), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Accepted Payment Methods</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(paymentMethods).map(([method, enabled]) => (
              <label key={method} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handlePaymentMethodChange(method)}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 capitalize">
                  {method === 'creditCard' ? 'Credit/Debit Card' : 
                   method === 'bankTransfer' ? 'Bank Transfer' :
                   method === 'applePay' ? 'Apple Pay' :
                   method === 'googlePay' ? 'Google Pay' : method}
                </span>
              </label>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Note:</span> Credit cards and PayPal are recommended for the best conversion rates. 
              Bank transfers may have longer processing times.
            </p>
          </div>
        </div>

        {/* Tax Configuration Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tax Configuration</h2>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="includeTax"
                checked={taxConfig.includeTax}
                onChange={handleTaxConfigChange}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Include taxes in ticket prices</span>
            </label>
            
            {taxConfig.includeTax && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    value={taxConfig.taxRate}
                    onChange={handleTaxConfigChange}
                    min="0"
                    max="50"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="taxInclusive"
                      checked={taxConfig.taxInclusive}
                      onChange={handleTaxConfigChange}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Tax inclusive pricing</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    When checked, taxes are included in displayed prices
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payout Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Payout Details</h2>
          
          {errors.payout && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{errors.payout}</p>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payout Method *
              </label>
              <select
                name="payoutMethod"
                value={payoutConfig.payoutMethod}
                onChange={handlePayoutChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bankTransfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe Connect</option>
                <option value="check">Paper Check</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={payoutConfig.accountName}
                  onChange={handlePayoutChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={payoutConfig.accountNumber}
                  onChange={handlePayoutChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123456789"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Routing Number (for US banks)
                </label>
                <input
                  type="text"
                  name="routingNumber"
                  value={payoutConfig.routingNumber}
                  onChange={handlePayoutChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="021000021"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payout Frequency
                </label>
                <select
                  name="frequency"
                  value={payoutConfig.frequency}
                  onChange={handlePayoutChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="afterEvent">After Event Ends</option>
                  <option value="weekly">Weekly</option>
                  <option value="biWeekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-md">
              <div className="flex items-center space-x-2 text-green-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Payout Security:</span>
                <span>Your bank details are encrypted and stored securely</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Event Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Event:</span>
                  <span className="font-medium">{formData.eventName || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Venue:</span>
                  <span className="font-medium">{formData.venue || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {formData.eventStartDate ? new Date(formData.eventStartDate).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Financial Overview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tickets:</span>
                  <span className="font-medium">{ticketTypes.reduce((sum, t) => sum + t.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Revenue:</span>
                  <span className="font-medium text-green-600">
                    ${ticketTypes.reduce((sum, t) => sum + (t.price * t.quantity), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Methods:</span>
                  <span className="font-medium">
                    {Object.values(paymentMethods).filter(v => v).length} enabled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isSubmitting}
          >
            ← Back to Event Details
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Event...
              </span>
            ) : 'Create Event & Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Multi-Step Form Component
const MultiStepEventForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    brand: '',
    eventName: '',
    eventLink: '',
    eventStartDate: '',
    eventEndDate: '',
    ticketSalesStart: '',
    ticketSalesEnd: '',
    donorOpenTime: '',
    minimumAge: 'All Ages',
    venue: '',
    disabledAccess: false,
    hideVenue: false,
    locationDescriptionDate: '',
    sendAltInfo: false,
    eventType: '',
    invitationRequired: false,
    freeCancelDisabled: false,
    refundsAllowed: false,
    passwordRequired: false,
    nftRequired: false,
    hashtag: '',
    tags: [],
    useAltPayout: false,
    multipleScans: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdEvent, setCreatedEvent] = useState(null);

  const nextStep = () => {
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleFinalSubmit = async (finalData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Event created successfully:', finalData);
      setCreatedEvent(finalData);
      setShowSuccess(true);
      
      // You would typically redirect to event dashboard or show success page
      // router.push(`/events/${finalData.eventId}`);
      
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      eventName: '',
      eventLink: '',
      eventStartDate: '',
      eventEndDate: '',
      ticketSalesStart: '',
      ticketSalesEnd: '',
      donorOpenTime: '',
      minimumAge: 'All Ages',
      venue: '',
      disabledAccess: false,
      hideVenue: false,
      locationDescriptionDate: '',
      sendAltInfo: false,
      eventType: '',
      invitationRequired: false,
      freeCancelDisabled: false,
      refundsAllowed: false,
      passwordRequired: false,
      nftRequired: false,
      hashtag: '',
      tags: [],
      useAltPayout: false,
      multipleScans: true,
    });
    setCurrentStep(1);
    setShowSuccess(false);
    setCreatedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8 pt-28">
          <div className="flex items-center justify-between mb-2">
            <div className={`text-sm font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              Step 1: Event Details
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              Step 2: Payment Configuration
            </div>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div 
              className="absolute h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: currentStep === 1 ? '50%' : '100%' }}
            ></div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && createdEvent && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-green-800">Event Created Successfully!</h3>
                  <p className="text-green-700">
                    Your event "{createdEvent.eventName}" has been created and is now live.
                    Event ID: {createdEvent.eventId}
                  </p>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="px-4 py-2 text-green-700 border border-green-300 rounded-md hover:bg-green-50"
              >
                Create Another Event
              </button>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-md">
                <div className="text-sm text-gray-600">Ticket Types</div>
                <div className="font-bold">
                  {createdEvent.paymentConfiguration?.ticketTypes?.length || 0} types
                </div>
              </div>
              <div className="p-4 bg-white rounded-md">
                <div className="text-sm text-gray-600">Revenue Potential</div>
                <div className="font-bold text-green-600">
                  ${createdEvent.paymentConfiguration?.ticketTypes?.reduce(
                    (sum, t) => sum + (t.price * t.quantity), 0
                  )?.toFixed(2) || '0.00'}
                </div>
              </div>
              <div className="p-4 bg-white rounded-md">
                <div className="text-sm text-gray-600">Event Status</div>
                <div className="font-bold text-blue-600">Published</div>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        {!showSuccess && (
          <>
            {currentStep === 1 && (
              <EventCreationForm
                formData={formData}
                setFormData={setFormData}
                nextStep={nextStep}
              />
            )}
            
            {currentStep === 2 && (
              <PaymentConfigurationForm
                formData={formData}
                setFormData={setFormData}
                prevStep={prevStep}
                handleFinalSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </>
        )}

        {/* Form Status */}
        {!showSuccess && (
          <div className="mt-8 p-4 bg-gray-100 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-700">Progress</h3>
              <span className="text-sm font-medium">
                Step {currentStep} of 2
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className={`p-2 rounded ${formData.eventName ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Event Name: {formData.eventName ? '✓' : '✗'}
              </div>
              <div className={`p-2 rounded ${formData.venue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Venue: {formData.venue ? '✓' : '✗'}
              </div>
              <div className={`p-2 rounded ${formData.eventType ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Event Type: {formData.eventType ? '✓' : '✗'}
              </div>
              <div className={`p-2 rounded ${currentStep === 2 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                Payment Setup: {currentStep === 2 ? 'In Progress' : 'Pending'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiStepEventForm;