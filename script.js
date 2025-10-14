// Constants
const SUPABASE_URL = window.SUPABASE_URL || 'https://vsxjcsppyjwvxxopetky.supabase.co';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzeGpjc3BweWp3dnh4b3BldGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NzAzMzMsImV4cCI6MjA3NTI0NjMzM30.xbSUOX0M1PDDBbsZSDhBXbhHuUZkXulbqIKxu-oEQ4w';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Authentication state
let isLoggedIn = false;
let currentUser = null;

// Check auth state
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Auth error:', error);
    return;
  }
  isLoggedIn = !!data.session;
  currentUser = data.session?.user ?? null;
});

// Fetch posts
async function fetchPosts() {
  try {
    const { data, error } = await supabase.from('posts').select('id, title, content');
    if (error) throw error;
    setPosts(data);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}
/ Sample listings data
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
function showPage(pageId) {
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
    if (pageId === 'listings') {
        loadListings();
    }

    // Load mechanics if showing mechanics page
    if (pageId === 'mechanics') {
        loadMechanics();
    }

    // Handle sticky nav
    if (pageId === 'detail') {
        window.addEventListener('scroll', handleStickyPrice);
    } else {
        window.removeEventListener('scroll', handleStickyPrice);
        document.getElementById('sticky-price-bar').style.display = 'none';
    }
}

// Load listings from Supabase
async function loadListings() {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading products:', error);
            loadListingsFromMock();
            return;
        }

        // Convert Supabase data to match our existing format
        listings.length = 0; // Clear existing mock data
        products.forEach(product => {
            listings.push({
                id: product.id,
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
                <div class="listing-image">
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
    if (listing.id && typeof listing.id === 'string') {
        try {
            await supabase.rpc('increment_product_views', { product_uuid: listing.id });
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

// Load mechanics from Supabase
async function loadMechanics() {
    try {
        const { data: mechanicsData, error } = await supabase
            .from('mechanics')
            .select('*')
            .order('rating', { ascending: false });

        if (error) {
            console.error('Error loading mechanics:', error);
            loadMechanicsFromMock();
            return;
        }

        // Convert Supabase data to match our existing format
        mechanics.length = 0; // Clear existing mock data
        mechanicsData.forEach(mechanic => {
            mechanics.push({
                id: mechanic.id,
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
        loadMechanicsFromMock();
    }
}

// Fallback function for mock mechanics data
function loadMechanicsFromMock() {
    const mockMechanics = [
        { id: 1, name: 'Ahmed Ibrahim', specialization: 'engine', location: 'Lagos', experience: '12 Years', rating: 4.9, reviews: 127, price: 5000, image: '👨‍🔧', services: ['Engine Repair', 'Oil Change', 'Diagnostics', 'Tune-up'] },
        { id: 2, name: 'John Okafor', specialization: 'brake', location: 'Abuja', experience: '8 Years', rating: 4.8, reviews: 89, price: 4500, image: '🔧', services: ['Brake Repair', 'Brake Pads', 'Brake Fluid', 'ABS System'] },
        { id: 3, name: 'Sarah Adebayo', specialization: 'electrical', location: 'Lagos', experience: '15 Years', rating: 4.9, reviews: 203, price: 6000, image: '⚡', services: ['Electrical Repair', 'Wiring', 'Battery', 'Alternator'] },
        { id: 4, name: 'Michael Eze', specialization: 'transmission', location: 'Kano', experience: '10 Years', rating: 4.7, reviews: 124, price: 5500, image: '⚙️', services: ['Transmission Repair', 'Clutch', 'Gearbox', 'Fluid Change'] },
        { id: 5, name: 'Grace Okonkwo', specialization: 'ac', location: 'Ibadan', experience: '6 Years', rating: 4.6, reviews: 78, price: 4000, image: '❄️', services: ['AC Repair', 'Refrigerant', 'Compressor', 'Cooling System'] }
    ];
    
    mechanics.length = 0;
    mechanics.push(...mockMechanics);
    filteredMechanics = [...mechanics];
    displayMechanics();
}

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
                <div class="listing-image">
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
    loadListings();
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
    loadMechanics();
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
        const order = await createOrder(product.id, quantity);
        if (order) {
            // Update cart count
            const currentCount = parseInt(document.querySelector('.cart-count').textContent);
            document.querySelector('.cart-count').textContent = currentCount + 1;
        }
    }
}

// Create order in Supabase
async function createOrder(productId, quantity = 1) {
    if (!isLoggedIn) {
        showLoginModal();
        return;
    }

    try {
        // Get product details
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (productError) {
            alert('Error: Product not found');
            return;
        }

        const totalPrice = product.price * quantity;

        // Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: currentUser.id,
                product_id: productId,
                quantity: quantity,
                total_price: totalPrice,
                status: 'pending'
            })
            .select()
            .single();

        if (orderError) {
            alert('Error creating order: ' + orderError.message);
            return;
        }

        // Update inventory
        await updateInventory(productId, -quantity);

        alert(`Order created successfully! Order ID: ${order.id}`);
        return order;
    } catch (error) {
        console.error('Error creating order:', error);
        alert('An error occurred while creating the order');
    }
}

// Update inventory
async function updateInventory(productId, quantityChange) {
    try {
        // Get current inventory
        const { data: inventory, error: inventoryError } = await supabase
            .from('inventory')
            .select('*')
            .eq('product_id', productId)
            .single();

        if (inventoryError && inventoryError.code !== 'PGRST116') {
            console.error('Error fetching inventory:', inventoryError);
            return;
        }

        const newStockLevel = inventory ? inventory.stock_level + quantityChange : Math.max(0, quantityChange);

        if (inventory) {
            // Update existing inventory
            const { error: updateError } = await supabase
                .from('inventory')
                .update({ 
                    stock_level: newStockLevel,
                    updated_at: new Date().toISOString()
                })
                .eq('product_id', productId);

            if (updateError) {
                console.error('Error updating inventory:', updateError);
            }
        } else {
            // Create new inventory record
            const { error: insertError } = await supabase
                .from('inventory')
                .insert({
                    product_id: productId,
                    stock_level: newStockLevel
                });

            if (insertError) {
                console.error('Error creating inventory:', insertError);
            }
        }
    } catch (error) {
        console.error('Error updating inventory:', error);
    }
}

// Get inventory level for a product
async function getInventoryLevel(productId) {
    try {
        const { data: inventory, error } = await supabase
            .from('inventory')
            .select('stock_level')
            .eq('product_id', productId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching inventory:', error);
            return 0;
        }

        return inventory ? inventory.stock_level : 0;
    } catch (error) {
        console.error('Error getting inventory level:', error);
        return 0;
    }
}

// Subscribe to inventory changes
function subscribeToInventoryChanges() {
    const subscription = supabase
        .channel('inventory_changes')
        .on('postgres_changes', 
            { 
                event: '*', 
                schema: 'public', 
                table: 'inventory' 
            }, 
            (payload) => {
                console.log('Inventory change:', payload);
                // Refresh listings if needed
                if (document.getElementById('listings-grid')) {
                    loadListings();
                }
            }
        )
        .subscribe();

    return subscription;
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
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert('Login failed: ' + error.message);
            return;
        }

        if (data.user) {
            // Get user profile from our users table
            const { data: userProfile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profileError) {
                console.error('Error fetching user profile:', profileError);
            }

            isLoggedIn = true;
            currentUser = {
                id: data.user.id,
                email: data.user.email,
                name: userProfile?.name || email.split('@')[0] || 'User',
                role: userProfile?.role || 'customer',
                phone: userProfile?.phone,
                location: userProfile?.location
            };

            updateAuthUI();
            closeModal('login-modal');
            alert('Login successful! Welcome to Mechanic Village.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
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
        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    phone: phone,
                    location: location
                }
            }
        });

        if (authError) {
            alert('Signup failed: ' + authError.message);
            return;
        }

        if (authData.user) {
            // Update the user profile in our users table
            const { error: profileError } = await supabase
                .from('users')
                .update({
                    name: name,
                    phone: phone,
                    location: location,
                    role: 'customer'
                })
                .eq('id', authData.user.id);

            if (profileError) {
                console.error('Error updating user profile:', profileError);
            }

            isLoggedIn = true;
            currentUser = {
                id: authData.user.id,
                name: name,
                email: email,
                phone: phone,
                location: location,
                role: 'customer'
            };

            updateAuthUI();
            closeModal('signup-modal');
            alert('Account created successfully! Welcome to Mechanic Village.');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred during signup. Please try again.');
    }
}

async function logout() {
    try {
        await supabase.auth.signOut();
        isLoggedIn = false;
        currentUser = null;
        updateAuthUI();
        showPage('home');
        alert('You have been logged out successfully.');
    } catch (error) {
        console.error('Logout error:', error);
        // Still logout locally even if server logout fails
        isLoggedIn = false;
        currentUser = null;
        updateAuthUI();
        showPage('home');
        alert('You have been logged out successfully.');
    }
}

function updateAuthUI() {
    const guestButtons = document.getElementById('auth-buttons-guest');
    const userButtons = document.getElementById('auth-buttons-user');
    const userName = document.getElementById('user-name');

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
        showPage('listings');
        loadListings();
    }
});

// Enter key support for hero search
document.querySelector('.hero-search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.querySelector('.hero-search-btn').click();
    }
});

// Form submissions
document.querySelector('.sell-form form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Listing submitted successfully! It will be reviewed and published shortly.');
});

// Load featured products on home page
async function loadFeaturedProducts() {
    const homeGrid = document.getElementById('home-listings-grid');
    if (!homeGrid) return;

    try {
        // Get featured products (most viewed or newest)
        const { data: featuredProducts, error } = await supabase
            .from('products')
            .select('*')
            .order('views', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error loading featured products:', error);
            loadFeaturedProductsFromMock();
            return;
        }

        homeGrid.innerHTML = '';
        
        featuredProducts.forEach(product => {
            const listing = {
                id: product.id,
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

// Initialize authentication state and load data
async function initializeApp() {
    try {
        // Check if user is already logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
            // Get user profile from our users table
            const { data: userProfile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (!profileError && userProfile) {
                isLoggedIn = true;
                currentUser = {
                    id: session.user.id,
                    email: session.user.email,
                    name: userProfile.name || session.user.email.split('@')[0] || 'User',
                    role: userProfile.role || 'customer',
                    phone: userProfile.phone,
                    location: userProfile.location
                };
                updateAuthUI();
            }
        }

        // Load data from Supabase
        await loadListings();
        await loadMechanics();
        await loadFeaturedProducts();

        // Subscribe to real-time changes
        subscribeToInventoryChanges();
    } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback to mock data if Supabase fails
        loadListingsFromMock();
        loadMechanicsFromMock();
        loadFeaturedProductsFromMock();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);


(function () { function c() { var b = a.contentDocument || a.contentWindow.document; if (b) { var d = b.createElement('script'); d.innerHTML = "window.__CF$cv$params={r:'98cb052a651d6f98',t:'MTc2MDE1MDcxNC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);"; b.getElementsByTagName('head')[0].appendChild(d) } } if (document.body) { var a = document.createElement('iframe'); a.height = 1; a.width = 1; a.style.position = 'absolute'; a.style.top = 0; a.style.left = 0; a.style.border = 'none'; a.style.visibility = 'hidden'; document.body.appendChild(a); if ('loading' !== document.readyState) c(); else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c); else { var e = document.onreadystatechange || function () { }; document.onreadystatechange = function (b) { e(b); 'loading' !== document.readyState && (document.onreadystatechange = e, c()) } } } })();

