// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBftANZjTsEOoGmHaDwJb9JwXhHQK8j6KY",
  authDomain: "mechanic-db779.firebaseapp.com",
  projectId: "mechanic-db779",
  storageBucket: "mechanic-db779.firebasestorage.app",
  messagingSenderId: "98926639697",
  appId: "1:98926639697:web:1b1a380fccfb411871d670",
  measurementId: "G-C1REMEN7SD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Authentication state
let isLoggedIn = false;
let currentUser = null;

// Check auth state
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // User is signed in.
    isLoggedIn = true;
    const userProfile = await db.collection('users').doc(user.uid).get();
    if (userProfile.exists) {
      currentUser = {
        uid: user.uid,
        email: user.email,
        ...userProfile.data()
      };
    } else {
        currentUser = {
            uid: user.uid,
            email: user.email,
            name: user.email.split('@')[0] || 'User'
        }
    }
  } else {
    // User is signed out.
    isLoggedIn = false;
    currentUser = null;
  }
  updateAuthUI();
});

// Sample listings data
const listings = [
    { id: 1, title: 'Premium Brake Pads Set', price: 25000, location: 'Lagos', views: 156, image: '🔧', brand: 'bosch' },
    { id: 2, title: 'Engine Oil Filter', price: 8500, location: 'Abuja', views: 89, image: '🛢️', brand: 'mann' },
    { id: 3, title: 'Spark Plugs Set', price: 15000, location: 'Lagos', views: 203, image: '⚡', brand: 'ngk' },
    { id: 4, title: 'Car Battery', price: 45000, location: 'Kano', views: 124, image: '🔋', brand: 'exide' },
    { id: 5, title: 'Tire Set (4pcs)', price: 120000, location: 'Ibadan', views: 78, image: '🛞', brand: 'michelin' },
    { id: 6, title: 'Radiator', price: 35000, location: 'Lagos', views: 92, image: '🌡️', brand: 'denso' },
    { id: 7, title: 'Air Filter', price: 8000, location: 'Abuja', views: 67, image: '🌪️', brand: 'bosch' },
    { id: 8, title: 'Alternator', price: 55000, location: 'Lagos', views: 134, image: '⚡', brand: 'bosch' },
    { id: 9, title: 'Shock Absorbers', price: 28000, location: 'Kano', views: 98, image: '🏎️', brand: 'monroe' },
    { id: 10, title: 'Fuel Pump', price: 32000, location: 'Ibadan', views: 112, image: '⛽', brand: 'bosch' }
];

// Sample mechanics data
const mechanics = [
    { id: 1, name: 'Ahmed Ibrahim', specialization: 'engine', location: 'Lagos', experience: '12 Years', rating: 4.9, reviews: 127, price: 5000, image: '👨‍🔧', services: ['Engine Repair', 'Oil Change', 'Diagnostics', 'Tune-up'] },
    { id: 2, name: 'John Okafor', specialization: 'brake', location: 'Abuja', experience: '8 Years', rating: 4.8, reviews: 89, price: 4500, image: '🔧', services: ['Brake Repair', 'Brake Pads', 'Brake Fluid', 'ABS System'] },
    { id: 3, name: 'Sarah Adebayo', specialization: 'electrical', location: 'Lagos', experience: '15 Years', rating: 4.9, reviews: 203, price: 6000, image: '⚡', services: ['Electrical Repair', 'Wiring', 'Battery', 'Alternator'] },
    { id: 4, name: 'Michael Eze', specialization: 'transmission', location: 'Kano', experience: '10 Years', rating: 4.7, reviews: 124, price: 5500, image: '⚙️', services: ['Transmission Repair', 'Clutch', 'Gearbox', 'Fluid Change'] },
    { id: 5, name: 'Grace Okonkwo', specialization: 'ac', location: 'Ibadan', experience: '6 Years', rating: 4.6, reviews: 78, price: 4000, image: '❄️', services: ['AC Repair', 'Refrigerant', 'Compressor', 'Cooling System'] },
    { id: 6, name: 'David Adamu', specialization: 'general', location: 'Lagos', experience: '20 Years', rating: 4.8, reviews: 156, price: 4500, image: '🔧', services: ['General Repair', 'Maintenance', 'Inspection', 'Tune-up'] },
    { id: 7, name: 'Fatima Yusuf', specialization: 'engine', location: 'Abuja', experience: '9 Years', rating: 4.7, reviews: 92, price: 5200, image: '🛠️', services: ['Engine Diagnostics', 'Repair', 'Overhaul', 'Performance'] },
    { id: 8, name: 'Peter Okwu', specialization: 'brake', location: 'Lagos', experience: '11 Years', rating: 4.9, reviews: 134, price: 4800, image: '🚗', services: ['Brake System', 'Safety Check', 'Disc Replacement', 'Hydraulics'] },
    { id: 9, name: 'Aisha Mohammed', specialization: 'electrical', location: 'Kano', experience: '7 Years', rating: 4.5, reviews: 98, price: 4200, image: '🔌', services: ['Auto Electrical', 'Lighting', 'Sensors', 'ECU'] },
    { id: 10, name: 'Emmanuel Obi', specialization: 'general', location: 'Ibadan', experience: '14 Years', rating: 4.8, reviews: 112, price: 4700, image: '👨‍🔧', services: ['Full Service', 'Maintenance', 'Repairs', 'Diagnostics'] }
];

let currentPage = 1;
let filteredListings = [...listings];
let currentMechanicPage = 1;
let filteredMechanics = [...mechanics];

// Navigation
function showPage(pageId, options = {}) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageId).classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
    });

    document.querySelectorAll(`[onclick="showPage('${pageId}')"]`).forEach(link => {
        link.classList.add('active');
    });

    // Load listings if showing listings page
    if (pageId === 'listings' && !options.skipLoad) {
        loadListings();
    }

    // Load mechanics if showing mechanics page
    if (pageId === 'mechanics') {
        loadMechanics();
    }

    // Load vendors if showing vendors page
    if (pageId === 'vendors') {
        loadVendors();
    }

    // Handle sticky nav
    if (pageId === 'detail') {
        window.addEventListener('scroll', handleStickyPrice);
    } else {
        window.removeEventListener('scroll', handleStickyPrice);
        document.getElementById('sticky-price-bar').style.display = 'none';
    }
}

// Load listings from Firestore
async function loadListings() {
    try {
        const productsSnapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
        listings.length = 0; // Clear existing mock data
        productsSnapshot.forEach(doc => {
            const product = doc.data();
            listings.push({
                id: doc.id,
                title: product.name,
                price: product.price,
                location: product.location,
                views: product.views,
                image: product.image || '🔧',
                brand: product.brand,
                description: product.description
            });
        });

        filteredListings = [...listings];
        displayListings();
    } catch (error) {
        console.error('Error loading listings:', error);
        loadListingsFromMock();
    }
}

// Fallback function for mock data
function loadListingsFromMock() {
    const mockData = [
        { id: 1, title: 'Premium Brake Pads Set', price: 25000, location: 'Lagos', views: 156, image: '🔧', brand: 'bosch' },
        { id: 2, title: 'Engine Oil Filter', price: 8500, location: 'Abuja', views: 89, image: '🛢️', brand: 'mann' },
        { id: 3, title: 'Spark Plugs Set', price: 15000, location: 'Lagos', views: 203, image: '⚡', brand: 'ngk' },
        { id: 4, title: 'Car Battery', price: 45000, location: 'Kano', views: 124, image: '🔋', brand: 'exide' },
        { id: 5, title: 'Tire Set (4pcs)', price: 120000, location: 'Ibadan', views: 78, image: '🛞', brand: 'michelin' },
        { id: 6, title: 'Radiator', price: 35000, location: 'Lagos', views: 92, image: '🌡️', brand: 'denso' },
        { id: 7, title: 'Air Filter', price: 8000, location: 'Abuja', views: 67, image: '🌪️', brand: 'bosch' },
        { id: 8, title: 'Alternator', price: 55000, location: 'Lagos', views: 134, image: '⚡', brand: 'bosch' },
        { id: 9, title: 'Shock Absorbers', price: 28000, location: 'Kano', views: 98, image: '🏎️', brand: 'monroe' },
        { id: 10, title: 'Fuel Pump', price: 32000, location: 'Ibadan', views: 112, image: '⛽', brand: 'bosch' }
    ];

    listings.length = 0;
    listings.push(...mockData);
    filteredListings = [...listings];
    displayListings();
}

// Display listings in the grid
function displayListings() {
    const grid = document.getElementById('listings-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const itemsToShow = currentPage * 10;
    const itemsToDisplay = filteredListings.slice(0, itemsToShow);

    itemsToDisplay.forEach(listing => {
        const card = createListingCard(listing);
        grid.appendChild(card);
    });
}

function createListingCard(listing) {
    const card = document.createElement('div');
    card.className = 'listing-card';
    card.onclick = () => showListingDetail(listing);

    card.innerHTML = `
                <div class="listing-image" loading="lazy">
                    ${listing.image}
                    <div class="listing-views">${listing.views} views</div>
                </div>
                <div class="listing-info">
                    <div class="listing-title">${listing.title}</div>
                    <div class="listing-price">₦${listing.price.toLocaleString()}</div>
                    <div class="listing-location">📍 ${listing.location}</div>
                </div>
            `;

    return card;
}

async function showListingDetail(listing) {
    document.getElementById('detail-title').textContent = listing.title;
    document.getElementById('detail-price').textContent = `₦${listing.price.toLocaleString()}`;
    document.getElementById('main-image').textContent = listing.image;
    document.getElementById('sticky-title').textContent = listing.title;
    document.getElementById('sticky-price').textContent = `₦${listing.price.toLocaleString()}`;

    // Update inventory views
    if (listing.id) {
        try {
            const productRef = db.collection('products').doc(listing.id);
            await productRef.update({
                views: firebase.firestore.FieldValue.increment(1)
            });
        } catch (error) {
            console.error('Error updating views:', error);
        }
    }

    showPage('detail');
}

function loadMoreListings() {
    currentPage++;
    loadListings();
}

// Load mechanics from Firestore
async function loadMechanics() {
    try {
        const mechanicsSnapshot = await db.collection('users').where('role', '==', 'mechanic').where('price_per_hour', '>', 0).get();
        mechanics.length = 0; // Clear existing mock data
        mechanicsSnapshot.forEach(doc => {
            const mechanic = doc.data();
            mechanics.push({
                id: doc.id,
                name: mechanic.name,
                specialization: mechanic.specialization,
                location: mechanic.location,
                experience: mechanic.experience,
                rating: mechanic.rating,
                reviews: mechanic.reviews,
                price: mechanic.price_per_hour,
                image: mechanic.image || '👨‍🔧',
                services: mechanic.services || []
            });
        });

        filteredMechanics = [...mechanics];
        displayMechanics();
    } catch (error) {
        console.error('Error loading mechanics:', error);
    }
}

// The loadMechanicsFromMock function is no longer needed.

// Display mechanics in the grid
function displayMechanics() {
    const grid = document.getElementById('mechanics-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const itemsToShow = currentMechanicPage * 10;
    const itemsToDisplay = filteredMechanics.slice(0, itemsToShow);

    itemsToDisplay.forEach(mechanic => {
        const card = createMechanicCard(mechanic);
        grid.appendChild(card);
    });
}

function createMechanicCard(mechanic) {
    const card = document.createElement('div');
    card.className = 'listing-card';
    card.onclick = () => showMechanicDetail(mechanic);

    const stars = '⭐'.repeat(Math.floor(mechanic.rating));

    card.innerHTML = `
                <div class="listing-image" loading="lazy">
                    ${mechanic.image}
                    <div class="listing-views">${mechanic.reviews} reviews</div>
                </div>
                <div class="listing-info">
                    <div class="listing-title">${mechanic.name}</div>
                    <div class="listing-price">₦${mechanic.price.toLocaleString()}/hour</div>
                    <div style="color: #fbbf24; font-size: 0.9rem; margin: 0.3rem 0;">${stars} (${mechanic.rating})</div>
                    <div style="color: #b0b0b0; font-size: 0.9rem; margin-bottom: 0.3rem;">${mechanic.specialization.charAt(0).toUpperCase() + mechanic.specialization.slice(1)} • ${mechanic.experience}</div>
                    <div class="listing-location">📍 ${mechanic.location}</div>
                </div>
            `;

    return card;
}

function showMechanicDetail(mechanic) {
    document.getElementById('mechanic-detail-title').textContent = mechanic.name;
    document.getElementById('mechanic-detail-price').textContent = `₦${mechanic.price.toLocaleString()}/hour`;

    showPage('mechanic-detail');
}

function loadMoreMechanics() {
    currentMechanicPage++;
    loadMechanics();
}

function bookMechanic() {
    if (!isLoggedIn) {
        showLoginModal();
        return;
    }
    alert('Booking request sent! The mechanic will contact you shortly to confirm the appointment.');
}

// Filters
document.getElementById('brand-filter').addEventListener('change', applyFilters);
document.getElementById('location-filter').addEventListener('change', applyFilters);
document.getElementById('min-price').addEventListener('input', applyFilters);
document.getElementById('max-price').addEventListener('input', applyFilters);
document.getElementById('sort-by').addEventListener('change', applyFilters);

// Mechanic filters
document.getElementById('specialization-filter').addEventListener('change', applyMechanicFilters);
document.getElementById('mechanic-location-filter').addEventListener('change', applyMechanicFilters);
document.getElementById('experience-filter').addEventListener('change', applyMechanicFilters);
document.getElementById('rating-filter').addEventListener('change', applyMechanicFilters);
document.getElementById('mechanic-sort-by').addEventListener('change', applyMechanicFilters);

function applyFilters() {
    const brand = document.getElementById('brand-filter').value;
    const location = document.getElementById('location-filter').value;
    const minPrice = parseInt(document.getElementById('min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('max-price').value) || Infinity;
    const sortBy = document.getElementById('sort-by').value;

    filteredListings = listings.filter(listing => {
        return (!brand || listing.brand === brand) &&
            (!location || listing.location.toLowerCase() === location) &&
            (listing.price >= minPrice && listing.price <= maxPrice);
    });

    // Sort
    switch (sortBy) {
        case 'price-low':
            filteredListings.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredListings.sort((a, b) => b.price - a.price);
            break;
        case 'views':
            filteredListings.sort((a, b) => b.views - a.views);
            break;
        default:
            filteredListings.sort((a, b) => b.id - a.id);
    }

    currentPage = 1;
    displayListings();
}

function applyMechanicFilters() {
    const specialization = document.getElementById('specialization-filter').value;
    const location = document.getElementById('mechanic-location-filter').value;
    const experience = document.getElementById('experience-filter').value;
    const rating = parseInt(document.getElementById('rating-filter').value) || 0;
    const sortBy = document.getElementById('mechanic-sort-by').value;

    filteredMechanics = mechanics.filter(mechanic => {
        const experienceYears = parseInt(mechanic.experience);
        let experienceMatch = true;

        if (experience === '1-3') experienceMatch = experienceYears >= 1 && experienceYears <= 3;
        else if (experience === '4-7') experienceMatch = experienceYears >= 4 && experienceYears <= 7;
        else if (experience === '8-15') experienceMatch = experienceYears >= 8 && experienceYears <= 15;
        else if (experience === '15+') experienceMatch = experienceYears >= 15;

        return (!specialization || mechanic.specialization === specialization) &&
            (!location || mechanic.location.toLowerCase() === location) &&
            experienceMatch &&
            (mechanic.rating >= rating);
    });

    // Sort mechanics
    switch (sortBy) {
        case 'experience':
            filteredMechanics.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
            break;
        case 'reviews':
            filteredMechanics.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'price':
            filteredMechanics.sort((a, b) => a.price - b.price);
            break;
        default:
            filteredMechanics.sort((a, b) => b.rating - a.rating);
    }

    currentMechanicPage = 1;
    displayMechanics();
}

// Profile sections
function showProfileSection(sectionId) {
    document.querySelectorAll('.profile-section').forEach(section => {
        section.style.display = 'none';
    });

    document.getElementById(`profile-${sectionId}`).style.display = 'block';

    document.querySelectorAll('.profile-link').forEach(link => {
        link.classList.remove('active');
    });

    document.querySelector(`[onclick="showProfileSection('${sectionId}')"]`).classList.add('active');
}

// Cart and Order functions
async function addToCart() {
    if (!isLoggedIn) {
        showLoginModal();
        return;
    }

    const currentCount = parseInt(document.querySelector('.cart-count').textContent);
    document.querySelector('.cart-count').textContent = currentCount + 1;
    alert('Item added to cart!');
}

// Buy Now function
async function buyNow() {
    if (!isLoggedIn) {
        showLoginModal();
        return;
    }

    // Get current product details from the detail page
    const titleElement = document.getElementById('detail-title');
    const priceElement = document.getElementById('detail-price');

    if (!titleElement || !priceElement) {
        alert('Product information not found');
        return;
    }

    const productTitle = titleElement.textContent;
    const productPrice = priceElement.textContent.replace(/[₦,]/g, '');

    // Find the product in our listings array
    const product = listings.find(p => p.title === productTitle);

    if (!product) {
        alert('Product not found in inventory');
        return;
    }

    // Check inventory
    const stockLevel = await getInventoryLevel(product.id);
    if (stockLevel <= 0) {
        alert('Sorry, this item is out of stock');
        return;
    }

    const quantity = 1;
    const confirmPurchase = confirm(
        `Confirm purchase?\n\n` +
        `Product: ${productTitle}\n` +
        `Price: ${priceElement.textContent}\n` +
        `Quantity: ${quantity}\n` +
        `Stock Available: ${stockLevel}\n\n` +
        `Total: ${priceElement.textContent}`
    );

    if (confirmPurchase) {
        await createOrder(product.id, quantity);
    }
}

// Create order in Firestore
async function createOrder(productId, quantity = 1) {
    if (!isLoggedIn) {
        showLoginModal();
        return;
    }

    try {
        // Get product details
        const productRef = db.collection('products').doc(productId);
        const productDoc = await productRef.get();

        if (!productDoc.exists) {
            alert('Error: Product not found');
            return;
        }

        const product = productDoc.data();
        const totalPrice = product.price * quantity;

        // Create order
        const orderRef = await db.collection('orders').add({
            userId: currentUser.uid,
            productId: productId,
            quantity: quantity,
            totalPrice: totalPrice,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Update inventory
        await updateInventory(productId, -quantity);

        alert(`Order created successfully! Order ID: ${orderRef.id}`);
        return { id: orderRef.id };
    } catch (error) {
        console.error('Error creating order:', error);
        alert('An error occurred while creating the order');
    }
}

// Update inventory
async function updateInventory(productId, quantityChange) {
    try {
        const inventoryRef = db.collection('inventory').doc(productId);

        await db.runTransaction(async (transaction) => {
            const inventoryDoc = await transaction.get(inventoryRef);
            if (!inventoryDoc.exists) {
                transaction.set(inventoryRef, { stock_level: Math.max(0, quantityChange), updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
            } else {
                const newStockLevel = inventoryDoc.data().stock_level + quantityChange;
                transaction.update(inventoryRef, { stock_level: newStockLevel, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
        });
    } catch (error) {
        console.error('Error updating inventory:', error);
    }
}

// Get inventory level for a product
async function getInventoryLevel(productId) {
    try {
        const inventoryRef = db.collection('inventory').doc(productId);
        const inventoryDoc = await inventoryRef.get();

        if (!inventoryDoc.exists) {
            return 0;
        }

        return inventoryDoc.data().stock_level;
    } catch (error) {
        console.error('Error getting inventory level:', error);
        return 0;
    }
}

// Subscribe to inventory changes
function subscribeToInventoryChanges() {
    db.collection('inventory').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            console.log('Inventory change:', change.doc.data());
             if (document.getElementById('listings-grid')) {
                    loadListings();
                }
        });
    });
}

// Sticky price bar
function handleStickyPrice() {
    const detailInfo = document.querySelector('.detail-info');
    const stickyBar = document.getElementById('sticky-price-bar');

    if (detailInfo) {
        const rect = detailInfo.getBoundingClientRect();
        if (rect.bottom < 0) {
            stickyBar.style.display = 'block';
        } else {
            stickyBar.style.display = 'none';
        }
    }
}

// Hero slider
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

setInterval(nextSlide, 4000);

// Authentication functions
function checkAuthAndNavigate(page) {
    if (!isLoggedIn) {
        showLoginModal();
        return;
    }
    showPage(page);
}

function showLoginModal() {
    document.getElementById('login-modal').classList.add('active');
}

function showSignupModal() {
    document.getElementById('signup-modal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function switchToSignup() {
    closeModal('login-modal');
    showSignupModal();
}

function switchToLogin() {
    closeModal('signup-modal');
    showLoginModal();
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        const userProfile = await db.collection('users').doc(user.uid).get();

        isLoggedIn = true;
        currentUser = { uid: user.uid, email: user.email, ...userProfile.data() };
        updateAuthUI();

        alert('Login successful! Welcome to Mechanic Village.');
        closeModal('login-modal');
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const location = document.getElementById('signup-location').value;

    if (!name || !email || !phone || !password || !location) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        const role = document.getElementById('signup-role').value;

        const userProfile = {
            name: name,
            phone: phone,
            location: location,
            role: role
        };

        if (role === 'mechanic') {
            userProfile.specialization = '';
            userProfile.experience = '';
            userProfile.price_per_hour = 0;
            userProfile.rating = 0;
            userProfile.reviews = 0;
            userProfile.services = [];
        }

        // Add user profile to Firestore
        await db.collection('users').doc(user.uid).set(userProfile);

        // Manually update UI after signup
        isLoggedIn = true;
        currentUser = { uid: user.uid, email: user.email, ...userProfile };
        updateAuthUI();

        closeModal('signup-modal');
        alert('Account created successfully! Welcome to Mechanic Village.');
    } catch (error) {
        alert('Signup failed: ' + error.message);
    }
}

async function logout() {
    try {
        await auth.signOut();
        showPage('home');
        alert('You have been logged out successfully.');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function updateAuthUI() {
    const guestButtons = document.getElementById('auth-buttons-guest');
    const userButtons = document.getElementById('auth-buttons-user');
    const userName = document.getElementById('user-name');
    const mechanicProfileEditor = document.getElementById('mechanic-profile-editor');

    // Navigation elements
    const navListings = document.getElementById('nav-listings');
    const navProfile = document.getElementById('nav-profile');
    const mobileNavListings = document.getElementById('mobile-nav-listings');
    const mobileNavProfile = document.getElementById('mobile-nav-profile');
    const mobileNavCart = document.getElementById('mobile-nav-cart');

    if (isLoggedIn) {
        // Show user buttons, hide guest buttons
        guestButtons.style.display = 'none';
        userButtons.style.display = 'flex';
        userName.textContent = currentUser.name;

        // Show member-only navigation items
        navListings.style.display = 'block';
        document.getElementById('nav-mechanics').style.display = 'block';
        navProfile.style.display = 'block';
        mobileNavListings.style.display = 'block';
        document.getElementById('mobile-nav-mechanics').style.display = 'block';
        mobileNavProfile.style.display = 'block';
        mobileNavCart.style.display = 'block';

        if (currentUser.role === 'mechanic') {
            mechanicProfileEditor.style.display = 'block';
            document.getElementById('mechanic-specialization').value = currentUser.specialization || '';
            document.getElementById('mechanic-experience').value = currentUser.experience || '';
            document.getElementById('mechanic-price').value = currentUser.price_per_hour || '';
            document.getElementById('mechanic-services').value = (currentUser.services || []).join(', ');
        }

    } else {
        // Show guest buttons, hide user buttons
        guestButtons.style.display = 'flex';
        userButtons.style.display = 'none';

        // Hide member-only navigation items
        navListings.style.display = 'none';
        document.getElementById('nav-mechanics').style.display = 'none';
        navProfile.style.display = 'none';
        mobileNavListings.style.display = 'none';
        document.getElementById('mobile-nav-mechanics').style.display = 'none';
        mobileNavProfile.style.display = 'none';
        mobileNavCart.style.display = 'none';
    }
}

// Hero search functionality
document.querySelector('.hero-search-btn').addEventListener('click', function () {
    const searchTerm = document.querySelector('.hero-search-input').value;
    if (searchTerm) {
        // Filter listings by search term
        filteredListings = listings.filter(listing =>
            listing.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        currentPage = 1;
        showPage('listings', {
            skipLoad: true
        });
        displayListings();
    }
});

// Enter key support for hero search
document.querySelector('.hero-search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.querySelector('.hero-search-btn').click();
    }
});

// Form submissions
document.getElementById('mechanic-profile-editor').querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!isLoggedIn || currentUser.role !== 'mechanic') {
        return;
    }

    const specialization = document.getElementById('mechanic-specialization').value;
    const experience = document.getElementById('mechanic-experience').value;
    const price = parseInt(document.getElementById('mechanic-price').value);
    const services = document.getElementById('mechanic-services').value.split(',').map(s => s.trim());

    try {
        await db.collection('users').doc(currentUser.uid).update({
            specialization: specialization,
            experience: experience,
            price_per_hour: price,
            services: services
        });
        alert('Mechanic profile updated successfully!');
    } catch (error) {
        console.error('Error updating mechanic profile:', error);
        alert('An error occurred while updating your profile.');
    }
});

document.querySelector('.sell-form form').addEventListener('submit', function (e) {
    e.preventDefault();
    const vendorId = document.getElementById('vendor-select').value;
    const vendor = vendors.find(v => v.id == vendorId);
    vendor.products++;
    alert(`Product listed for ${vendor.name}! They now have ${vendor.products} products.`);
});

// Load featured products on home page
async function loadFeaturedProducts() {
    const homeGrid = document.getElementById('home-listings-grid');
    if (!homeGrid) return;

    try {
        const featuredProductsSnapshot = await db.collection('products').orderBy('views', 'desc').limit(10).get();
        homeGrid.innerHTML = '';

        featuredProductsSnapshot.forEach(doc => {
            const product = doc.data();
            const listing = {
                id: doc.id,
                title: product.name,
                price: product.price,
                location: product.location,
                views: product.views,
                image: product.image || '🔧',
                brand: product.brand,
                description: product.description
            };
            const card = createListingCard(listing);
            homeGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading featured products:', error);
        loadFeaturedProductsFromMock();
    }
}

// Fallback function for featured products
function loadFeaturedProductsFromMock() {
    const homeGrid = document.getElementById('home-listings-grid');
    if (!homeGrid) return;

    homeGrid.innerHTML = '';

    // Show first 10 products as featured
    const featuredProducts = listings.slice(0, 10);

    featuredProducts.forEach(listing => {
        const card = createListingCard(listing);
        homeGrid.appendChild(card);
    });
}

// AI Diagnosis functionality
function runAIDiagnosis() {
    const symptom = document.getElementById('diagnosis-input').value;
    const carMake = document.getElementById('car-make').value;
    const carYear = document.getElementById('car-year').value;

    if (!symptom.trim()) {
        alert('Please describe your car problem first.');
        return;
    }

    // Show loading state
    const btn = document.querySelector('.ai-diagnose-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '🔄 Analyzing...';
    btn.disabled = true;

    // Simulate AI processing
    setTimeout(() => {
        const diagnosis = generateDiagnosis(symptom, carMake, carYear);
        displayDiagnosisResults(diagnosis);

        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

function generateDiagnosis(symptom, carMake, carYear) {
    // Simple AI simulation based on keywords
    const symptomLower = symptom.toLowerCase();

    let diagnosis = {
        problem: '',
        parts: [],
        confidence: 75
    };

    if (symptomLower.includes('squeak') || symptomLower.includes('brake')) {
        diagnosis.problem = 'Worn brake pads causing metal-to-metal contact';
        diagnosis.parts = [
            { name: 'Premium Brake Pads Set', price: 25000 },
            { name: 'Brake Disc Rotors', price: 35000 }
        ];
        diagnosis.confidence = 85;
    } else if (symptomLower.includes('engine') || symptomLower.includes('start')) {
        diagnosis.problem = 'Engine starting issues - likely spark plugs or battery';
        diagnosis.parts = [
            { name: 'Spark Plugs Set', price: 15000 },
            { name: 'Car Battery', price: 45000 }
        ];
        diagnosis.confidence = 78;
    } else if (symptomLower.includes('oil') || symptomLower.includes('leak')) {
        diagnosis.problem = 'Oil system issue - filter or gasket replacement needed';
        diagnosis.parts = [
            { name: 'Engine Oil Filter', price: 8500 },
            { name: 'Oil Pan Gasket', price: 12000 }
        ];
        diagnosis.confidence = 82;
    } else if (symptomLower.includes('tire') || symptomLower.includes('wheel')) {
        diagnosis.problem = 'Tire or wheel alignment issues';
        diagnosis.parts = [
            { name: 'Tire Set (4pcs)', price: 120000 },
            { name: 'Wheel Alignment Kit', price: 25000 }
        ];
        diagnosis.confidence = 70;
    } else {
        diagnosis.problem = 'General maintenance required - multiple components may need attention';
        diagnosis.parts = [
            { name: 'Air Filter', price: 8000 },
            { name: 'Engine Oil Filter', price: 8500 },
            { name: 'Spark Plugs Set', price: 15000 }
        ];
        diagnosis.confidence = 65;
    }

    return diagnosis;
}

function displayDiagnosisResults(diagnosis) {
    const resultsDiv = document.getElementById('diagnosis-results');
    const problemDiv = document.getElementById('diagnosed-problem');
    const partsListDiv = document.getElementById('recommended-parts-list');
    const confidenceFill = document.getElementById('confidence-fill');
    const confidencePercentage = document.getElementById('confidence-percentage');

    // Add celebration animation to AI icon
    const aiIcon = document.querySelector('.ai-icon');
    aiIcon.classList.add('celebration');
    setTimeout(() => aiIcon.classList.remove('celebration'), 1000);

    // Update problem description
    problemDiv.textContent = diagnosis.problem;

    // Update parts list
    partsListDiv.innerHTML = '';
    diagnosis.parts.forEach(part => {
        const partDiv = document.createElement('div');
        partDiv.className = 'part-item';
        partDiv.innerHTML = `
                    <span class="part-name">${part.name}</span>
                    <span class="part-price">₦${part.price.toLocaleString()}</span>
                `;
        partDiv.onclick = () => {
            // Find the part in listings and show details
            const listing = listings.find(l => l.title === part.name);
            if (listing) {
                showListingDetail(listing);
            }
        };
        partsListDiv.appendChild(partDiv);
    });

    // Update confidence
    confidenceFill.style.width = diagnosis.confidence + '%';
    confidencePercentage.textContent = diagnosis.confidence + '%';

    // Show results
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Footer link functions
function openWhatsApp() {
    window.open('https://wa.me/12257884475?text=Hello%20Mechanic%20Village!%20I%20need%20help%20with...', '_blank', 'noopener,noreferrer');
}

function openEmail() {
    window.open('mailto:support@mechanicvillage.ng?subject=Support%20Request&body=Hello%20Mechanic%20Village%20Team,%0A%0AI%20need%20help%20with...', '_blank', 'noopener,noreferrer');
}

function openPhone() {
    window.open('tel:+2348006324264', '_blank', 'noopener,noreferrer');
}

function handleContactForm(event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you within 24 hours.');
}

// Chatbot functionality
let chatbotOpen = false;
let chatbotMessages = [];

function toggleChatbot() {
    const toggle = document.querySelector('.chatbot-toggle');
    const window = document.getElementById('chatbot-window');

    chatbotOpen = !chatbotOpen;

    if (chatbotOpen) {
        toggle.classList.add('active');
        toggle.textContent = '✕';
        window.classList.add('active');
    } else {
        toggle.classList.remove('active');
        toggle.textContent = '💬';
        window.classList.remove('active');
    }
}

function sendChatbotMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();

    if (!message) return;

    addChatbotMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Simulate bot response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateChatbotResponse(message);
        addChatbotMessage(response.text, 'bot', response.suggestions);
    }, 1500);
}

function sendSuggestion(suggestion) {
    document.getElementById('chatbot-input').value = suggestion;
    sendChatbotMessage();
}

function handleChatbotKeypress(event) {
    if (event.key === 'Enter') {
        sendChatbotMessage();
    }
}

function addChatbotMessage(text, sender, suggestions = []) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    messageDiv.textContent = text;

    if (suggestions && suggestions.length > 0) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'chatbot-suggestions';

        suggestions.forEach(suggestion => {
            const suggestionBtn = document.createElement('div');
            suggestionBtn.className = 'chatbot-suggestion';
            suggestionBtn.textContent = suggestion.text;
            suggestionBtn.onclick = () => {
                if (suggestion.action) {
                    suggestion.action();
                } else {
                    sendSuggestion(suggestion.text);
                }
            };
            suggestionsDiv.appendChild(suggestionBtn);
        });

        messageDiv.appendChild(suggestionsDiv);
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    document.getElementById('chatbot-typing').classList.add('active');
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    document.getElementById('chatbot-typing').classList.remove('active');
}

function generateChatbotResponse(message) {
    const messageLower = message.toLowerCase();

    // Parts search
    if (messageLower.includes('brake') || messageLower.includes('pad')) {
        return {
            text: "I found several brake pad options for you! Here are some popular choices:",
            suggestions: [
                { text: "View brake pads", action: () => { toggleChatbot(); showPage('listings'); } },
                { text: "Toyota brake pads", action: () => sendSuggestion("Show me Toyota brake pads") },
                { text: "Price range?", action: () => sendSuggestion("What's the price range for brake pads?") }
            ]
        };
    }

    // Mechanic search
    if (messageLower.includes('mechanic') || messageLower.includes('repair')) {
        return {
            text: "I can help you find qualified mechanics in your area! We have specialists for all types of repairs.",
            suggestions: [
                { text: "Find mechanics", action: () => { toggleChatbot(); checkAuthAndNavigate('mechanics'); } },
                { text: "Engine specialist", action: () => sendSuggestion("Find engine specialist near me") },
                { text: "Brake specialist", action: () => sendSuggestion("Find brake specialist near me") }
            ]
        };
    }

    // Selling
    if (messageLower.includes('sell') || messageLower.includes('list')) {
        return {
            text: "Great! Selling parts on Mechanic Village is easy. You can list your parts and reach thousands of buyers.",
            suggestions: [
                { text: "Start selling", action: () => { toggleChatbot(); checkAuthAndNavigate('sell'); } },
                { text: "Selling tips", action: () => sendSuggestion("What are some tips for selling parts?") },
                { text: "Pricing guide", action: () => sendSuggestion("How should I price my parts?") }
            ]
        };
    }

    // Pricing
    if (messageLower.includes('price') || messageLower.includes('cost')) {
        return {
            text: "Prices vary depending on the part and brand. Here are some typical ranges:\n• Brake pads: ₦15,000 - ₦35,000\n• Batteries: ₦25,000 - ₦65,000\n• Filters: ₦5,000 - ₦15,000",
            suggestions: [
                { text: "Browse all parts", action: () => { toggleChatbot(); checkAuthAndNavigate('listings'); } },
                { text: "Compare prices", action: () => sendSuggestion("How do I compare prices?") }
            ]
        };
    }

    // Help/Support
    if (messageLower.includes('help') || messageLower.includes('support') || messageLower.includes('problem')) {
        return {
            text: "I'm here to help! You can also contact our support team for more detailed assistance.",
            suggestions: [
                { text: "Contact support", action: () => { toggleChatbot(); showPage('contact-us'); } },
                { text: "Help center", action: () => { toggleChatbot(); showPage('help-center'); } },
                { text: "WhatsApp support", action: () => openWhatsApp() }
            ]
        };
    }

    // Account/Login
    if (messageLower.includes('account') || messageLower.includes('login') || messageLower.includes('sign')) {
        return {
            text: "You need an account to buy parts, find mechanics, and sell items. It's free and takes just a minute!",
            suggestions: [
                { text: "Create account", action: () => { toggleChatbot(); showSignupModal(); } },
                { text: "Login", action: () => { toggleChatbot(); showLoginModal(); } },
                { text: "Account benefits", action: () => sendSuggestion("What are the benefits of having an account?") }
            ]
        };
    }

    // AI Diagnosis
    if (messageLower.includes('diagnos') || messageLower.includes('problem') || messageLower.includes('noise') || messageLower.includes('issue')) {
        return {
            text: "Our AI diagnosis tool can help identify car problems! Just describe your symptoms and get instant recommendations.",
            suggestions: [
                { text: "Try AI diagnosis", action: () => { toggleChatbot(); showPage('home'); document.getElementById('diagnosis-input').focus(); } },
                { text: "Common problems", action: () => sendSuggestion("What are common car problems?") }
            ]
        };
    }

    // Default response
    return {
        text: "I can help you with finding parts, mechanics, selling items, or general questions about Mechanic Village. What would you like to know?",
        suggestions: [
            { text: "Find parts", action: () => { toggleChatbot(); checkAuthAndNavigate('listings'); } },
            { text: "Find mechanics", action: () => { toggleChatbot(); checkAuthAndNavigate('mechanics'); } },
            { text: "Sell parts", action: () => { toggleChatbot(); checkAuthAndNavigate('sell'); } },
            { text: "Get help", action: () => { toggleChatbot(); showPage('help-center'); } }
        ]
    };
}

// Sample vendors data
const vendors = [
    { id: 1, name: 'Adekunle Auto Parts', location: 'Lagos', products: 15, avatar: 'A' },
    { id: 2, name: 'Bisi Motors', location: 'Abuja', products: 25, avatar: 'B' },
    { id: 3, name: 'Chinedu Spare Parts', location: 'Kano', products: 10, avatar: 'C' },
    { id: 4, name: 'Danjuma Enterprises', location: 'Ibadan', products: 30, avatar: 'D' }
];

// Load vendors
function loadVendors() {
    const grid = document.getElementById('vendors-grid');
    if (!grid) return;

    grid.innerHTML = '';

    vendors.forEach(vendor => {
        const card = createVendorCard(vendor);
        grid.appendChild(card);
    });
}

function createVendorCard(vendor) {
    const card = document.createElement('div');
    card.className = 'vendor-card';

    card.innerHTML = `
        <div class="vendor-avatar">${vendor.avatar}</div>
        <div class="vendor-name">${vendor.name}</div>
        <div class="vendor-location">📍 ${vendor.location}</div>
        <div class="vendor-products">${vendor.products} products</div>
    `;

    return card;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof loadListings === 'function') {
        loadListings();
    } else {
        loadListingsFromMock();
    }
    if (typeof loadMechanics === 'function') {
        loadMechanics();
    } else {
        loadMechanicsFromMock();
    }
    if (typeof loadFeaturedProducts === 'function') {
        loadFeaturedProducts();
    } else {
        loadFeaturedProductsFromMock();
    }
    if (typeof subscribeToInventoryChanges === 'function') {
        subscribeToInventoryChanges();
    }
    loadVendors();
    populateVendorSelect();
});

// Populate vendor select dropdown
function populateVendorSelect() {
    const select = document.getElementById('vendor-select');
    if (!select) return;

    vendors.forEach(vendor => {
        const option = document.createElement('option');
        option.value = vendor.id;
        option.textContent = vendor.name;
        select.appendChild(option);
    });
}

// Message Modal
function showMessageModal() {
    if (!isLoggedIn) {
        showLoginModal();
        return;
    }
    document.getElementById('message-modal').classList.add('active');
}

function handleMessageSend(event) {
    event.preventDefault();
    const message = document.getElementById('message-text').value;
    if (message) {
        alert('Message sent successfully!');
        closeModal('message-modal');
        document.getElementById('message-text').value = '';
    }
}

// Mobile menu toggle
document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
    document.querySelector('.mobile-nav').classList.toggle('active');
});
