// Globalne zmienne
let showGrid = false; // Domyślnie siatka jest wyłączona
let currentPoints = []; // Przechowuje wszystkie punkty
let currentHull = []; // Przechowuje punkty otoczki
let resultDisplayed = false; //Flaga monitorująca czy wynik został wyświetlony

// Funkcja do rysowania siatki
function drawGrid(ctx, width, height) {
    if (showGrid) {
        ctx.strokeStyle = "#cccccc"; // Kolor siatki
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y <= height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }
}

// Funkcja do odświeżania canvas
function redrawCanvas() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rysowanie siatki, jeśli jest włączona
    drawGrid(ctx, canvas.width, canvas.height);

    // Rysowanie punktów
    currentPoints.forEach(([x, y]) => {
        ctx.fillStyle = "violet";
        ctx.beginPath();
        ctx.arc(x * 10, canvas.height - y * 10, 5, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Rysowanie otoczki wypukłej
    if (currentHull.length > 0) {
        ctx.strokeStyle = "#6A1B9A";
        ctx.lineWidth = 2;
        ctx.beginPath();
        currentHull.forEach(([x, y], index) => {
            const scaleX = x * 10;
            const scaleY = canvas.height - y * 10;
            if (index === 0) ctx.moveTo(scaleX, scaleY);
            else ctx.lineTo(scaleX, scaleY);
        });
        ctx.closePath();
        ctx.stroke();
    }
}

function drawOnlyConvex() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rysowanie siatki, jeśli jest włączona
    drawGrid(ctx, canvas.width, canvas.height);

    // Rysowanie punktów
    currentHull.forEach(([x, y]) => {
        ctx.fillStyle = "violet";
        ctx.beginPath();
        ctx.arc(x * 10, canvas.height - y * 10, 5, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Rysowanie otoczki wypukłej
    if (currentHull.length > 0) {
        ctx.strokeStyle = "#6A1B9A";
        ctx.lineWidth = 2;
        ctx.beginPath();
        currentHull.forEach(([x, y], index) => {
            const scaleX = x * 10;
            const scaleY = canvas.height - y * 10;
            if (index === 0) ctx.moveTo(scaleX, scaleY);
            else ctx.lineTo(scaleX, scaleY);
        });
        ctx.closePath();
        ctx.stroke();
    }
}

// Funkcja do aktualizacji wyników w interfejsie
function updateResults(data) {
    const resultsContainer = document.getElementById("results-list");
    const hull_type = data.hull_type;

    // Dodajmy debugowanie
    console.log("Otrzymane dane z serwera:", data);

    // Sprawdź, czy dane są poprawne
    if (!hull_type) {
        console.error("Nieprawidłowa odpowiedź z serwera:", data);
        resultsContainer.innerHTML = `<li class="list-group-item text-danger">Nieprawidłowe dane z serwera</li>`;
        return;
    }

    // Aktualizacja wyników w liście
    resultsContainer.innerHTML = `
        <p>Informacje o otoczce:</p>
        <li class="list-group-item">Rodzaj otoczki: ${hull_type}</li>
        <li class="list-group-item">Punkty tworzące otoczkę: ${currentHull.map(point => point.join(",")).join("; ")}</li>
    `;
}

async function calculateConvexHull() {
    // Parsowanie punktów z pola tekstowego
    const pointsInput = document.getElementById("points").value.trim();
    if (pointsInput) {
        currentPoints = pointsInput.split(";").map(p => {
            const [x, y] = p.split(",").map(Number);
            return [x, y];
        });

        // Walidacja punktów wprowadzonego tekstu
        if (currentPoints.some(p => p.length !== 2 || p.some(isNaN))) {
            alert("Upewnij się, że punkty są w formacie x,y;x,y...");
            return;
        }
    }

    // Sprawdzenie, czy są jakiekolwiek punkty
    if (currentPoints.length === 0) {
        alert("Wprowadź punkty przed obliczeniem otoczki!");
        return;
    }

    try {
        // Wysłanie żądania do serwera
        const response = await fetch('/convex-hull', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ points: currentPoints })
        });

        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        // Zaktualizowanie otoczki i wyników
        currentHull = data.hull;
        redrawCanvas();
        updateResults(data);
    } catch (error) {
        console.error("Błąd podczas komunikacji z serwerem:", error);
        alert("Wystąpił błąd podczas obliczeń.");
    }
}



// Obsługa formularza
document.getElementById("points-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const pointsInput = document.getElementById("points").value;
    currentPoints = pointsInput.split(";").map(p => {
        const [x, y] = p.split(",").map(Number);
        return [x, y];
    });

    if (currentPoints.some(p => p.length !== 2 || p.some(isNaN))) {
        alert("Upewnij się, że punkty są w formacie x,y;x,y...");
        return;
    }

    await calculateConvexHull();
});

// Obsługa kliknięcia w canvas (dodanie punktu)
document.getElementById("canvas").addEventListener("click", (e) => {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 10);
    const y = Math.floor((canvas.height - (e.clientY - rect.top)) / 10);

    // Dodawanie punktu do listy
    currentPoints.push([x, y]);

    // Aktualizacja pola tekstowego
    const pointsInput = document.getElementById("points");
    pointsInput.value = currentPoints.map(p => p.join(",")).join(";");

    // Odświeżenie canvas
    redrawCanvas();
});

// Obsługa przycisku "Pokaż/Użyj Siatkę"
document.getElementById("toggle-grid").addEventListener("click", function () {
    showGrid = !showGrid;
    redrawCanvas();

    const icon = this.querySelector("i");
    const text = this.querySelector("span");

    if (showGrid) {
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
        text.textContent = "Ukryj siatkę";
    } else {
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
        text.textContent = "Pokaż siatkę";
    }
});

// Obsługa przycisku "Oblicz otoczkę"
document.getElementById("calculate-button").addEventListener("click", async function () {
    await calculateConvexHull();
    resultDisplayed = true;
    showOrHideButtons();
});

//Obsługa przycisku "tylko otoczka"
document.getElementById("only-convex").addEventListener("click", function () {
     drawOnlyConvex();
});

// Obsługa przycisku "Oblicz otoczkę"
document.getElementById("all-points").addEventListener("click", function () {
    calculateConvexHull();
});

// Obsługa przycisku "Wyczyść wszystko"
document.getElementById("clear-all").addEventListener("click", () => {
    currentPoints = [];
    currentHull = [];
    document.getElementById("points").value = "";
    document.getElementById("results-list").innerHTML = ""; // Czyszczenie wyników
    redrawCanvas();
    resultDisplayed = false;
    showOrHideButtons();
});

//Pokaż/ukryj przyciski "pokaż tylko otoczkę", "pokaż wszystkie punkty"
function showOrHideButtons(){
    if (resultDisplayed && currentPoints.length > 0) {
        document.getElementById("only-convex").style.display = "block";
        document.getElementById("all-points").style.display = "block";
        console.log("showHideButtons");
    } else {
        document.getElementById("only-convex").style.setProperty("display", "none", "important");
        document.getElementById("all-points").style.setProperty("display", "none", "important");
        console.log("showHideButtons");
    }
}


// Obsługa wyświetlania współrzędnych myszy
document.getElementById("canvas").addEventListener("mousemove", (e) => {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 10);
    const y = Math.floor((canvas.height - (e.clientY - rect.top)) / 10);

    const coordinateLabel = document.getElementById("coordinate-label");
    coordinateLabel.style.left = `${e.clientX + 10}px`;
    coordinateLabel.style.top = `${e.clientY + 10}px`;
    coordinateLabel.textContent = `(${x}, ${y})`;
    coordinateLabel.style.display = "block";
});

// Ukrywanie współrzędnych po opuszczeniu canvas
document.getElementById("canvas").addEventListener("mouseleave", () => {
    const coordinateLabel = document.getElementById("coordinate-label");
    coordinateLabel.style.display = "none";
});