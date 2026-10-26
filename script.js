// Live Band & DJ Lineup Data
const lineupData = [
    {
        id: 1,
        day: 'fri',
        dayLabel: 'วันศุกร์ (FRI)',
        band: 'THE VELVET GROOVE',
        genre: 'Pop / Soul / R&B ฟังสบายช่วงหัวค่ำ',
        time: '19:30 - 21:15 น.',
        status: 'โต๊ะว่าง',
        isHot: false
    },
    {
        id: 2,
        day: 'fri',
        dayLabel: 'วันศุกร์ (FRI)',
        band: 'MIDNIGHT SYNDROME',
        genre: 'Thai Rock / 90s-2000s Hits ร้องตามได้ทุกเพลง',
        time: '21:45 - 23:45 น.',
        status: 'ยอดฮิตคืนศุกร์ 🔥',
        isHot: true
    },
    {
        id: 3,
        day: 'sat',
        dayLabel: 'วันเสาร์ (SAT)',
        band: 'CYANIDE & FRIENDS',
        genre: 'Indie Pop / Modern Rock จัดจ้านสนุกสุดเหวี่ยง',
        time: '20:00 - 22:00 น.',
        status: 'ใกล้เต็มเร็ว!',
        isHot: true
    },
    {
        id: 4,
        day: 'sat',
        dayLabel: 'วันเสาร์ (SAT)',
        band: 'DJ KRYPTON x MC ZACK',
        genre: 'EDM / Hip-Hop / Open Format Party Set',
        time: '22:30 - 01:30 น.',
        status: 'After Party 🔥',
        isHot: true
    },
    {
        id: 5,
        day: 'sun',
        dayLabel: 'วันอาทิตย์ (SUN)',
        band: 'SUNDAY ACOUSTIC SESSION',
        genre: 'Acoustic / Easy Listening ชิลรับวันอาทิตย์',
        time: '19:30 - 22:30 น.',
        status: 'โต๊ะว่าง',
        isHot: false
    },
    {
        id: 6,
        day: 'special',
        dayLabel: 'ศุกร์สิ้นเดือน ✨',
        band: 'SPECIAL GUEST: NEON CONCERT NIGHT',
        genre: 'มินิคอนเสิร์ตศิลปินรับเชิญพิเศษ เต็มโชว์ 90 นาที',
        time: '22:00 - 23:30 น.',
        status: 'เปิดจองโต๊ะแล้ว!',
        isHot: true
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Set default date in booking form to today
    const dateInput = document.getElementById('book-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.min = today;
    }

    // 1. Age Gate Logic
    const ageGate = document.getElementById('age-gate');
    const btnAgeYes = document.getElementById('btn-age-yes');
    const btnAgeNo = document.getElementById('btn-age-no');
    const ageWarning = document.getElementById('age-warning');

    if (sessionStorage.getItem('neon_age_verified') === 'true') {
        ageGate.classList.add('hidden');
    }

    btnAgeYes.addEventListener('click', () => {
        sessionStorage.setItem('neon_age_verified', 'true');
        ageGate.classList.add('hidden');
    });

    btnAgeNo.addEventListener('click', () => {
        ageWarning.classList.remove('hidden');
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });

    // 3. Render Lineup & Filter Tabs
    const lineupContainer = document.getElementById('lineup-list');
    const dayTabs = document.querySelectorAll('.day-tab');

    function renderLineup(filterDay = 'all') {
        const filtered = filterDay === 'all'
            ? lineupData
            : lineupData.filter(item => item.day === filterDay);

        lineupContainer.innerHTML = filtered.map(item => `
            <div class="lineup-card">
                <div class="lineup-top">
                    <span class="lineup-day-badge">${item.dayLabel}</span>
                    <span class="lineup-status ${item.isHot ? 'hot' : ''}">${item.status}</span>
                </div>
                <div>
                    <h3 class="lineup-band">${item.band}</h3>
                    <p class="lineup-genre">${item.genre}</p>
                </div>
                <div class="lineup-bottom">
                    <span class="lineup-time">🕒 ${item.time}</span>
                    <button class="btn-lineup-book" onclick="bookForBand('${item.band}', '${item.dayLabel}')">
                        จองโต๊ะดูวงนี้
                    </button>
                </div>
            </div>
        `).join('');
    }

    dayTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            dayTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderLineup(tab.dataset.day);
        });
    });

    renderLineup('all');

    // 4. Booking Modal Controls
    const bookingModal = document.getElementById('booking-modal');
    const openBookingBtn = document.getElementById('open-booking-btn');
    const footerBookingBtn = document.getElementById('footer-booking-btn');
    const closeBookingBtn = document.getElementById('close-booking-btn');
    const bookingForm = document.getElementById('booking-form');
    const bookingSuccess = document.getElementById('booking-success');
    const bookingSummaryText = document.getElementById('booking-summary-text');
    const resetBookingBtn = document.getElementById('reset-booking-btn');

    function openBookingModal() {
        bookingForm.classList.remove('hidden');
        bookingSuccess.classList.add('hidden');
        bookingModal.classList.remove('hidden');
    }

    function closeBookingModal() {
        bookingModal.classList.add('hidden');
    }

    openBookingBtn.addEventListener('click', openBookingModal);
    footerBookingBtn.addEventListener('click', openBookingModal);
    closeBookingBtn.addEventListener('click', closeBookingModal);
    resetBookingBtn.addEventListener('click', closeBookingModal);

    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeBookingModal();
        }
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('book-name').value;
        const phone = document.getElementById('book-phone').value;
        const date = document.getElementById('book-date').value;
        const guests = document.getElementById('book-guests').value;
        const zone = document.getElementById('book-zone').value;
        const promo = document.getElementById('book-promo').value;

        bookingSummaryText.innerHTML = `
            คุณ <strong>${name}</strong> (${phone})<br>
            วันที่: <strong>${date}</strong> | จำนวน: <strong>${guests}</strong><br>
            โซนที่เลือก: <strong>${zone}</strong>
            ${promo ? `<br>โค้ดโปรโมชั่น: <strong class="text-cyan">${promo}</strong>` : ''}
            <br><br><small class="text-muted">* ทีมงานจะติดต่อกลับเพื่อยืนยันเบอร์โต๊ะภายใน 15 นาทีครับ</small>
        `;

        bookingForm.classList.add('hidden');
        bookingSuccess.classList.remove('hidden');
    });
});

// Helper functions triggered from cards
window.claimPromo = function(code, promoTitle) {
    const bookingModal = document.getElementById('booking-modal');
    const promoInput = document.getElementById('book-promo');
    const noteInput = document.getElementById('book-note');
    const bookingForm = document.getElementById('booking-form');
    const bookingSuccess = document.getElementById('booking-success');

    bookingForm.classList.remove('hidden');
    bookingSuccess.classList.add('hidden');
    promoInput.value = code;
    noteInput.value = `ใช้สิทธิ์โปรโมชั่น: ${promoTitle}`;
    bookingModal.classList.remove('hidden');
};

window.selectZoneAndBook = function(zoneName) {
    const bookingModal = document.getElementById('booking-modal');
    const zoneSelect = document.getElementById('book-zone');
    const bookingForm = document.getElementById('booking-form');
    const bookingSuccess = document.getElementById('booking-success');

    bookingForm.classList.remove('hidden');
    bookingSuccess.classList.add('hidden');
    zoneSelect.value = zoneName;
    bookingModal.classList.remove('hidden');
};

window.bookForBand = function(bandName, dayLabel) {
    const bookingModal = document.getElementById('booking-modal');
    const noteInput = document.getElementById('book-note');
    const bookingForm = document.getElementById('booking-form');
    const bookingSuccess = document.getElementById('booking-success');

    bookingForm.classList.remove('hidden');
    bookingSuccess.classList.add('hidden');
    noteInput.value = `จองดูวง ${bandName} (${dayLabel})`;
    bookingModal.classList.remove('hidden');
};
