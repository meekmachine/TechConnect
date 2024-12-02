import React, { useState } from 'react';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    // Submit if no errors
    if (Object.keys(newErrors).length === 0) {
      alert('Account Created Successfully!');
      console.log('Form Data:', formData);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#4444c3' }}>Create an Account</h1>
      <form onSubmit={handleSubmit}>
        {/* First Name */}
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginBottom: '10px' }}
          />
          {errors.firstName && <span style={{ color: 'red' }}>{errors.firstName}</span>}
        </div>

        {/* Last Name */}
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginBottom: '10px' }}
          />
          {errors.lastName && <span style={{ color: 'red' }}>{errors.lastName}</span>}
        </div>

        {/* Email */}
        <div>
          <label>E-mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginBottom: '10px' }}
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>

        {/* Username */}
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginBottom: '10px' }}
          />
          {errors.username && <span style={{ color: 'red' }}>{errors.username}</span>}
        </div>

        {/* Password */}
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', marginBottom: '10px' }}
          />
          {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4444c3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage;
