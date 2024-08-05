document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('alphabetCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letters = [];
    const particles = [];

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 5;
            this.vy = (Math.random() - 0.5) * 5;
            this.alpha = 1;
            this.size = Math.random() * 5 + 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.02;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function createExplosion(x, y) {
        for (let i = 0; i < 20; i++) {
            particles.push(new Particle(x, y));
        }
    }

    // Initialize letters with random positions and velocities
    for (let i = 0; i < alphabet.length; i++) {
        letters.push({
            char: alphabet[i],
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            fontSize: 24 + Math.random() * 50
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        letters.forEach(letter => {
            ctx.font = `${letter.fontSize}px Arial`;
            ctx.fillStyle = 'black';
            ctx.fillText(letter.char, letter.x, letter.y);
            
            // Update position
            letter.x += letter.vx;
            letter.y += letter.vy;
            
            // Bounce off walls
            if (letter.x + ctx.measureText(letter.char).width > canvas.width || letter.x < 0) {
                letter.vx = -letter.vx;
            }
            if (letter.y - letter.fontSize < 0 || letter.y > canvas.height) {
                letter.vy = -letter.vy;
            }
        });

        // Check for collisions and create explosion effect
        for (let i = 0; i < letters.length; i++) {
            for (let j = i + 1; j < letters.length; j++) {
                const l1 = letters[i];
                const l2 = letters[j];
                const l1Width = ctx.measureText(l1.char).width;
                const l2Width = ctx.measureText(l2.char).width;
                if (
                    l1.x < l2.x + l2Width &&
                    l1.x + l1Width > l2.x &&
                    l1.y < l2.y &&
                    l1.y + l1.fontSize > l2.y - l2.fontSize
                ) {
                    createExplosion((l1.x + l2.x) / 2, (l1.y + l2.y) / 2);
                    // Reverse direction on collision
                    l1.vx = -l1.vx;
                    l1.vy = -l1.vy;
                    l2.vx = -l2.vx;
                    l2.vy = -l2.vy;
                }
            }
        }

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
});
