// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="index.html"><strong aria-hidden="true">1.</strong> About Polkadot Vault</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="about/FAQ.html"><strong aria-hidden="true">1.1.</strong> FAQ</a></li><li class="chapter-item expanded "><a href="about/Security-And-Privacy.html"><strong aria-hidden="true">1.2.</strong> Security-And-Privacy</a></li><li class="chapter-item expanded "><a href="tutorials/Hierarchical-Deterministic-Key-Derivation.html"><strong aria-hidden="true">1.3.</strong> Hierarchical-Deterministic-Key-Derivation</a></li><li class="chapter-item expanded "><a href="about/Changelog.html"><strong aria-hidden="true">1.4.</strong> Changelog</a></li></ol></li><li class="chapter-item expanded "><a href="tutorials/SUMMARY.html"><strong aria-hidden="true">2.</strong> User Guides</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="tutorials/Start.html"><strong aria-hidden="true">2.1.</strong> Start</a></li><li class="chapter-item expanded "><a href="tutorials/Upgrading.html"><strong aria-hidden="true">2.2.</strong> Upgrading</a></li><li class="chapter-item expanded "><a href="tutorials/Add-New-Network.html"><strong aria-hidden="true">2.3.</strong> Add New Network</a></li><li class="chapter-item expanded "><a href="tutorials/Kusama-tutorial.html"><strong aria-hidden="true">2.4.</strong> Kusama-tutorial</a></li><li class="chapter-item expanded "><a href="tutorials/Recover-Account-Polkadotjs.html"><strong aria-hidden="true">2.5.</strong> Recover-Account-Polkadotjs</a></li></ol></li><li class="chapter-item expanded "><a href="development/Development.html"><strong aria-hidden="true">3.</strong> Development</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="development/Build.html"><strong aria-hidden="true">3.1.</strong> Build</a></li><li class="chapter-item expanded "><a href="development/Vault-Structure.html"><strong aria-hidden="true">3.2.</strong> Vault structure</a></li><li class="chapter-item expanded "><a href="development/Troubleshooting.html"><strong aria-hidden="true">3.3.</strong> Troubleshooting</a></li><li class="chapter-item expanded "><a href="development/Rustdocs.html"><strong aria-hidden="true">3.4.</strong> Rust docs</a></li><li class="chapter-item expanded "><a href="development/UOS.html"><strong aria-hidden="true">3.5.</strong> Universal offline signature</a></li><li class="chapter-item expanded "><a href="development/Ecosystem.html"><strong aria-hidden="true">3.6.</strong> Vault ecosystem</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
