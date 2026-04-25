import express from 'express'
import authenticateToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { Bid, Tender } from '../models/index.js';

const router = express.Router();

// All bid routes require authentication
router.use(authenticateToken);

// Bidder: Create a bid
router.post('/tender/:tenderId', authorizeRole(['bidder']), async (req, res) => {
    try {
        const tender = await Tender.findTenderById(req.params.tenderId);
        if (!tender || new Date() >= new Date(tender.closing_date)) return res.status(403).send('Bid not allowed');
        const amount = req.body.amount;
        if (!amount || amount <= 0) {
            return res.status(403).send('Bid amount invalid');
        }
        const bid = await Bid.createBid({ amount: amount, user_id: req.user.id, tender_id: req.params.tenderId });
        res.status(201).json(bid);
    } catch (err) {
        console.error('Create bid error:', err.message);
        res.status(500).json({error: 'Failed to create bid'});
    }
});

// Get bids by user
router.get('/user/:userId', async (req, res) => {
    try {
        const bids = await Bid.findBidsByUser(req.params.userId);
        res.json(bids);
    } catch (err) {
        console.error('Fetch bids by user error:', err.message);
        res.status(500).json({error: 'Failed to fetch bids'});
    }
});

// Get bids by tender
router.get('/tender/:tenderId', async (req, res) => {
    try {
        const bids = await Bid.findBidsByTender(req.params.tenderId);
        res.json(bids);
    } catch (err) {
        console.error('Fetch bids by tender error:', err.message);
        res.status(500).json({error: 'Failed to fetch bids'});
    }
});

export default router;
