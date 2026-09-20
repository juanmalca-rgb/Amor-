```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let W;
let H;
let dpr;

let particles = [];
let petals = [];
let stars = [];

let running = true;
let time = 0;


/* =========================
   AJUSTAR PANTALLA
========================= */

function resize() {

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    createScene();
}


/* =========================
   NÚMEROS ALEATORIOS
========================= */

function rand(min, max) {
    return Math.random() * (max - min) + min;
}


/* =========================
   CREAR ESCENA
========================= */

function createScene() {

    particles = [];
    petals = [];
    stars = [];

    const centerX = W / 2;
    const centerY = H * 0.38;


    /* POLVO DORADO */

    for (
        let i = 0;
        i < Math.min(1800, W * 2.5);
        i++
    ) {

        const x = rand(0, W);
        const y = rand(H * 0.48, H);

        particles.push({

            x: x,
            y: y,

            s: rand(0.4, 1.7),

            a: rand(0.15, 0.85),

            tw: rand(0, 7)

        });
    }


    /* PÉTALOS */

    const count =
        Math.min(
            2600,
            Math.max(900, W * 3.2)
        );


    for (let i = 0; i < count; i++) {

        const angle =
            i / count *
            Math.PI *
            2 *
            9 +
            rand(-0.08, 0.08);


        const ring = rand(0.75, 1.12);


        const radius =
            Math.min(W, H) *
            0.15 *
            ring;


        const x =
            centerX +
            Math.cos(angle) *
            radius *
            (1 + 0.18 * Math.sin(9 * angle));


        const y =
            centerY +
            Math.sin(angle) *
            radius *
            (1 + 0.18 * Math.sin(9 * angle));


        petals.push({

            x: x,
            y: y,

            baseX: x,
            baseY: y,

            size: rand(1.1, 3.2),

            phase: rand(0, Math.PI * 2),

            gold: Math.random() < 0.55

        });
    }


    /* CENTRO DE LA FLOR */

    for (let i = 0; i < 700; i++) {

        const angle = rand(
            0,
            Math.PI * 2
        );

        const radius =
            Math.sqrt(Math.random()) *
            Math.min(W, H) *
            0.075;


        petals.push({

            x:
                centerX +
                Math.cos(angle) *
                radius,

            y:
                centerY +
                Math.sin(angle) *
                radius,

            baseX:
                centerX +
                Math.cos(angle) *
                radius,

            baseY:
                centerY +
                Math.sin(angle) *
                radius,

            size: rand(1, 3),

            phase: rand(
                0,
                Math.PI * 2
            ),

            gold: false,

            center: true

        });
    }


    /* ESTRELLAS */

    for (let i = 0; i < 100; i++) {

        stars.push({

            x: rand(0, W),

            y: rand(0, H),

            s: rand(0.5, 2.5),

            a: rand(0.2, 0.8)

        });
    }
}


/* =========================
   BRILLO
========================= */

function glowCircle(
    x,
    y,
    radius,
    color,
    alpha = 1
) {

    const gradient =
        ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            radius
        );


    gradient.addColorStop(
        0,
        color.replace(
            "ALPHA",
            alpha
        )
    );


    gradient.addColorStop(
        1,
        color.replace(
            "ALPHA",
            "0"
        )
    );


    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


/* =========================
   ANIMACIÓN
========================= */

function draw() {

    if (!running) {

        requestAnimationFrame(draw);

        return;
    }


    time += 0.016;


    /* FONDO */

    ctx.fillStyle = "#010101";

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /* BRILLO DETRÁS DE LA FLOR */

    glowCircle(
        W / 2,
        H * 0.38,
        Math.min(W, H) * 0.38,
        "rgba(255,180,0,ALPHA)",
        0.10
    );


    /* ESTRELLAS */

    for (const star of stars) {

        ctx.globalAlpha =
            star.a *
            (
                0.55 +
                0.45 *
                Math.sin(
                    time * 2 +
                    star.x
                )
            );


        ctx.fillStyle = "#ffd92f";


        ctx.fillRect(
            star.x,
            star.y,
            star.s,
            star.s
        );
    }


    /* POLVO */

    for (const particle of particles) {

        const y =
            particle.y +
            Math.sin(
                time * 1.4 +
                particle.tw
            ) *
            2;


        ctx.globalAlpha =
            particle.a;


        ctx.fillStyle =
            Math.random() < 0.08
                ? "#fff2ad"
                : "#d8ad18";


        ctx.fillRect(
            particle.x,
            y,
            particle.s,
            particle.s
        );
    }


    /* SOMBRA DE LA FLOR */

    ctx.globalAlpha = 0.28;

    ctx.fillStyle = "#f3c52b";

    ctx.beginPath();

    ctx.ellipse(
        W / 2,
        H * 0.53,
        Math.min(W, H) * 0.27,
        Math.min(W, H) * 0.035,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* PÉTALOS */

    for (const petal of petals) {

        const drift =
            Math.sin(
                time * 1.5 +
                petal.phase
            ) *
            1.8;


        ctx.globalAlpha =
            0.75 +
            0.2 *
            Math.sin(
                time * 2 +
                petal.phase
            );


        if (petal.center) {

            ctx.fillStyle =
                Math.random() < 0.45
                    ? "#160700"
                    : "#3b1300";

        } else {

            ctx.fillStyle =
                petal.gold
                    ? "#ffe500"
                    : "#ffd000";
        }


        ctx.fillRect(
            petal.x + drift,
            petal.y +
                Math.cos(
                    time +
                    petal.phase
                ) *
                1.5,
            petal.size,
            petal.size
        );
    }


    /* BRILLO DEL CENTRO */

    glowCircle(
        W / 2,
        H * 0.38,
        Math.min(W, H) * 0.11,
        "rgba(255,70,0,ALPHA)",
        0.28
    );


    ctx.globalAlpha = 1;


    requestAnimationFrame(draw);
}


/* =========================
   TOCAR LA PANTALLA
========================= */

canvas.addEventListener(
    "pointerdown",
    function(event) {

        for (let i = 0; i < 35; i++) {

            particles.push({

                x:
                    event.clientX +
                    rand(-35, 35),

                y:
                    event.clientY +
                    rand(-35, 35),

                s: rand(1, 3),

                a: 1,

                tw: rand(0, 7)

            });
        }

    }
);


/* =========================
   BOTÓN PLAY
========================= */

document.getElementById(
    "play"
).onclick = function() {

    running = !running;

    document.getElementById(
        "play"
    ).textContent =
        running
            ? "▶"
            : "Ⅱ";
};


/* =========================
   PANTALLA COMPLETA
========================= */

document.getElementById(
    "fullscreen"
).onclick = function() {

    if (!document.fullscreenElement) {

        document.documentElement
            .requestFullscreen?.();

    } else {

        document.exitFullscreen?.();

    }

};


/* =========================
   BOTÓN ABRIR
========================= */

document.getElementById(
    "reveal"
).onclick = function() {

    const message =
        document.querySelector(
            ".message"
        );


    message.style.opacity = "0.35";


    setTimeout(function() {

        message.style.opacity = "1";

    }, 700);

};


/* =========================
   INICIAR
========================= */

resize();

window.addEventListener(
    "resize",
    resize
);

draw();
```
