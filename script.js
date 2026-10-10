```javascript
// ===== NHAT NHANH VAN CHUONG =====

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".navbar a");
    const sections = document.querySelectorAll(
        "#kham-pha, #doc-hieu, #bai-van, #van-mau, #dien-dat, #tac-pham"
    );

    // Cuộn đến mục tương ứng khi nhấn menu
    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                history.replaceState(null, "", targetId);
            }
        });
    });

    // Đánh dấu mục đang xem trên menu
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        navLinks.forEach(function (link) {
                            link.classList.toggle(
                                "active",
                                link.getAttribute("href") ===
                                "#" + entry.target.id
                            );
                        });
                    }
                });
            },
            {
                rootMargin: "-20% 0px -65% 0px"
            }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }
});
```

const searchPages = [
    {
        title: "Ôn tập đọc hiểu",
        description: "Phương pháp đọc hiểu và khám phá thông điệp văn bản.",
        keywords: "đọc hiểu văn bản phương thức biểu đạt biện pháp tu từ",
        url: "doc-hieu.html"
    },
    {
        title: "Ôn tập văn",
        description: "Ôn tập kiến thức và cách làm bài Ngữ văn.",
        keywords: "ôn tập kiến thức nghị luận văn học xã hội",
        url: "on-tap-van.html"
    },
    {
        title: "Văn mẫu tham khảo",
        description: "Gợi ý phân tích tác phẩm và triển khai bài viết.",
        keywords: "văn mẫu phân tích nghị luận bài văn",
        url: "van-mau.html"
    },
    {
        title: "Diễn đạt và trích dẫn hay",
        description: "Gợi ý cách mở bài, chuyển ý và kết bài.",
        keywords: "diễn đạt trích dẫn mở bài kết bài câu văn",
        url: "dien-dat.html"
    },
    {
        title: "Tác phẩm hay nên đọc",
        description: "Khám phá tác giả và những tác phẩm văn học.",
        keywords: "vợ nhặt kim lân chiếc thuyền ngoài xa nguyễn minh châu đất nước nguyễn khoa điềm sóng xuân quỳnh việt bắc tây tiến",
        url: "tac-pham.html"
    }
];

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");
const searchMessage = document.getElementById("searchMessage");

function normalizeText(text) {
    return text
        .toLocaleLowerCase("vi")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .trim();
}

function performSearch() {
    const keyword = normalizeText(searchInput.value);

    searchResults.replaceChildren();

    if (!keyword) {
        searchMessage.textContent = "Nhập tên tác phẩm, tác giả hoặc chủ đề mày muốn tìm nhé.";
        return;
    }

    const results = searchPages.filter(page => {
        const searchableText = normalizeText(
            page.title + " " + page.description + " " + page.keywords
        );

        return searchableText.includes(keyword);
    });

    if (results.length === 0) {
        searchMessage.textContent = "Chưa tìm thấy nội dung phù hợp. Thử từ khóa khác nhé!";
        return;
    }

    searchMessage.textContent = `Tìm thấy ${results.length} kết quả:`;

    results.forEach(page => {
        const link = document.createElement("a");
        link.className = "search-result";
        link.href = page.url;

        const title = document.createElement("strong");
        title.textContent = page.title;

        const description = document.createElement("p");
        description.textContent = page.description;

        link.append(title, description);
        searchResults.appendChild(link);
    });
}

searchButton.addEventListener("click", performSearch);

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        performSearch();
    }
});
