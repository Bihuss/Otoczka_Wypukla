import numpy as np  # Import biblioteki NumPy do operacji na tablicach

def calculate_convex_hull(points):
    try:
        # Konwersja listy punktów na tablicę NumPy i sprawdzenie, czy dane są liczbami
        points = np.array(points, dtype=float)
    except ValueError:
        # Obsługa błędu w przypadku niepoprawnych danych wejściowych (np. liter zamiast liczb)
        return None, "Nieprawidłowe dane wejściowe"

    # Sprawdzenie, czy punkty mają dokładnie dwie współrzędne (x, y)
    if points.shape[1] != 2:
        return None, "Dane wejściowe muszą zawierać współrzędne x i y"

    # Sprawdzenie, czy przekazano jakiekolwiek punkty
    if len(points) == 0:
        return None, "Brak punktów do obliczenia otoczki"

    # Usunięcie duplikatów, aby uniknąć błędnej klasyfikacji punktów jako odcinka
    points = np.unique(points, axis=0)

    # Jeżeli po usunięciu duplikatów został tylko jeden punkt, zwróć wynik jako "Punkt"
    if len(points) == 1:
        return {"hull": points.tolist(), "hull_type": "Punkt"}, None

    # Jeżeli po usunięciu duplikatów są dokładnie dwa punkty, zwróć wynik jako "Odcinek"
    if len(points) == 2:
        return {"hull": points.tolist(), "hull_type": "Odcinek"}, None

    # **Algorytm Andrewsa do obliczania otoczki wypukłej**

    # Sortowanie punktów: najpierw według x, a jeśli x są równe, to według y
    points = points[np.lexsort((points[:, 1], points[:, 0]))]

    # Funkcja do obliczania iloczynu wektorowego (sprawdza, czy punkt b jest po lewej, czy po prawej stronie odcinka oa)
    def cross_product(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    # Budowanie dolnej części otoczki wypukłej (lower hull)
    lower = []
    for p in points:
        while len(lower) >= 2 and cross_product(lower[-2], lower[-1], p) <= 0:
            lower.pop()  # Usunięcie punktu, jeśli nie jest częścią otoczki
        lower.append(tuple(p))

    # Budowanie górnej części otoczki wypukłej (upper hull)
    upper = []
    for p in reversed(points):
        while len(upper) >= 2 and cross_product(upper[-2], upper[-1], p) <= 0:
            upper.pop()  # Usunięcie punktu, jeśli nie jest częścią otoczki
        upper.append(tuple(p))

    # Połączenie górnej i dolnej części otoczki, usuwając powielony pierwszy/ostatni punkt
    hull = lower[:-1] + upper[:-1]

    # Określenie typu otoczki w zależności od liczby punktów
    if len(hull) == 1:
        hull_type = "Punkt"
    elif len(hull) == 2:
        hull_type = "Odcinek"
    elif len(hull) == 3:
        hull_type = "Trójkąt"
    else:
        hull_type = f"{len(hull)}-kąt wypukły"  # Określenie wielokąta wypukłego

    # Zwrócenie wyniku w formacie JSON, zawierającego punkty otoczki i jej typ
    return {"hull": hull, "hull_type": hull_type}, None