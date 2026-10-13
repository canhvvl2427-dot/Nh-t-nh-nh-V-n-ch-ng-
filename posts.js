
/* Nhặt Nhạnh Văn Chương — Bản posts.js chuẩn sạch không lỗi */
const SUPABASE_URL = "https://vrlrvknuawnfdsarubjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_HO4vHnkFM1qw1gUyvUbGag_PtGmvnrC";

const NNVC_CATEGORIES = {
  "doc-hieu.html": "Đọc hiểu",
  "on-tap-van.html": "Ôn tập văn",
  "van-mau.html": "Văn mẫu",
  "dien-dat.html": "Diễn đạt",
  "tac-pham.html": "Tác phẩm"
};

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
  .nnvc-actions { margin-top: 10px; display: flex; gap: 8px; }
  .nnvc-actions button { padding: 6px 14px; font-size: 13px; border: none; border-radius: 50px; cursor: pointer; font-family: 'Quicksand', sans-serif; font-weight: bold; transition: 0.2s;}
  .nnvc-actions button:hover { opacity: 0.8; transform: translateY(-1px); }
  .btn-edit { background: #E8E5D8; color: #555A4F; }
  .btn-del { background: #E29595; color: white; }
  .nnvc-modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center; padding: 15px; }
  .nnvc-modal.active { display: flex; }
  .nnvc-modal-content { background: white; padding: 25px; border-radius: 28px; width: 100%; max-width: 600px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
  .nnvc-modal-content h3 { margin-top: 0; color: #7A9B76; font-size: 22px; font-family: 'Quicksand', sans-serif;}
  .nnvc-modal-content input, .nnvc-modal-content select, .nnvc-modal-content textarea { width: 100%; margin-bottom: 15px; padding: 12px; border: 1px solid #ddd; border-radius: 20px; font-family: inherit; font-size: 15px; background: #FAFAFA; }
  .nnvc-modal-content textarea { height: 200px; resize: vertical; }
  .nnvc-modal-btns { display: flex; gap: 10px; justify-content: flex-end; }
  .nnvc-btn-save { background: #7A9B76; color: white; border: none; padding: 10px 20px; border-radius: 50px; cursor: pointer; font-weight: bold; }
  .nnvc-btn-cancel { background: #E8E5D8; color: #555A4F; border: none; padding: 10px 20px; border-radius: 50px; cursor: pointer; font-weight: bold; }
`;
document.head.appendChild(nnvcStyle);

const modalHTML = `
  <div id="nnvcEditModal" class="nnvc-modal">
    <div class="nnvc-modal-content">
      <h3>✏️ Chỉnh sửa bài viết</h3>
      <input id="nnvcEditTitle" placeholder="Tiêu đề bài viết">
      <select id="nnvcEditCategory">
        <option value="Đọc hiểu">Đọc hiểu</option>
        <optgroup label="📚 Ôn tập văn">
          <option value="Ôn tập văn - Nghị luận văn học">Nghị luận văn học (Ôn tập)</option>
          <option value="Ôn tập văn - Nghị luận xã hội">Nghị luận xã hội (Ôn tập)</option>
        </optgroup>
        <optgroup label="📝 Văn mẫu">
          <option value="Văn mẫu - Nghị luận văn học">Nghị luận văn học (Văn mẫu)</option>
          <option value="Văn mẫu - Nghị luận xã hội">Nghị luận xã hội (Văn mẫu)</option>
        </optgroup>
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

function esc(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function date(v) { try { return new Date(v).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) } catch { return '' } }

function renderCards(posts, container, isHome = false) {
  container.innerHTML = '';
  if (posts.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#788071;">Chưa có bài viết nào ở đây cả 🌷</p>';
    return;
  }
  posts.forEach(p => {
    const formattedContent = esc(p.content).replace(/\n/g, '<br>');
    const article = document.createElement('article');
    article.className = 'nnvc-post';

    if (isHome) {
      article.innerHTML = `
        <h3><a href="chi-tiet.html?id=${p.id}" style="color:inherit;text-decoration:none">${esc(p.title)}</a></h3>
        <p class="nnvc-meta">${esc(p.author_name || 'Ẩn danh')} · ${date(p.created_at)}</p>
        <div class="nnvc-body">${formattedContent}</div>
        <a href="chi-tiet.html?id=${p.id}" class="nnvc-read-more">Đọc bài ➔</a>
      `;
    } else {
      article.innerHTML = `
        <span class="post-category" style="background:#E8F0E1; color:#7A9B76; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:bold;">${esc(p.category)}</span>
        <h3>${esc(p.title)}</h3>
        <p class="nnvc-meta">Đăng bởi ${esc(p.author_name || 'Ẩn danh')} · Lúc ${date(p.created_at)}</p>
        <div class="nnvc-body">${formattedContent}</div>
        <a href="chi-tiet.html?id=${p.id}" class="nnvc-read-more">Đọc bài ➔</a>
      `;
      const actions = document.createElement('div');
      actions.className = 'nnvc-actions';

      const streakBtn = document.createElement('button');
      streakBtn.style.background = '#E8A598'; streakBtn.style.color = 'white';
      streakBtn.textContent = `🔥 (${p.likes || 0})`;
      streakBtn.onclick = async () => {
        const newLikes = (p.likes || 0) + 1;
        streakBtn.textContent = `🔥 (${newLikes})`;
        await supabaseClient.from('posts').update({ likes: newLikes }).eq('id', p.id);
      };

      const editBtn = document.createElement('button');
      editBtn.className = 'btn-edit'; editBtn.textContent = '✏️ Sửa';
      editBtn.onclick = () => openEdit(p);

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-del'; delBtn.textContent = '🗑️ Xóa';
      delBtn.onclick = async () => {
        if (!confirm("Chắc chắn xóa bài viết này chứ?")) return;
        await supabaseClient.from('posts').delete().eq('id', p.id);
        if(typeof loadCategory === 'function') loadCategory();
      };

      actions.append(streakBtn, editBtn, delBtn);
      article.appendChild(actions);
    }
    container.appendChild(article);
  });
}

async function fetchPosts(category, limit = 100) { 
  let q = supabaseClient.from('posts').select('*').order('created_at', { ascending: false }).limit(limit); 
  if (category) {
    q = q.eq('category', category);
  }
  const { data, error } = await q; 
  if (error) throw error; 
  return data || [];
}

async function loadHome() {
  for (const el of document.querySelectorAll('[data-preview-category]')) { 
    try { 
      const ps = await fetchPosts(el.dataset.previewCategory, 3); 
      el.innerHTML = ps.length ? ps.map(p => `<a href="${esc(el.dataset.previewHref || 'cong-dong.html')}">${esc(p.title)}</a>`).join('') : 'Chưa có bài viết.' 
    } catch (e) { el.textContent = 'Chưa kết nối được kho bài.' } 
  }
  for (const el of document.querySelectorAll('[data-home-category]')) { 
    try { 
      const ps = await fetchPosts(el.dataset.homeCategory, 5); 
      renderCards(ps, el, true);
    } catch (e) { el.textContent = 'Chưa kết nối được kho bài.' } 
  }
}

async function loadCategory() { 
  let file = location.pathname.split('/').pop() || 'index.html'; 
  let category = NNVC_CATEGORIES[file]; 
  
  const feedSection = document.querySelector('.nnvc-category-feed');
  if (feedSection && feedSection.hasAttribute('data-category')) {
    category = feedSection.getAttribute('data-category');
  }

  const filterSelect = document.getElementById('filter');
  if (filterSelect && filterSelect.value) {
    category = filterSelect.value;
  }

  const box = document.querySelector('.nnvc-posts') || document.getElementById('posts'); 
  if (!box) return; 

  const loadingMsg = document.getElementById('loading');
  if(loadingMsg) loadingMsg.textContent = "Đang tải bài viết...";

  try { 
    const ps = await fetchPosts(category); 
    if(loadingMsg) loadingMsg.textContent = "";
    renderCards(ps, box, false);
  } catch (e) { 
    box.innerHTML = `<p class="nnvc-error">${esc(e.message)}</p>`;
  } 
}

let currentEditingPostId = null;
function openEdit(post) {
  currentEditingPostId = post.id;
  document.getElementById('nnvcEditTitle').value = post.title;
  document.getElementById('nnvcEditCategory').value = post.category;
  document.getElementById('nnvcEditContent').value = post.content;
  document.getElementById('nnvcEditModal').classList.add('active');
}

async function saveEdit() {
  if (!currentEditingPostId) return;
  const btn = document.getElementById('nnvcSaveEditBtn');
  btn.textContent = "Đang lưu..."; btn.disabled = true;
  try {
    const { error } = await supabaseClient.from('posts').update({ 
      title: document.getElementById('nnvcEditTitle').value.trim(), 
      category: document.getElementById('nnvcEditCategory').value, 
      content: document.getElementById('nnvcEditContent').value.trim() 
    }).eq('id', currentEditingPostId);
    if (error) throw error;
    document.getElementById('nnvcEditModal').classList.remove('active');
    if(typeof loadCategory === 'function') loadCategory(); 
  } catch (error) { alert("Lỗi khi lưu: " + error.message); } 
  finally { btn.textContent = "Lưu lại thay đổi"; btn.disabled = false; }
}

document.addEventListener('DOMContentLoaded', () => { 
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  loadHome(); 
  loadCategory(); 

  const postForm = document.getElementById('postForm');
  if (postForm) {
    postForm.onsubmit = async function(e) {
      e.preventDefault(); 
      const btn = document.getElementById('submitBtn');
      const msg = document.getElementById('message');
      
      btn.disabled = true; 
      btn.textContent = "Đang đăng...";
      
      const payload = {
        author_name: document.getElementById('author').value.trim() || "Ẩn danh",
        title: document.getElementById('title').value.trim(),
        category: document.getElementById('category').value,
        content: document.getElementById('content').value.trim()
      };
      
      try {
        const { error } = await supabaseClient.from('posts').insert([payload]);
        if (error) throw error; 
        
        msg.textContent = "Đăng bài thành công! 🌷";
        msg.className = "success";
        postForm.reset();
        
        try { if(typeof loadCategory === 'function') loadCategory(); } catch(err) {}
        
      } catch (error) {
        msg.textContent = "Lỗi đăng bài: " + error.message;
        msg.className = "error";
      } finally {
        btn.disabled = false; 
        btn.textContent = "Đăng bài công khai";
      }
    };
  }

  const filterSelect = document.getElementById('filter');
  if (filterSelect) filterSelect.addEventListener('change', loadCategory);

  setTimeout(() => {
    const saveEditBtn = document.getElementById('nnvcSaveEditBtn');
    if (saveEditBtn) saveEditBtn.addEventListener('click', saveEdit);
  }, 500);
});
/* Tự động tạo hiệu ứng lá mùa thu rơi chill chill */
function createLeaves() {
  const leafSymbols = ['🍁', '🍂', '🍃', '🌿'];
  const container = document.body;

  setInterval(() => {
    const leaf = document.createElement('div');
    leaf.className = 'falling-leaf';
    leaf.textContent = leafSymbols[Math.floor(Math.random() * leafSymbols.length)];
    
    // Ngẫu nhiên vị trí xuất hiện, tốc độ rơi và kích thước lá
    leaf.style.left = Math.random() * 100 + 'vw';
    leaf.style.fontSize = (Math.floor(Math.random() * 12) + 14) + 'px';
    const duration = Math.random() * 5 + 6; // Rơi từ 6 đến 11 giây cho êm
    leaf.style.animationDuration = duration + 's';
    
    container.appendChild(leaf);

    // Xóa lá sau khi rơi xong để không nặng máy
    setTimeout(() => {
      leaf.remove();
    }, duration * 1000);
  }, 800); // Cứ mỗi 0.8 giây thả một chiếc lá cho lãng mạn
}

// Chạy hiệu ứng khi tải xong trang
document.addEventListener('DOMContentLoaded', createLeaves);

