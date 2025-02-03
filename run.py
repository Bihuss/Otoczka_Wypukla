from app import create_app  # Importowanie funkcji tworzącej aplikację Flask

# Tworzenie instancji aplikacji
app = create_app()

# Uruchomienie aplikacji, jeśli skrypt jest uruchamiany bezpośrednio
if __name__ == "__main__":
    app.run(debug=True)  # Uruchamia aplikację w trybie debugowania (automatyczne przeładowanie, widoczne błędy)