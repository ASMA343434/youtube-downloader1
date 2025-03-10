document.addEventListener('DOMContentLoaded', function() {
    // Names arrays updated for 20 students
    const firstNames = ["محمد", "أحمد", "علي", "عمر", "يوسف", "خالد", "حسن", "إبراهيم", "عبدالله", "سعيد", 
                       "ياسر", "عادل", "كريم", "طارق", "فهد", "ماجد", "نادر", "رامي", "زياد", "هاني"];
    const lastNames = ["السيد", "محمود", "أحمد", "علي", "حسن", "إبراهيم", "العربي", "الشريف", "المصري", "السعيد",
                      "الحسيني", "العزيز", "الرفاعي", "النجار", "الصادق", "المنصور", "الحكيم", "العلوي", "الهاشمي", "النور"];
    const grades = ["الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"];
    const testimonials = [
        "استفدت كثيراً من أسلوب الشرح الممتع والمبسط",
        "تحسن مستواي كثيراً في فهم قواعد اللغة العربية",
        "أسلوب الأستاذ في الشرح جعل اللغة العربية سهلة وممتعة",
        "أصبحت أحب اللغة العربية بفضل طريقة الشرح المميزة",
        "ساعدني المعلم في تطوير مهاراتي في الكتابة والتعبير"
    ];

    const slider = document.getElementById('testimonialsSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pagination = document.getElementById('sliderPagination');
    let currentIndex = 0;
    const totalStudents = 20;
    let cards = [];
    
    // تحديد عدد الكروت المعروضة حسب حجم الشاشة
    const getSlidesToShow = () => {
        if (window.innerWidth >= 1200) return 4;
        if (window.innerWidth >= 768) return 3;
        return 2;
    };
    
    let slidesToShow = getSlidesToShow();

    // إنشاء كروت الطلاب
    for(let i = 0; i < totalStudents; i++) {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <div class="student-img">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.random()}" alt="طالب ${i + 1}">
            </div>
            <h3>${firstNames[i]} ${lastNames[i]}</h3>
            <p class="grade">الصف: ${grades[Math.floor(Math.random() * grades.length)]}</p>
            <p class="testimonial">"${testimonials[Math.floor(Math.random() * testimonials.length)]}"</p>
            <div class="rating">
                ${'<i class="fas fa-star"></i>'.repeat(5)}
            </div>
        `;
        cards.push(card);
    }

    // إنشاء نقاط التنقل
    for(let i = 0; i < Math.ceil(totalStudents / slidesToShow); i++) {
        const dot = document.createElement('span');
        dot.className = 'pagination-dot';
        dot.addEventListener('click', () => goToSlide(i * slidesToShow));
        pagination.appendChild(dot);
    }

    function updateSlider() {
        slider.innerHTML = '';
        
        // عرض كارت واحد فقط
        const cardClone = cards[currentIndex].cloneNode(true);
        cardClone.classList.add('active');
        slider.appendChild(cardClone);
        
        // تحديث نقاط التنقل
        const dots = pagination.children;
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalStudents;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalStudents) % totalStudents;
        updateSlider();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    // إضافة مستمعي الأحداث
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // تحديث السلايدر عند تغيير حجم الشاشة
    window.addEventListener('resize', () => {
        const newSlidesToShow = getSlidesToShow();
        if (newSlidesToShow !== slidesToShow) {
            slidesToShow = newSlidesToShow;
            currentIndex = 0;
            updateSlider();
        }
    });

    // تهيئة السلايدر
    updateSlider();

    // تشغيل السلايدر تلقائياً كل 5 ثواني
    setInterval(nextSlide, 5000);
    
    const loginForm = document.getElementById('login');
    const signupForm = document.getElementById('signup');
    
    // Add click handlers to all links
    document.querySelectorAll('.already-have-account a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginForm.style.display === 'none' || !loginForm.classList.contains('active')) {
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
            } else {
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    });
});
