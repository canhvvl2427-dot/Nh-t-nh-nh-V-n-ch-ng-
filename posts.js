
/* Nhặt Nhạnh Văn Chương — Phiên bản chuẩn (Sửa, Xóa, Reload tự động, Cắt chữ) */
const SUPABASE_URL = "https://vrlrvknuawnfdsarubjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_HO4vHnkFM1qw1gUyvUbGag_PtGmvnrC";

const NNVC_CATEGORIES = {
  "doc-hieu.html": "Đọc hiểu",
  "on-tap-van.html": "Ôn tập văn",
  "van-mau.html": "Văn mẫu",
  "dien-dat.html": "Diễn đạt",
  "tac-pham.html": "Tác phẩm"
};

// 1. CHÈN CSS CHO GIAO DIỆN VÀ BẢNG SỬA BÀI
const nnvcStyle = document.createElement('style');
nnvcStyle.textContent = `
  .nnvc-community { margin: 30px 0; padding: 24px; background: #fffdf7; border: 1px solid #d9dfd1; border-radius: 18px; color: #344735; }
  .nnvc-community h2 { color: #607a5a; }
  .nnvc-post { padding: 20px 0; border-top: 1px solid #e0e5da; position: relative; }
  .nnvc-post h3 { margin: 8px 0 4px; color: #405640; font-size: 22px; font-weight: bold; }
  .nnvc-meta { font-size: 13px; color: #788071; margin-bottom: 12px; }
  .nnvc-body { white-space: pre-wrap; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; color: #555A4F; margin-bottom: 15px; line-height: 1.6; }
  .nnvc-read-more { display: inline-block; color: #607a5a; font-weight: bold; text-decoration: none; font-size: 14px; margin-top: 5px; margin-bottom: 15px; }
  .nnvc-read-more:hover { text-decoration: underline; }
  
  /* Các nút Tương tác */
  .nnvc-actions { margin-top: 10px; display: flex; gap: 8px; }
  .nnvc-actions button { padding: 6px 14px; font-size: 13px; border: none; border-radius: 15px; cursor: pointer; font-family: 'Quicksand', sans-serif; font-weight: bold; transition: 0.2s;}
  .nnvc-actions button:hover { opacity: 0.8; transform: translateY(-1px); }
  .btn-edit { background: #E8E5D8; color: #555A4F; }
  .btn-del { background: #E29595; color: white; }
  
  /* Bảng (Modal) Sửa bài */
  .nnvc-modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center; padding: 15px; }
  .nnvc-modal.active { display: flex; }
  .nnvc-modal-content { background: white; padding: 25px; border-radius: 20px; width: 100%; max-width: 600px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
  .nnvc-modal-content h3 { margin-top: 0; color: #7A9B76; font-size: 22px; font-family: 'Quicksand', sans-serif;}
  .nnvc-modal-content input, .nnvc-modal-content select, .nnvc-modal-content textarea { width: 100%; margin-bottom: 15px; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-family: inherit; font-size: 15px; background: #FAFAFA; }
  .nnvc-modal-content textarea { height: 200px; resize: vertical; }
  .nnvc-modal-btns { display: flex; gap: 10px; justify-content: flex-end; }
  .nnvc-btn-save { background: #7A9B76; color: white; border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer; font-weight: bold; font-family: 'Quicksand', sans-serif; }
  .nnvc-btn-cancel { background: #E8E5D8; color: #555A4F; border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer; font-weight: bold; font-family: 'Quicksand', sans-serif; }
`;
document.head.appendChild(nnvcStyle);

// 2. CHÈN BẢNG SỬA BÀI VÀO BÊN DƯỚI MỌI TRANG WEB
const modalHTML = `
  <div id="nnvcEditModal" class="nnvc-modal">
    <div class="nnvc-modal-content">
      <h3>✏️ Chỉnh sửa bài viết</h3>
      <input id="nnvcEditTitle" placeholder="Tiêu đề bài viết">
      <select id="nnvcEditCategory">
        <option value="Đọc hiểu">Đọc hiểu</option>
        <option value="Ôn tập văn">Ôn tập văn</option>
        <option value="Văn mẫu">Văn mẫu</option>
        <option value="Diễn đạt">Diễn đạt</option>
        <option value="Tác phẩm">Tác phẩm</option>
      </select>
      <textarea id="nnvcEditContent" placeholder="Nội dung bài viết..."></textarea>
      <div class="nnvc-modal-btns">
        <button class="nnvc-btn-cancel" onclick="document.getElementById('nnvcEditModal').classList.remove('active')">Hủy</button>
        <button class="nnvc-btn-save" id="nnvcSaveEditBtn">Lưu lại thay đổi</button>
      </div>
    </div>
  </div>
`;
document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML('beforeend', modalHTML);
});

// Các hàm tiện ích
function esc(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function date(v) { try { return new Date(v).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) } catch { return '' } }

function client() { 
  if (!window.supabase) throw Error('Chưa tải thư viện Supabase.'); 
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Hàm lấy dữ liệu
async function fetchPosts(category, limit = 100) { 
  let q = client().from('posts').select('*').order('created_at', { ascending: false }).limit(limit); 
  if (category) q = q.eq('category', category); 
  const { data, error } = await q; 
  if (error) throw error; 
  return data || [];
}

// 3. LOGIC SỬA VÀ XÓA BÀI
let currentEditingPostId = null;

// Hàm mở bảng sửa bài
function openEdit(post) {
  currentEditingPostId = post.id;
  document.getElementById('nnvcEditTitle').value = post.title;
  document.getElementById('nnvcEditCategory').value = post.category;
  document.getElementById('nnvcEditContent').value = post.content;
  document.getElementById('nnvcEditModal').classList.add('active');
}

// Hàm lưu bài sửa
async function saveEdit() {
  if (!currentEditingPostId) return;
  const title = document.getElementById('nnvcEditTitle').value.trim();
  const category = document.getElementById('nnvcEditCategory').value;
  const content = document.getElementById('nnvcEditContent').value.trim();
  
  const btn = document.getElementById('nnvcSaveEditBtn');
  btn.textContent = "Đang lưu..."; btn.disabled = true;

  try {
    // Lưu lên Supabase
    await client().from('posts').update({ title, category, content }).eq('id', currentEditingPostId);
    
    // Đóng bảng và TỰ ĐỘNG TẢI LẠI BÀI VIẾT
    document.getElementById('nnvcEditModal').classList.remove('active');
    await loadCategory(); 
  } catch (error) {
    alert("Lỗi khi lưu: " + error.message);
  }
  btn.textContent = "Lưu lại thay đổi"; btn.disabled = false;
}

// Hàm xóa bài
async function deletePost(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không? Không thể hoàn tác nha!")) return;
  try {
    await client().from('posts').delete().eq('id', id);
    await loadCategory(); // TỰ ĐỘNG TẢI LẠI SAU KHI XÓA
  } catch (error) {
    alert("Lỗi khi xóa: " + error.message);
  }
}

// 4. IN BÀI VIẾT RA MÀN HÌNH (Gắn trực tiếp sự kiện vào HTML an toàn tuyệt đối)
function renderCards(posts, container) {
  container.innerHTML = '';
  if (posts.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#788071;">Chưa có bài viết nào ở đây cả 🌷</p>';
    return;
  }

  posts.forEach(p => {
    // Biến dòng mới thành <br> để HTML hiểu
    const formattedContent = esc(p.content).replace(/\n/g, '<br>');
    
    // Tạo thẻ chứa bài viết
    const article = document.createElement('article');
    article.className = 'nnvc-post';
    
    // Đổ nội dung vào
    article.innerHTML = `
      <span class="post-category" style="background:#E8F0E1; color:#7A9B76; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:bold;">${esc(p.category)}</span>
      <h3>${esc(p.title)}</h3>
      <p class="nnvc-meta">Đăng bởi ${esc(p.author_name || 'Ẩn danh')} · Lúc ${date(p.created_at)}</p>
      <div class="nnvc-body">${formattedContent}</div>
      <a href="chi-tiet.html?id=${p.id}" class="nnvc-read-more">Đọc bài ➔</a>
    `;

    // Tạo khu vực nút bấm
    const actions = document.createElement('div');
    actions.className = 'nnvc-actions';

    // Tạo nút Sửa
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.textContent = '✏️ Sửa bài';
    editBtn.onclick = () => openEdit(p); // Gọi thẳng hàm JS, không sợ gãy chuỗi HTML

    // Tạo nút Xóa
    const delBtn = document.createElement('button');
    delBtn.className = 'btn-del';
    delBtn.textContent = '🗑️ Xóa bài';
    delBtn.onclick = () => deletePost(p.id);

    // Ghép nút vào bài viết
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    article.appendChild(actions);

    // Gắn bài viết lên web
    container.appendChild(article);
  });
}

// HÀM TẢI LẠI TRANG CHUNG
async function loadCategory() { 
  let file = location.pathname.split('/').pop() || 'index.html'; 
  let category = NNVC_CATEGORIES[file]; 
  
  const filterSelect = document.getElementById('filter');
  if (filterSelect) category = filterSelect.value;

  const box = document.querySelector('.nnvc-posts') || document.getElementById('posts'); 
  if (!box) return; 

  const loadingMsg = document.getElementById('loading');
  if(loadingMsg) loadingMsg.textContent = "Đang tải bài viết...";

  try { 
    const ps = await fetchPosts(category); 
    if(loadingMsg) loadingMsg.textContent = "";
    renderCards(ps, box);
  } catch (e) { 
    box.innerHTML = `<p class="nnvc-error">${esc(e.message)}</p>`;
  } 
}

// 5. CHẠY KHI VỪA MỞ WEB LÊN
document.addEventListener('DOMContentLoaded', () => { 
  loadCategory(); 

  // Lắng nghe Form Đăng Bài Mới
  const postForm = document.getElementById('postForm');
  if (postForm) {
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Chặn web F5 bậy bạ
      
      const btn = document.getElementById('submitBtn');
      const msg = document.getElementById('message');
      
      btn.disabled = true; btn.textContent = "Đang đăng...";
      
      const payload = {
        author_name: document.getElementById('author').value.trim(),
        title: document.getElementById('title').value.trim(),
        category: document.getElementById('category').value,
        content: document.getElementById('content').value.trim()
      };

      try {
        await client().from('posts').insert(payload);
        msg.textContent = "Đăng bài thành công! 🌷";
        msg.className = "success";
        postForm.reset();
        
        await loadCategory(); // ĐĂNG XONG TỰ ĐỘNG TẢI LẠI NGAY LẬP TỨC
        
      } catch (error) {
        msg.textContent = "Lỗi: " + error.message;
        msg.className = "error";
      }
      btn.disabled = false; btn.textContent = "Đăng bài công khai";
    });
  }

  // Lắng nghe khi chọn Môn học (Filter)
  const filterSelect = document.getElementById('filter');
  if (filterSelect) filterSelect.addEventListener('change', loadCategory);

  // Lắng nghe cái Nút Lưu trong bảng Sửa bài (Chờ 0.5s để web chèn HTML xong rồi mới móc nút)
  setTimeout(() => {
    const saveEditBtn = document.getElementById('nnvcSaveEditBtn');
    if (saveEditBtn) saveEditBtn.addEventListener('click', saveEdit);
  }, 500);
});
