window.addEventListener('DOMContentLoaded', () => {
    const cvs = document.querySelector('#firework') as HTMLCanvasElement;
    const context = cvs.getContext('2d');

    const width: number = window.innerWidth;
    const height: number = window.innerHeight;

    const pos = {
        mouseX: 0,
        mouseY: 0,
        wandX: 0,
        wandY: 0
    }

    const fireworks: Firework[] = [];
    const particles: Particle[] = [];
    const numberOfParticles: number = 50;

    const random = (min: number, max: number):
        number => Math.random() * (max - min) + min;


    const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
        const xDistance = x1 - x2;
        const yDistance = y1 - y2;

        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }


    const img: HTMLImageElement = new Image();
    img.src = '../resource/wand.png';
    img.alt = 'wand';

    img.onload = (): void => {
        attachEventListeners();
        loop();
    }

    let mouseClicked: boolean = false;

    cvs.width = width;
    cvs.height = height;

    const drawWand = (): void => {
        pos.wandX = (width * .91) - img.width;
        pos.wandY = (height * .93) - img.height;

        const rotateInRadians = Math.atan2(pos.mouseY - pos.wandY, pos.mouseX - pos.wandX) - Math.PI;
        const rotatenInDegrees = (rotateInRadians * 180 / Math.PI) + 360;

        if (!context) return;
        context.clearRect(0, 0, width, height);

        context.save();
        context.translate(pos.wandX, pos.wandY);

        if (rotatenInDegrees > 0 && rotatenInDegrees < 90) {
            context.rotate(rotatenInDegrees * Math.PI / 180);
        } else if (rotatenInDegrees > 90 && rotatenInDegrees < 275) {
            context.rotate(90 * Math.PI / 180);
        }

        context.drawImage(img, -img.width, -img.height / 2);
        context.restore();
    }


    const attachEventListeners = (): void => {
        cvs.addEventListener('mousemove', (e: MouseEvent) => {
            pos.mouseX = e.pageX;
            pos.mouseY = e.pageY;
        });

        cvs.addEventListener('mousedown', () => mouseClicked = true);
        cvs.addEventListener('mouseup', () => mouseClicked = false);
        cvs.addEventListener('mouseleave', () => {
            pos.mouseX = 0;
            pos.mouseY = 0;
            mouseClicked = false;
        });
    }


    const loop = (): void => {
        drawWand();

        if (mouseClicked) {
            fireworks.push(new Firework());
        }

        for (let i = 0; i < fireworks.length; i++) {
            fireworks[i].draw(i);
        }

        for (let i = 0; i < particles.length; i++) {
            particles[i].draw(i);
        }

        requestAnimationFrame(loop);
    }


    class Firework {
        x!: number;
        y!: number;
        tx!: number;
        ty!: number;
        distanceToTarget!: number;
        distanceTraveled!: number;
        coords!: [number, number][];
        angle!: number;
        speed!: number;
        friction!: number;
        colors!: number;


        constructor() {
            this.init();
        }

        private init(): void {
            let fireworkLength = 10;

            this.x = pos.wandX;
            this.y = pos.wandY;
            this.tx = pos.mouseX;
            this.ty = pos.mouseY;

            this.distanceToTarget = getDistance(pos.wandX, pos.wandY, this.tx, this.ty);
            this.distanceTraveled = 0;

            this.coords = [];
            this.angle = Math.atan2(this.ty - pos.wandY, this.tx - pos.wandX);
            this.speed = 15;
            this.friction = .99;
            this.colors = random(0, 360);

            for (let i = 0; i < fireworkLength; i++) {
                this.coords.push([this.x, this.y]);

            }
        }

        public draw(index: number): void {
            if (!context) return;
            context.beginPath();
            context.moveTo(
                this.coords[this.coords.length - 1][0],
                this.coords[this.coords.length - 1][1]
            );
            context.lineTo(this.x, this.y);
            context.strokeStyle = `hsl(${this.colors}, 100%, 50%)`;
            context.stroke();

            this.animate(index);
        }

        animate(index: number): void {
            this.coords.pop();
            this.coords.unshift([this.x, this.y]);

            this.speed *= this.friction;

            const vx = Math.cos(this.angle) * this.speed;
            const vy = Math.sin(this.angle) * this.speed;

            this.distanceTraveled = getDistance(pos.wandX, pos.wandY, this.x + vx, this.y + vy);

            if (this.distanceTraveled >= this.distanceToTarget) {
                for (let i = 0; i < numberOfParticles; i++) {
                    particles.push(new Particle(this.tx, this.ty));
                }

                fireworks.splice(index, 1);
            } else {
                this.x += vx;
                this.y += vy;
            }
        }
    }

    class Particle {
        x!: number;
        y!: number;
        coords!: [number, number][];
        angle!: number;
        speed!: number;
        friction!: number;
        gravity!: number;
        colors!: number;
        alpha!: number;
        decay!: number;

        constructor(x: number, y: number) {
            this.init(x, y);
        }

        private init(x: number, y: number): void {
            let particleLength = 7;

            this.x = x;
            this.y = y;

            this.coords = [];

            this.angle = random(0, Math.PI * 2);
            this.speed = random(1, 10);

            this.friction = 0.96;
            this.gravity = 5;

            this.colors = random(0, 360);
            this.alpha = 1;
            this.decay = random(.015, .03);

            for (let i = 0; i < particleLength; i++) {
                this.coords.push([this.x, this.y]);
            }
        }

        public draw(index: number): void {
            if (!context) return;
            context.beginPath();
            context.moveTo(
                this.coords[this.coords.length - 1][0],
                this.coords[this.coords.length - 1][1]
            );
            context.lineTo(this.x, this.y);

            context.strokeStyle = `hsla(${this.colors}, 100%, 50%, ${this.alpha})`;
            context.stroke();

            this.animate(index);
        }

        private animate(index: number): void {
            this.coords.pop();
            this.coords.unshift([this.x, this.y]);

            this.speed *= this.friction;

            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;

            this.alpha -= this.decay;

            if (this.alpha <= this.decay) {
                particles.splice(index, 1);
            }
        }
    }
});