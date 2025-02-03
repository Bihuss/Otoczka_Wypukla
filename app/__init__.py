from flask import Flask  # Importuje klasę Flask, która jest podstawą aplikacji

def create_app():
    """Funkcja tworząca instancję aplikacji Flask."""
    
    app = Flask(__name__)  # Tworzy obiekt aplikacji Flask

    # Importuje blueprint (zdefiniowane trasy w pliku routes.py)
    from .routes import main as main_blueprint
    
    # Rejestruje blueprint w aplikacji, co pozwala na organizację tras w osobnych modułach
    app.register_blueprint(main_blueprint)

    return app  # Zwraca utworzoną aplikację Flask