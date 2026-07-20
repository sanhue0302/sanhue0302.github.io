class IntroManager {
    static play(script, onComplete) {
        if (!script || !Array.isArray(script) || script.length === 0) {
            onComplete();
            return;
        }

        const container = document.createElement('div');
        container.id = 'intro-comic';
        
        let html = '';
        script.forEach((panel, index) => {
            const hiddenClass = index === 0 ? '' : 'hidden';
            const artClass = panel.artClass ? ` ${panel.artClass}` : '';
            const textClass = panel.cssClass ? ` ${panel.cssClass}` : '';
            
            html += `<div class="comic-panel ${hiddenClass}" id="panel-${index + 1}">`;
            if (panel.art) {
                html += `<div class="comic-art${artClass}">${panel.art}</div>`;
            }
            if (panel.text) {
                html += `<div class="comic-text${textClass}">${panel.text}</div>`;
            }
            html += `</div>`;
        });
        
        html += `<button id="next-comic-btn">繼續 <i class="fa-solid fa-caret-right"></i></button>`;
        container.innerHTML = html;
        document.body.appendChild(container);

        let currentPanel = 1;
        const totalPanels = script.length;
        const nextBtn = document.getElementById('next-comic-btn');
        
        nextBtn.addEventListener('click', () => {
            const prev = document.getElementById(`panel-${currentPanel}`);
            if (prev) prev.classList.add('hidden');
            
            currentPanel++;
            
            if (currentPanel > totalPanels) {
                container.style.opacity = '0';
                container.style.transition = 'opacity 1s';
                setTimeout(() => {
                    container.remove();
                    onComplete();
                }, 1000);
            } else {
                const next = document.getElementById(`panel-${currentPanel}`);
                if (next) next.classList.remove('hidden');
                
                if (currentPanel === totalPanels) {
                    const lastPanel = script[totalPanels - 1];
                    if (lastPanel.btnText) {
                        nextBtn.innerHTML = lastPanel.btnText;
                    }
                }
            }
        });
    }
}
