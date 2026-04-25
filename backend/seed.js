import { User, Tender } from './src/models/index.js';

async function seed() {
    console.log('Seeding database...');
    
    try {
        // Create Admin
        const admin = await User.createUser({
            username: 'admin',
            password: 'password123',
            role: 'admin'
        });
        console.log('Admin user created:', admin.username);

        // Create Bidder
        const bidder = await User.createUser({
            username: 'bidder',
            password: 'password123',
            role: 'bidder'
        });
        console.log('Bidder user created:', bidder.username);

        // Create 3 Tenders
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);

        await Tender.createTender({
            title: 'Supply of Heavy Earth Moving Machinery (HEMM)',
            description: 'Procurement of 10 units of 100-ton dumpers for Ramagundam OC-I.',
            closing_date: nextWeek.toISOString(),
            opening_date: tomorrow.toISOString()
        });

        await Tender.createTender({
            title: 'Construction of New Office Building',
            description: 'Civil works for the new administrative block at Kothagudem corporate office.',
            closing_date: nextWeek.toISOString(),
            opening_date: tomorrow.toISOString()
        });

        await Tender.createTender({
            title: 'Annual Maintenance Contract for IT Infrastructure',
            description: 'Comprehensive AMC for servers, networking equipment, and end-user devices.',
            closing_date: nextWeek.toISOString(),
            opening_date: tomorrow.toISOString()
        });

        console.log('3 Tenders created successfully.');
        console.log('Seeding complete!');
    } catch (err) {
        console.error('Seeding failed:', err.message);
    }
}

seed();
