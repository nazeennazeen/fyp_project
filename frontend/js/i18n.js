// js/i18n.js
// Translations: English (en), Kurdish Sorani (ku), Arabic (ar)

const TRANSLATIONS = {
  en: {
    dir: 'ltr',
    nav_home: 'Home',
    nav_tours: 'Tours',
    nav_bookings: 'My Bookings',
    nav_admin: 'Admin',
    hero_badge: 'Trusted by 10,000+ Travellers',
    hero_title_1: 'Discover Your Next',
    hero_title_2: 'Adventure',
    hero_sub: 'Explore breathtaking destinations around the world. From hidden gems to iconic landmarks — your perfect journey starts here.',
    hero_search_placeholder: 'Search destinations, tours…',
    hero_search_btn: 'Search',
    stat_tours: 'Tours',
    stat_destinations: 'Destinations',
    stat_travellers: 'Happy Travellers',
    featured_label: 'CURATED FOR YOU',
    featured_title: 'Featured Tours',
    featured_sub: 'Handpicked experiences loved by travellers worldwide',
    view_all: 'View All Tours',
    why_label: 'WHY CHOOSE US',
    why_title: 'Why WanderVista?',
    why_sub: 'We make travel simple, safe, and unforgettable',
    feat_safe_title: 'Safe & Secure',
    feat_safe_text: 'Your personal data and booking information is kept completely private and secure.',
    feat_price_title: 'Best Prices',
    feat_price_text: 'We guarantee the best prices for all our tours. No hidden fees or surprises.',
    feat_guide_title: 'Expert Guides',
    feat_guide_text: 'All our tours are led by certified local guides with deep knowledge of each destination.',
    feat_support_title: '24/7 Support',
    feat_support_text: 'Our support team is available around the clock to help with anything you need.',
    footer_tagline: 'We create extraordinary travel experiences that inspire, connect, and transform.',
    footer_quick: 'Quick Links',
    footer_contact: 'Contact',
    footer_email: 'hello@wandervista.com',
    footer_phone: '+964 750 000 0000',
    footer_hours: 'Mon–Fri, 9am–6pm',
    footer_copy: '© 2025 WanderVista. All rights reserved.',
    // Tours page
    page_tours_title: 'Explore All Tours',
    page_tours_sub: 'Find the perfect adventure from our collection of handpicked tours',
    search_placeholder: 'Search by name or location…',
    btn_search: 'Search',
    btn_clear: 'Clear',
    showing: 'Showing',
    tour_for: 'for',
    tours_word: 'tour',
    tours_word_pl: 'tours',
    view_details: 'View Details',
    duration_label: 'Duration',
    seats_label: 'seats left',
    no_tours: 'No Tours Found',
    no_tours_sub: 'Try a different search term or browse all tours.',
    server_error: 'Could not load tours. Make sure the server is running.',
    // Tour detail
    about_tour: 'About This Tour',
    location_label: 'Location',
    price_label: 'Price / Person',
    duration_lbl: 'Duration',
    seats_lbl: 'Available Seats',
    book_title: 'Book This Tour',
    field_name: 'Full Name',
    field_email: 'Email Address',
    field_phone: 'Phone Number',
    field_people: 'Number of People',
    field_date: 'Preferred Date',
    price_per: 'Price per person',
    total: 'Total',
    btn_book: 'Book Now',
    booking_confirmed: 'Booking Confirmed!',
    booking_ref_msg: 'Your booking reference is:',
    booking_save_msg: 'Save this reference. Use it on the',
    booking_save_link: 'My Bookings',
    booking_save_end: 'page to look up your reservation.',
    total_charged: 'Total charged:',
    err_fill: 'Please fill in all required fields.',
    err_people: 'Please enter at least 1 person.',
    err_server: 'Could not connect to the server. Please try again.',
    // My Bookings
    find_booking: 'Find Your Booking',
    find_sub: 'Enter the email you used when booking and your booking reference number.',
    field_ref: 'Booking Reference',
    btn_find: 'Find My Booking',
    btn_search_again: 'Search Another Booking',
    result_ref: 'Booking Reference',
    result_name: 'Name',
    result_email: 'Email',
    result_phone: 'Phone',
    result_people: 'Number of People',
    result_date: 'Booking Date',
    result_total: 'Total Price',
    person_s: 'person(s)',
    no_booking: 'No booking found.',
    err_both: 'Please enter both your email and booking reference.',
    searching: 'Searching…',
  },

  ku: {
    dir: 'rtl',
    nav_home: 'سەرەتا',
    nav_tours: 'گەشتەکان',
    nav_bookings: 'حجزەکانم',
    nav_admin: 'بەڕێوەبردن',
    hero_badge: 'بڕوادەرى +١٠٬٠٠٠ گەشتیار',
    hero_title_1: 'کەشف بکە',
    hero_title_2: 'ئەڤینی داهاتووت',
    hero_sub: 'شوێنە جوانەکانی دنیا بگەڕێ. لە شوێنە نهێنییەکانەوە تا شوێنە ناسراوەکان — گەشتی تەواوی تۆ لێرە دەستپێدەکات.',
    hero_search_placeholder: 'گەڕان بکە بۆ شوێن یان گەشت…',
    hero_search_btn: 'گەڕان',
    stat_tours: 'گەشت',
    stat_destinations: 'شوێن',
    stat_travellers: 'گەشتیارى خۆشحاڵ',
    featured_label: 'دیاریکراو بۆ تۆ',
    featured_title: 'گەشتە دیاریکراوەکان',
    featured_sub: 'ئەزموونەکانی دیاریکراو کە گەشتیارانی جیهان خۆشیان لێ بینیوە',
    view_all: 'هەموو گەشتەکان ببینە',
    why_label: 'بۆچی ئێمە',
    why_title: 'بۆچی ئێمە هەڵبژێری؟',
    why_sub: 'گەشت ئاسان، سەلامەت و جوان دەکەین',
    feat_safe_title: 'سەلامەت',
    feat_safe_text: 'زانیارییەکانی کەسی و حجزەکەت بە تەواوی پارێزراوە.',
    feat_price_title: 'باشترین نرخ',
    feat_price_text: 'باشترین نرخ بۆ هەموو گەشتەکانمان دەبەزێنین. هیچ کرێی شاراوە نییە.',
    feat_guide_title: 'ڕێبەری پسپۆڕ',
    feat_guide_text: 'هەموو گەشتەکانمان بە ڕێبەری ناوخۆی پشکنیوی ئەنجامدەدرێن.',
    feat_support_title: 'پشتیوانی ٢٤/٧',
    feat_support_text: 'تیمی پشتیوانیمان هەموو کات ئامادەیە بۆ یارمەتیت.',
    footer_tagline: 'ئەزموونی گەشتی نایابمان دروست دەکەین کە هاندەدات، پەیوەند دەکات و دەگۆڕت.',
    footer_quick: 'بەستەرە خێراکان',
    footer_contact: 'پەیوەندی',
    footer_email: 'hello@wandervista.com',
    footer_phone: '+٩٦٤ ٧٥٠ ٠٠٠ ٠٠٠٠',
    footer_hours: 'دووشەممە–هەینی، ٩ص تا ٦ی پاشنیوەڕۆ',
    footer_copy: '© ٢٠٢٥ WanderVista. هەموو مافەکان پارێزراون.',
    page_tours_title: 'هەموو گەشتەکان',
    page_tours_sub: 'گەشتی تەواوی خۆت لە کۆکراوەی گەشتەکانمان بدۆزەرەوە',
    search_placeholder: 'گەڕان بکە بە ناو یان شوێن…',
    btn_search: 'گەڕان',
    btn_clear: 'سڕینەوە',
    showing: 'نیشاندانی',
    tour_for: 'بۆ',
    tours_word: 'گەشت',
    tours_word_pl: 'گەشت',
    view_details: 'وردەکارییەکان',
    duration_label: 'ماوە',
    seats_label: 'کورسی ماوە',
    no_tours: 'هیچ گەشتێک نەدۆزرایەوە',
    no_tours_sub: 'گەڕانێکی تر تاقی بکەرەوە یان هەموو گەشتەکان ببینە.',
    server_error: 'نەتوانرا گەشتەکان بار بکرێن. دڵنیا بە کە سێرڤەر کاردەکات.',
    about_tour: 'دەربارەی ئەم گەشتە',
    location_label: 'شوێن',
    price_label: 'نرخ / کەس',
    duration_lbl: 'ماوە',
    seats_lbl: 'کورسی بەردەست',
    book_title: 'ئەم گەشتە حجز بکە',
    field_name: 'ناوی تەواو',
    field_email: 'ئیمەیل',
    field_phone: 'ژمارەی مۆبایل',
    field_people: 'ژمارەی کەس',
    field_date: 'بەرواری خواستراو',
    price_per: 'نرخ بۆ هەر کەسێک',
    total: 'کۆی گشتی',
    btn_book: 'حجز بکە',
    booking_confirmed: 'حجزەکەت دڵنیا کرایەوە!',
    booking_ref_msg: 'ژمارەی ئیشارەی حجزەکەت:',
    booking_save_msg: 'ئەم ژمارەیە بپارێزە. لە',
    booking_save_link: 'حجزەکانم',
    booking_save_end: 'بەکارببەرەوە بۆ دۆزینەوەی حجزەکەت.',
    total_charged: 'کۆی گشتی پارەدراو:',
    err_fill: 'تکایە هەموو خانەکانی پێویست پڕ بکەرەوە.',
    err_people: 'تکایە لانیکەم ١ کەس دابنێ.',
    err_server: 'نەتوانرا پەیوەندی بە سێرڤەر بکرێت. دووبارە تاقی بکەرەوە.',
    find_booking: 'حجزەکەت بدۆزەرەوە',
    find_sub: 'ئیمەیلی بەکارهێنراو لە کاتی حجز و ژمارەی ئیشارەی حجزەکەت بنووسە.',
    field_ref: 'ژمارەی ئیشارەی حجز',
    btn_find: 'حجزەکەم بدۆزەرەوە',
    btn_search_again: 'گەڕانی حجزی تر',
    result_ref: 'ژمارەی ئیشارەی حجز',
    result_name: 'ناو',
    result_email: 'ئیمەیل',
    result_phone: 'مۆبایل',
    result_people: 'ژمارەی کەس',
    result_date: 'بەرواری حجز',
    result_total: 'نرخی گشتی',
    person_s: 'کەس',
    no_booking: 'هیچ حجزێک نەدۆزرایەوە.',
    err_both: 'تکایە هەم ئیمەیل و هەم ژمارەی ئیشارە بنووسە.',
    searching: 'گەڕان…',
  },

  ar: {
    dir: 'rtl',
    nav_home: 'الرئيسية',
    nav_tours: 'الجولات',
    nav_bookings: 'حجوزاتي',
    nav_admin: 'الإدارة',
    hero_badge: 'موثوق به من أكثر من ١٠,٠٠٠ مسافر',
    hero_title_1: 'اكتشف مغامرتك',
    hero_title_2: 'القادمة',
    hero_sub: 'استكشف وجهات خلابة حول العالم. من الكنوز الخفية إلى المعالم الشهيرة — رحلتك المثالية تبدأ هنا.',
    hero_search_placeholder: 'ابحث عن وجهات أو جولات…',
    hero_search_btn: 'بحث',
    stat_tours: 'جولة',
    stat_destinations: 'وجهة',
    stat_travellers: 'مسافر سعيد',
    featured_label: 'مختارة لك',
    featured_title: 'الجولات المميزة',
    featured_sub: 'تجارب مختارة بعناية يحبها المسافرون حول العالم',
    view_all: 'عرض جميع الجولات',
    why_label: 'لماذا نحن',
    why_title: 'لماذا تختار WanderVista؟',
    why_sub: 'نجعل السفر بسيطاً وآمناً ولا يُنسى',
    feat_safe_title: 'آمن وموثوق',
    feat_safe_text: 'بياناتك الشخصية ومعلومات حجزك محمية تمامًا وبشكل كامل.',
    feat_price_title: 'أفضل الأسعار',
    feat_price_text: 'نضمن أفضل الأسعار لجميع جولاتنا. لا رسوم خفية أو مفاجآت.',
    feat_guide_title: 'مرشدون خبراء',
    feat_guide_text: 'جميع جولاتنا يقودها مرشدون محليون معتمدون بمعرفة عميقة بكل وجهة.',
    feat_support_title: 'دعم ٢٤/٧',
    feat_support_text: 'فريق الدعم لدينا متاح على مدار الساعة لمساعدتك في أي وقت.',
    footer_tagline: 'نخلق تجارب سفر استثنائية تلهم وتربط وتحوّل حياتك.',
    footer_quick: 'روابط سريعة',
    footer_contact: 'تواصل معنا',
    footer_email: 'hello@wandervista.com',
    footer_phone: '+٩٦٤ ٧٥٠ ٠٠٠ ٠٠٠٠',
    footer_hours: 'الاثنين–الجمعة، ٩ص–٦م',
    footer_copy: '© ٢٠٢٥ WanderVista. جميع الحقوق محفوظة.',
    page_tours_title: 'استكشف جميع الجولات',
    page_tours_sub: 'ابحث عن المغامرة المثالية من مجموعتنا المختارة من الجولات',
    search_placeholder: 'ابحث بالاسم أو الموقع…',
    btn_search: 'بحث',
    btn_clear: 'مسح',
    showing: 'عرض',
    tour_for: 'لـ',
    tours_word: 'جولة',
    tours_word_pl: 'جولات',
    view_details: 'عرض التفاصيل',
    duration_label: 'المدة',
    seats_label: 'مقعد متاح',
    no_tours: 'لم يتم العثور على جولات',
    no_tours_sub: 'جرّب مصطلح بحث مختلف أو تصفح جميع الجولات.',
    server_error: 'تعذّر تحميل الجولات. تأكد من تشغيل الخادم.',
    about_tour: 'عن هذه الجولة',
    location_label: 'الموقع',
    price_label: 'السعر / شخص',
    duration_lbl: 'المدة',
    seats_lbl: 'المقاعد المتاحة',
    book_title: 'احجز هذه الجولة',
    field_name: 'الاسم الكامل',
    field_email: 'البريد الإلكتروني',
    field_phone: 'رقم الهاتف',
    field_people: 'عدد الأشخاص',
    field_date: 'التاريخ المفضل',
    price_per: 'السعر للشخص',
    total: 'الإجمالي',
    btn_book: 'احجز الآن',
    booking_confirmed: 'تم تأكيد الحجز!',
    booking_ref_msg: 'رقم مرجع حجزك:',
    booking_save_msg: 'احفظ هذا الرقم. استخدمه في صفحة',
    booking_save_link: 'حجوزاتي',
    booking_save_end: 'للبحث عن حجزك.',
    total_charged: 'إجمالي المبلغ المدفوع:',
    err_fill: 'يرجى ملء جميع الحقول المطلوبة.',
    err_people: 'يرجى إدخال شخص واحد على الأقل.',
    err_server: 'تعذّر الاتصال بالخادم. يرجى المحاولة مرة أخرى.',
    find_booking: 'ابحث عن حجزك',
    find_sub: 'أدخل البريد الإلكتروني الذي استخدمته عند الحجز ورقم المرجع.',
    field_ref: 'رقم مرجع الحجز',
    btn_find: 'ابحث عن حجزي',
    btn_search_again: 'البحث عن حجز آخر',
    result_ref: 'رقم مرجع الحجز',
    result_name: 'الاسم',
    result_email: 'البريد الإلكتروني',
    result_phone: 'الهاتف',
    result_people: 'عدد الأشخاص',
    result_date: 'تاريخ الحجز',
    result_total: 'السعر الإجمالي',
    person_s: 'شخص',
    no_booking: 'لم يتم العثور على حجز.',
    err_both: 'يرجى إدخال البريد الإلكتروني ورقم المرجع معًا.',
    searching: 'جارٍ البحث…',
  }
};

// Current language
let currentLang = localStorage.getItem('lang') || 'en';

function applyLang(lang) {
  const t = TRANSLATIONS[lang];
  if (!t) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);

  // Set direction
  document.documentElement.setAttribute('dir', t.dir);
  document.documentElement.setAttribute('lang', lang);

  // Translate all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        el.placeholder = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Update active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Add Cairo font for RTL
  if (t.dir === 'rtl' && !document.getElementById('cairo-font')) {
    const link = document.createElement('link');
    link.id = 'cairo-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(link);
  }
}

function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
  applyLang(currentLang);
}

// Expose globally
window.t = (key) => (TRANSLATIONS[currentLang] || TRANSLATIONS.en)[key] || key;
window.currentLang = () => currentLang;
