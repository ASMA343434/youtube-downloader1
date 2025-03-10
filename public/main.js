document.querySelectorAll('header a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) translateX(-10px)';
    });

    link.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Popup handling
const addVideoBtn = document.getElementById('addVideoBtn');
const uploadPopup = document.getElementById('uploadPopup');
const closeBtn = document.querySelector('.close');

addVideoBtn.onclick = () => uploadPopup.style.display = "block";
closeBtn.onclick = () => uploadPopup.style.display = "none";

// Form handling
document.getElementById('uploadForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const videoData = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(videoData)
        });

        if (response.ok) {
            alert('تم رفع الدرس بنجاح');
            uploadPopup.style.display = "none";
            await loadVideos(); // تحديث قائمة الفيديوهات
            e.target.reset(); // إعادة تعيين النموذج
        }
    } catch (error) {
        console.error(error);
        alert('حدث خطأ أثناء الرفع');
    }
};

// Load and display videos
async function loadVideos() {
    try {
        const grade = document.getElementById('gradeSelect').value;
        const response = await fetch(`/api/videos?grade=${grade}`);
        const videos = await response.json();
        
        const videoList = document.getElementById('videoList');
        videoList.innerHTML = videos.map(video => `
            <div class="video-card">
                <div class="video-thumbnail">
                    <img src="https://img.youtube.com/vi/${getYouTubeId(video.youtubeUrl)}/maxresdefault.jpg" alt="${video.title}">
                    <div class="overlay">
                        <h3>${video.title}</h3>
                        <span class="grade-tag">${getGradeName(video.grade)}</span>
                        <button class="register-btn" onclick="showRegisterPopup('${video.id}')">سجل الآن</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error(error);
    }
}

function showRegisterPopup(videoId) {
    const popup = document.createElement('div');
    popup.className = 'popup register-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close">&times;</span>
            <h2>تسجيل المشاهدة</h2>
            <form id="registerForm" onsubmit="verifyCode(event, '${videoId}')">
                <div class="form-group">
                    <label>كود المشاهدة</label>
                    <input type="text" name="code" required>
                </div>
                <div class="form-group">
                    <label>الاسم</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>رقم الهاتف</label>
                    <input type="tel" name="phone" required>
                </div>
                <button type="submit">تحقق</button>
            </form>
            <div class="whatsapp-subscribe">
                <p>يمكنك الاشتراك عبر الواتساب</p>
                <a href="https://wa.me/+201126130559" class="whatsapp-link">
                    <i class="fab fa-whatsapp"></i>
                    تواصل معنا
                </a>
            </div>
        </div>
    `;
    document.body.appendChild(popup);

    popup.querySelector('.close').onclick = () => popup.remove();
}

async function verifyCode(event, videoId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...data, videoId })
        });

        if (response.ok) {
            showVideoPlayer(videoId);
            const btn = document.querySelector(`[onclick="showRegisterPopup('${videoId}')"]`);
            btn.textContent = 'مشاهدة';
            btn.onclick = () => showVideoPlayer(videoId);
        } else {
            alert('الكود غير صحيح');
        }
    } catch (error) {
        console.error(error);
        alert('حدث خطأ');
    }
}

function showVideoPlayer(videoId) {
    // Get video data from videos array
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    const player = document.createElement('div');
    player.className = 'popup video-player';
    player.innerHTML = `
        <div class="popup-content">
            <span class="close">&times;</span>
            <div class="video-container">
                <iframe 
                    src="https://www.youtube.com/embed/${getYouTubeId(video.youtubeUrl)}"
                    frameborder="0"
                    allowfullscreen
                ></iframe>
            </div>
            <div class="video-details">
                <h2>${video.title}</h2>
                <p>${video.description}</p>
                <div class="completion-check">
                    <label>
                        <input type="checkbox" onclick="markAsWatched('${videoId}')">
                        أتممت مشاهدة هذا الدرس
                    </label>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(player);

    player.querySelector('.close').onclick = () => player.remove();
}

function markAsWatched(videoId) {
    const checkIcon = document.createElement('i');
    checkIcon.className = 'fas fa-check-circle';
    const videoCard = document.querySelector(`[onclick="showRegisterPopup('${videoId}')"]`).parentElement;
    videoCard.appendChild(checkIcon);
}

// Helper function to extract YouTube video ID
function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Helper function to get grade name
function getGradeName(grade) {
    const grades = {
        'grade6': 'الصف السادس الابتدائي',
        'grade7': 'الصف الأول الإعدادي',
        'grade8': 'الصف الثاني الإعدادي',
        'grade9': 'الصف الثالث الإعدادي',
        'grade10': 'الصف الأول الثانوي',
        'grade11': 'الصف الثاني الثانوي',
        'grade12': 'الصف الثالث الثانوي'
    };
    return grades[grade] || grade;
}

// Load videos on page load and grade change
document.addEventListener('DOMContentLoaded', loadVideos);
document.getElementById('gradeSelect').addEventListener('change', loadVideos);

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const videos = document.querySelectorAll('.video-card');
    videos.forEach(video => {
        const title = video.querySelector('h3').textContent.toLowerCase();
        video.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
});
