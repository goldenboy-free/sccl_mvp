import { User, Bid, Tender, Audit } from './models/index.js';

await User.createUserTable();
await Tender.createTenderTable();
await Audit.createAuditTable();
await Bid.createBidTable();
