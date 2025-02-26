import express from "express";
const router = express.Router();
import createReferral from '../controllers/referralController.js';
import validateReferral from '../middleware/validateReferral.js';
router.post('/referrals', validateReferral, createReferral);

export default router;