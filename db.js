// db.js - Sinkronisasi Sistem Data Online Cloud Global

// GANTI URL DI BAWAH INI DENGAN TAUTAN URL FIREBASE REALTIME DATABASE ANDA!
const FIREBASE_URL = "https://console.firebase.google.com/project/onews-4c45b/database/onews-4c45b-default-rtdb/data/~2F?fb_gclid=Cj0KCQjwzsjVBhC3ARIsALnMv4mJTpP3O3svClV9oBrvoJhWD2vPnq17Vofc-GjlNZEVWF-3MEBh2EcaAn-DEALw_wcB&fb_utm_campaign=Cloud-SS-DR-Firebase-FY26-global-gsem-1713590&fb_utm_content=text-ad&fb_utm_medium=cpc&fb_utm_source=google&fb_utm_term=KW_firebase";

// Fungsi mengambil data berita dari Cloud Online secara real-time
async function getNewsOnline() {
    try {
        const response = await fetch(FIREBASE_URL);
        const data = await response.json();
        
        if (!data) return [];
        
        // Mengubah format objek Firebase menjadi struktur array agar tidak merusak kode HTML Anda
        return Object.keys(data).map(key => ({
            id: key, // Menggunakan ID unik bawaan Firebase
            title: data[key].title,
            category: data[key].category,
            image: data[key].image || "",
            content: data[key].content || "",
            liveUrl: data[key].liveUrl || "",
            comments: data[key].comments ? Object.values(data[key].comments) : []
        }));
    } catch (error) {
        console.error("Gagal mengambil data dari database cloud:", error);
        return [];
    }
}

// Fungsi mengirim postingan berita baru ke Cloud Online
async function saveNewsOnline(newArticle) {
    try {
        await fetch(FIREBASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newArticle)
        });
    } catch (error) {
        console.error("Gagal mengirim data ke database cloud:", error);
    }
}

// Fungsi menghapus berita dari Cloud Online
async function deleteNewsOnline(id) {
    try {
        const deleteUrl = `https://firebasedatabase.app{id}.json`;
        await fetch(deleteUrl, { method: "DELETE" });
    } catch (error) {
        console.error("Gagal menghapus data dari database cloud:", error);
    }
}

// Fungsi mengirim komentar pengunjung ke Cloud Online
async function submitCommentOnline(newsId, commentObj) {
    try {
        const commentUrl = `https://firebasedatabase.app{newsId}/comments.json`;
        await fetch(commentUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentObj)
        });
    } catch (error) {
        console.error("Gagal mengirim komentar ke database cloud:", error);
    }
}

function cleanEmoji(text) { 
    return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/gu, ''); 
}

// Cek status autentikasi admin di menu navigasi
document.addEventListener("DOMContentLoaded", () => {
    const isLogin = localStorage.getItem("onews_admin_login") === "true";
    const logoutBtn = document.getElementById("logoutBtn");
    const adminLink = document.getElementById("adminMenuLink");
    if(isLogin && logoutBtn && adminLink) {
        logoutBtn.style.display = "block";
        adminLink.innerText = "Kelola";
        adminLink.href = "admin.html";
    }
});

function handleGlobalLogout() {
    localStorage.removeItem("onews_admin_login");
    window.location.href = "index.html";
}

function handleGlobalSearch(event) {
    if(event.key === "Enter" || event.type === "input") {
        const q = event.target.value.trim();
        if(q !== "") {
            window.location.href = "pencarian.html?q=" + encodeURIComponent(q);
        }
    }
}
