import express from 'express'
import authenticateToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { Bid, Tender } from '../models/index.js';

const router = express.Router();
router.use(authenticateToken, authorizeRole(['bidder']));

router.post('/tender/:tenderId', async (req, res) => {
    try {
        const tender = await Tender.findTenderById(req.params.tenderId);
        if (!tender || new Date() >= tender.closing_date) return res.status(403).send('Bid not allowed');
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

export default router;
