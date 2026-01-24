// Blog Post Component JavaScript
// Handles interactions and enhancements for blog posts

window.ComponentLoader.registerComponent('blog-post', (root) => {
    if (root.__initialized) return;
    root.__initialized = true;

    console.log('[BlogPost] Initializing blog post component');

    // 1. Smooth scroll for internal links
    const internalLinks = root.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 2. Add copy button to code blocks (if present)
    const codeBlocks = root.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.className = 'absolute top-2 right-2 px-3 py-1 text-sm bg-blissed-olive text-white rounded hover:bg-blissed-gray transition-colors';
        
        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(button);
        
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent);
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
    });

    // 3. Reading progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-blissed-purple-start to-blissed-purple-end z-50 transition-all duration-150';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);

    const updateProgress = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.scrollY;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call

    // 4. External links open in new tab
    const externalLinks = root.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // 5. Lazy load images
    const images = root.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // 6. Table of Contents (if h2 elements exist)
    const headings = Array.from(root.querySelectorAll('h2'));
    if (headings.length > 2) {
        const toc = document.createElement('nav');
        toc.className = 'sticky top-24 p-6 bg-gray-50 rounded-2xl mb-8';
        toc.innerHTML = '<h4 class="font-semibold text-blissed-gray mb-4">Tabla de Contenidos</h4>';
        
        const tocList = document.createElement('ul');
        tocList.className = 'space-y-2 text-sm';
        
        headings.forEach((heading, index) => {
            const id = heading.id || `section-${index}`;
            heading.id = id;
            
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${id}`;
            a.textContent = heading.textContent;
            a.className = 'text-gray-600 hover:text-blissed-olive transition-colors block py-1';
            
            li.appendChild(a);
            tocList.appendChild(li);
        });
        
        toc.appendChild(tocList);
        
        // Insert TOC after first paragraph
        const firstParagraph = root.querySelector('.prose p');
        if (firstParagraph) {
            firstParagraph.after(toc);
        }
    }

    console.log('[BlogPost] Blog post component initialized successfully');
});
