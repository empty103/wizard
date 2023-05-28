window.addEventListener('DOMContentLoaded', () => {
    const cvs = document.querySelector('#bg') as HTMLCanvasElement;
    const context = cvs.getContext('2d');

    const width = window.innerWidth;
    const height = window.innerHeight;

    cvs.width = width;
    cvs.height = height;

    if (!context) return;

    const random = (min: number, max: number): number => Math.random() * (max - min) + min;

    const drawBackground = (): void => {
        const gradient = context.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#000B27');
        gradient.addColorStop(1, '#6C2484');

        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
    };

    const drawForeground = (): void => {
        context.fillStyle = '#0C1D2D';
        context.fillRect(0, height * 0.90, width, height);
    };

    const drawMrWizard = (): void => {
        const img = new Image();
        img.src = '../resource/wizard.png';
        img.alt = 'wizard';

        img.onload = () => {
            context.drawImage(img, width * 0.9 - img.width, height * 0.95 - img.height);
        };
    };

    const drawStars = (numberOfStars: number): void => {
        context.fillStyle = 'gold';

        while (numberOfStars--) {
            const x = random(25, width - 50);
            const y = random(25, height * 0.4);
            const size = random(1, 5);

            for (let i = 0; i < 6; i++) {
                const angle = (i * (4 * Math.PI)) / 5 - Math.PI / 10;
                const starSize = i % 2 === 0 ? size : size / 2;
                const offsetX = Math.cos(angle) * starSize;
                const offsetY = Math.sin(angle) * starSize;

                context.fillRect(x + offsetX, y + offsetY, 1, 1);
            }
        }
    };

    const drawScene = (): void => {
        drawBackground();
        drawForeground();
        drawMrWizard();
        drawStars(200);
    };

    drawScene();
});
