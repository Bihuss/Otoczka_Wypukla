# Otoczka Wypukła

## Opis projektu
Projekt implementuje algorytm obliczania otoczki wypukłej dla zbioru punktów na płaszczyźnie. Jest to aplikacja webowa oparta na technologii Flask oraz JavaScript, umożliwiająca interaktywne dodawanie punktów i wizualizację wyników.

## Funkcjonalności
- Wprowadzanie współrzędnych punktów manualnie lub poprzez kliknięcie na canvas.
- Obliczanie otoczki wypukłej przy użyciu algorytmu łańcucha monotonicznego Andrew.
- Wizualizacja wyników na stronie internetowej.
- Obsługa różnych trybów wyświetlania punktów.
- Walidacja danych wejściowych.
- Możliwość zapisania obrazu otoczki jako plik PNG.

## Technologie
- **Backend:** Python (Flask)
- **Frontend:** HTML, CSS, JavaScript
- **Biblioteki:** NumPy (do obliczeń), Bootstrap (stylizacja UI)

## Struktura projektu
```
├── app/
│   ├── __init__.py  # Inicjalizacja aplikacji Flask
│   ├── routes.py    # Obsługa tras HTTP
│   ├── convex_hull.py # Implementacja algorytmu otoczki wypukłej
│   ├── run.py       # Uruchomienie serwera Flask
│   ├── requirements.txt # Lista zależności Pythona
│
├── static/
│   ├── css/
│   │   ├── style.css  # Arkusz stylów
│   ├── js/
│   │   ├── script.js  # Obsługa interakcji
│
├── templates/
│   ├── index.html   # Główny interfejs użytkownika
│
└── venv/            # Wirtualne środowisko Pythona
```

## Instalacja i uruchomienie
```
# Sklonuj repozytorium
git clone https://github.com/twoje-repozytorium.git
cd twoje-repozytorium

# Utwórz i aktywuj wirtualne środowisko
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Zainstaluj wymagane biblioteki
pip install -r app/requirements.txt

# Uruchom aplikację
python app/run.py
```

Otwórz przeglądarkę i przejdź do `http://127.0.0.1:5000/`.

## Autorzy
- **Maciej Król**
- **Konrad Lubaski**
- **Michał Bichajło**
- **Mateusz Latusek**

## Licencja
Ten projekt jest udostępniany na licencji **MIT**.

