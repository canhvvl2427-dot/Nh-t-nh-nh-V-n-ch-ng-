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
