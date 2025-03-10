document.addEventListener('DOMContentLoaded', () => {
    const balls = document.querySelectorAll('.ball');
    const delays = [0.1, 0.2, 0.3, 0.4, 0.5]; // Different delays for each ball
    let mouseX = 0;
    let mouseY = 0;
    let ballPositions = Array(balls.length).fill().map(() => ({ x: 0, y: 0 }));

    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation function
    function animate() {
        balls.forEach((ball, index) => {
            // Calculate target position with offset to prevent overlapping
            const targetX = mouseX - ball.offsetWidth / 2;
            const targetY = mouseY - ball.offsetHeight / 2;

            // Update ball position with easing
            ballPositions[index].x += (targetX - ballPositions[index].x) * (0.1 / delays[index]);
            ballPositions[index].y += (targetY - ballPositions[index].y) * (0.1 / delays[index]);

            // Apply transform with slight rotation for fun effect
            const rotation = Math.atan2(
                targetY - ballPositions[index].y,
                targetX - ballPositions[index].x
            ) * (180 / Math.PI);

            ball.style.transform = `translate(${ballPositions[index].x}px, ${ballPositions[index].y}px) rotate(${rotation}deg)`;
        });

        requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        mouseX = window.innerWidth / 2;
        mouseY = window.innerHeight / 2;
    });

    // Initial position at center of screen
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;

    // Particle System
    const particleContainer = document.getElementById('particle-container');
    const particleCount = 50;
    const particles = [];

    class Particle {
        constructor() {
            this.element = document.createElement('div');
            this.element.className = 'particle';
            this.element.style.position = 'absolute';
            this.element.style.width = '4px';
            this.element.style.height = '4px';
            this.element.style.background = '#fff';
            this.element.style.borderRadius = '50%';
            this.element.style.opacity = '0.6';
            this.element.style.boxShadow = '0 0 10px #fff';
            
            this.reset();
            particleContainer.appendChild(this.element);
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.life = Math.random() * 3 + 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= 0.01;

            if (this.life <= 0 || 
                this.x < 0 || this.x > window.innerWidth ||
                this.y < 0 || this.y > window.innerHeight) {
                this.reset();
            }

            this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
            this.element.style.opacity = this.life / 5;
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animate particles
    function animateParticles() {
        particles.forEach(particle => particle.update());
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Pendulum Animation
    const pendulum = document.querySelector('.pendulum');
    let angle = 20;
    let velocity = 0;
    const gravity = 0.5;
    const damping = 0.995;
    let isHovered = false;

    function animatePendulum() {
        const acceleration = (-gravity / 30) * Math.sin(angle * (Math.PI / 180));
        velocity += acceleration;
        velocity *= damping;
        angle += velocity;

        if (isHovered) {
            velocity *= 1.01; // Increase energy when hovered
        }

        pendulum.style.transform = `rotate(${angle}deg)`;
        requestAnimationFrame(animatePendulum);
    }

    if (pendulum) {
        pendulum.addEventListener('mouseenter', () => isHovered = true);
        pendulum.addEventListener('mouseleave', () => isHovered = false);
        animatePendulum();
    }

    // Chemistry Bubbles
    const bubblesContainer = document.querySelector('.bubbles-container');
    if (bubblesContainer) {
        function createBubble() {
            const bubble = document.createElement('div');
            bubble.style.position = 'absolute';
            bubble.style.bottom = '-20px';
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.width = Math.random() * 20 + 10 + 'px';
            bubble.style.height = bubble.style.width;
            bubble.style.background = `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.3)`;
            bubble.style.borderRadius = '50%';
            bubble.style.animation = `rise ${Math.random() * 3 + 2}s linear`;
            
            bubble.addEventListener('animationend', () => {
                bubble.remove();
            });

            bubblesContainer.appendChild(bubble);
        }

        // Add bubble animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rise {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 0.5;
                }
                100% {
                    transform: translateY(-400px) scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Create bubbles periodically
        setInterval(createBubble, 300);
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 