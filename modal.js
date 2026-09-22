// modal.js - Modul Dialog Detail Komentar Online Cloud
const modalHtml = `
<div id="newsModal" class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <span id="modalCategory" class="news-badge">Kategori</span>
            <button onclick="closeModal()" class="modal-close">&times;</button>
        </div>
        <div class="modal-scroll">
            <h2 id="modalTitle" style="font-size: 24px; font-weight: 900; margin-bottom: 16px;">Judul Berita</h2>
            <div id="modalMediaArea"></div>
            <p id="modalContent" style="font-size:15px; line-height:1.7; color:#334155; white-space:pre-wrap; margin-top:16px;">Isi lengkap...</p>
            <div style="border-top: 1px solid #e2e8f0; margin-top: 32px; padding-top: 20px;">
                <h3 style="font-size: 16px; font-weight: 900; margin-bottom: 16px;">Kolom Komentar Pengunjung</h3>
                <div class="comment-box">
                    <input type="text" id="commentName" placeholder="Nama Anda" class="form-input" style="padding:8px;">
                    <textarea id="commentText" rows="2" placeholder="Tulis komentar resmi..." class="form-textarea" style="padding:8px; resize:none;"></textarea>
                    <button onclick="submitComment()" class="action-btn" style="width:auto; padding: 8px 20px; font-size:13px;">Kirim Komentar</button>
                </div>
                <div id="modalCommentsList"></div>
            </div>
        </div>
    </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', modalHtml);
let globalModalActiveId = null;

async function openModal(id) {
    const db = await getNewsOnline();
    const news = db.find(item => item.id === id);
    if (!news) return;
    globalModalActiveId = id;
    document.getElementById("modalCategory").innerText = news.category;
    document.getElementById("modalTitle").innerText = news.title;
    document.getElementById("modalContent").innerText = news.content;
    const media = document.getElementById("modalMediaArea");
    if(news.category === "livestream") media.innerHTML = `<div class="video-stream-area" style="height:200px; margin-bottom:0;">LIVE STREAMING</div>`;
    else media.innerHTML = `<img src="${news.image}" class="modal-img">`;
    renderComments(news.comments);
    document.getElementById("newsModal").classList.add("open");
}

function closeModal() {
    document.getElementById("newsModal").classList.remove("open");
    globalModalActiveId = null;
}

function renderComments(list) {
    const container = document.getElementById("modalCommentsList");
    container.innerHTML = "";
    if (!list || list.length === 0) { container.innerHTML = `<p style="font-size:12px; color:#94a3b8; font-style:italic;">Belum ada komentar.</p>`; return; }
    list.forEach(c => {
        const div = document.createElement("div");
        div.className = "comment-item";
        div.innerHTML = `<div class="comment-name">${c.name}</div><div class="comment-txt">${c.text}</div>`;
        container.appendChild(div);
    });
}

async function submitComment() {
    const n = cleanEmoji(document.getElementById("commentName").value.trim());
    const t = cleanEmoji(document.getElementById("commentText").value.trim());
    if (!n || !t) { alert("Nama dan komentar wajib diisi."); return; }
    
    const commentObj = { name: n, text: t };
    await submitCommentOnline(globalModalActiveId, commentObj);
    
    document.getElementById("commentName").value = "";
    document.getElementById("commentText").value = "";
    
    // Refresh komentar setelah terkirim
    const db = await getNewsOnline();
    const news = db.find(item => item.id === globalModalActiveId);
    if(news) renderComments(news.comments);
}
