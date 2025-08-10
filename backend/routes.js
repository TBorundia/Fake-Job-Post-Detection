// routes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./usermodel');

const router = express.Router();
// Add at the top with other requires
const JobAnalysis = require('./jobModel');


//<==================== Before Job Post =======================>
// JWT creator
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Middleware for auth
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
  next();
};

// USER REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, passwordHash: hash });
  await user.save();

  res.json({ message: 'User registered successfully' });
});

// LOGIN (user or admin)
router.post('/login', async (req, res) => {
  const { email, password, isAdminLogin } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  if (isAdminLogin && !user.isAdmin) {
    return res.status(403).json({ message: 'Not an admin account' });
  }

  const token = createToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  });

  res.json({ user: { email: user.email, isAdmin: user.isAdmin } });
});

// GET current user
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// ADMIN route
router.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "You're in admin page" });
});

// Promote user to admin (for initial setup, call this manually once)
router.post('/make-admin', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.isAdmin = true;
  await user.save();
  res.json({ message: `${email} is now admin` });
});



// Add this new route before module.exports
router.post('/analyze-job', authMiddleware, async (req, res) => {
  try {
    const {
      url,
      jobPost,
      platform,
      hasLogo,
      experience,
      education,
      employment,
      hasQuestion,
      fraudulent
    } = req.body;

    // Get user IP and user agent
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const newAnalysis = new JobAnalysis({
      url,
      jobPost,
      platform,
      hasLogo,
      experience,
      education,
      employment,
      hasQuestion,
      fraudulent,
      userIP,
      userAgent
    });

    await newAnalysis.save();

    res.status(201).json({
      success: true,
      message: 'Job analysis saved successfully',
      data: newAnalysis
    });
  } catch (error) {
    console.error('Error saving job analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save job analysis'
    });
  }
});

// Add a route to get all job analyses (admin only)
router.get('/job-analyses', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const analyses = await JobAnalysis.find().sort({ analysisDate: -1 });
    res.json({
      success: true,
      data: analyses
    });
  } catch (error) {
    console.error('Error fetching job analyses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job analyses'
    });
  }
});





// To display in admin panel

// Get all users (admin only)
router.get('/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get all job analyses (admin only)
// router.get('/job-analyses', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     const analyses = await JobAnalysis.find().sort({ analysisDate: -1 });
//     res.json(analyses);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch job analyses' });
//   }
// });

// In your routes.js
// In routes.js
router.get('/job-analyses', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const analyses = await JobAnalysis.find().sort({ analysisDate: -1 });
    res.json(analyses); // Should return JSON
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job analyses' });
  }
});

module.exports = router;
