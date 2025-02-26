const validateReferral = (req, res, next) => {
  // Log the incoming request body for debugging (avoid logging sensitive data in production)
  console.log('Validating referral data:', req.body);

  // Destructure with default values to avoid undefined errors
  const { userName = '', userEmail = '', userPhone = '', friendName = '', friendEmail = '', friendPhone = '', vertical = '' } = req.body || {};

  const errors = {};

  try {
    // Validate userName
    if (!userName || typeof userName !== 'string' || userName.trim() === '') {
      errors.userName = 'User name is required and must be a non-empty string';
    } else if (userName.length > 100) { // Optional: Add max length constraint
      errors.userName = 'User name must not exceed 100 characters';
    }

    // Validate userEmail
    if (!userEmail || typeof userEmail !== 'string') {
      errors.userEmail = 'Valid user email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(userEmail.trim())) {
      errors.userEmail = 'Invalid email format';
    }

    // Validate userPhone
    if (!userPhone || typeof userPhone !== 'string') {
      errors.userPhone = 'User phone number is required';
    } else if (!/^\d{10}$/.test(userPhone.trim())) {
      errors.userPhone = 'User phone number must be exactly 10 digits';
    }

    // Validate friendName
    if (!friendName || typeof friendName !== 'string' || friendName.trim() === '') {
      errors.friendName = 'Friend name is required and must be a non-empty string';
    } else if (friendName.length > 100) { // Optional: Add max length constraint
      errors.friendName = 'Friend name must not exceed 100 characters';
    }

    // Validate friendEmail
    if (!friendEmail || typeof friendEmail !== 'string') {
      errors.friendEmail = 'Valid friend email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(friendEmail.trim())) {
      errors.friendEmail = 'Invalid friend email format';
    }

    // Validate friendPhone
    if (!friendPhone || typeof friendPhone !== 'string') {
      errors.friendPhone = 'Friend phone number is required';
    } else if (!/^\d{10}$/.test(friendPhone.trim())) {
      errors.friendPhone = 'Friend phone number must be exactly 10 digits';
    }

    // Validate vertical
    if (!vertical || typeof vertical !== 'string' || vertical.trim() === '') {
      errors.vertical = 'Vertical is required';
    } else if (!verticals.includes(vertical.trim())) { // Optional: Check against allowed values
      errors.vertical = 'Invalid vertical selection';
    }

    // If there are errors, send a response and exit
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ 
        success: false, 
        errors 
      });
    }

    // Attach validated data to request object for downstream use (optional)
    req.validatedData = { userName, userEmail, userPhone, friendName, friendEmail, friendPhone, vertical };
    next();
  } catch (error) {
    console.error('Validation error:', error.stack); // Log the full stack trace
    res.status(500).json({
      success: false,
      error: 'Internal server error during validation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
   
  }
};

// Optional: Define allowed verticals (can be moved to a config file)
const verticals = [
  'Product Management',
  'Data Science',
  'Business Analytics',
  'FinTech',
  'Digital Transformation',
  'Senior Leadership',
];

export default validateReferral;