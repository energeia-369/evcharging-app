const express = require('express');
const dealershipController = require('./dealership.controller');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/dealership/apply
 * @desc    Apply for dealership/franchise
 * @access  Private
 */
router.post('/apply', authMiddleware, dealershipController.applyForDealership);

/**
 * @route   GET /api/dealership/details
 * @desc    Get dealership details
 * @access  Private
 */
router.get('/details', authMiddleware, dealershipController.getDealershipDetails);

/**
 * @route   GET /api/dealership/dashboard
 * @desc    Get dealership dashboard
 * @access  Private
 */
router.get('/dashboard', authMiddleware, dealershipController.getDashboard);

/**
 * @route   PUT /api/dealership/update
 * @desc    Update dealership
 * @access  Private
 */
router.put('/update', authMiddleware, dealershipController.updateDealership);

/**
 * @route   GET /api/dealership
 * @desc    Get all dealerships (Admin)
 * @access  Private
 */
router.get('/', authMiddleware, dealershipController.getAllDealerships);

module.exports = router;
