// Same JavaScript as before, with small enhancements for animation
function getDonations() { return JSON.parse(localStorage.getItem('donations')) || []; }
function saveDonations(d) { localStorage.setItem('donations', JSON.stringify(d)); }
function getUserRole() { return localStorage.getItem('role'); }
function setUser(e, r) { localStorage.setItem('email', e); localStorage.setItem('role', r); }
function logout() { localStorage.clear(); showPage('home'); }

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'dashboard') loadDonations();
}

function checkRoleAndRedirect(req) {
    const role = getUserRole();
    if (!role) { showPage('login'); return; }
    if (role !== req) { alert('Please login with correct role.'); return; }
    showPage(req === 'mess' ? 'donate' : 'dashboard');
}

document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    setUser(document.getElementById('email').value, document.getElementById('role').value);
    showPage(getUserRole() === 'mess' ? 'donate' : 'dashboard');
});

document.getElementById('donateForm').addEventListener('submit', e => {
    e.preventDefault();
    const donation = {
        id: Date.now(),
        messName: document.getElementById('messName').value,
        location: document.getElementById('location').value,
        foodType: document.getElementById('foodType').value,
        quantity: document.getElementById('quantity').value,
        timeFresh: document.getElementById('timeFresh').value,
        contact: document.getElementById('contact').value,
        status: 'available'
    };
    let donations = getDonations();
    donations.push(donation);
    saveDonations(donations);
    document.getElementById('donateForm').reset();
    document.getElementById('messConfirmation').style.display = 'block';
    setTimeout(() => document.getElementById('messConfirmation').style.display = 'none', 6000);
});

function loadDonations() {
    const donations = getDonations().filter(d => d.status === 'available');
    const list = document.getElementById('donationsList');
    list.innerHTML = donations.length === 0 ? '<p>No donations available right now. Check back soon!</p>' : '';
    donations.forEach(d => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${d.messName}</h3>
            <p><strong>Location:</strong> ${d.location}</p>
            <p><strong>Food:</strong> ${d.foodType}</p>
            <p><strong>Quantity:</strong> ${d.quantity}</p>
            <p><strong>Fresh for:</strong> ${d.timeFresh} hours</p>
            <p><strong>Contact:</strong> ${d.contact}</p>
            <button onclick="acceptDonation(${d.id})">Accept & Collect</button>
        `;
        list.appendChild(card);
    });
}

window.acceptDonation = function(id) {
    let donations = getDonations();
    const idx = donations.findIndex(d => d.id === id);
    if (idx !== -1) {
        donations[idx].status = 'accepted';
        saveDonations(donations);
        loadDonations();
        const conf = document.getElementById('ngoConfirmation');
        conf.style.display = 'block';
        setTimeout(() => conf.style.display = 'none', 8000);
    }
};

// Auto redirect if logged in
if (getUserRole()) showPage(getUserRole() === 'mess' ? 'donate' : 'dashboard');
