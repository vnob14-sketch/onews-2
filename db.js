// db.js - PUSAT KENDALI DATABASE ONLINE (SUDAH DIKOREKSI)

const FIREBASE_URL = "https://onews-4c45b-default-rtdb.asia-southeast1.firebasedatabase.app/";
const FIREBASE_BASE = "https://onews-4c45b-default-rtdb.asia-southeast1.firebasedatabase.app/";

// Fungsi mengambil data berita dari Cloud Online
async function getNewsOnline() {
    try {
        const response = await fetch(FIREBASE_URL);
        const data = await response.json();
        
        if (!data) return [];
        
        return Object.keys(data).map(key => {
            const item = data[key];
            return {
                id: key,
                title: item.title || "",
                category: item.category || "",
                image: item.image || "https://unsplash.com",
                content: item.content || "",
                liveUrl: item.liveUrl || "",
                comments: item.comments ? Object.keys(item.comments).map(cKey => ({
                    name: item.comments[cKey].name || "",
                    text: item.comments[cKey].text || ""
                })) : []
            };
        }).reverse();
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
            mode: "cors",
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
        const deleteUrl = `${FIREBASE_BASE}${id}.json`;
        await fetch(deleteUrl, { method: "DELETE" });
    } catch (error) {
        console.error("Gagal menghapus data dari database cloud:", error);
    }
}

// Fungsi mengirim komentar pengunjung ke Cloud Online
async function submitCommentOnline(newsId, commentObj) {
    try {
        const commentUrl = `${FIREBASE_BASE}${newsId}/comments.json`;
        await fetch(commentUrl, {
            method: "POST",
            mode: "cors",
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
