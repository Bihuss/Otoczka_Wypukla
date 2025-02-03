from flask import Blueprint, render_template, request, jsonify
from .convex_hull import calculate_convex_hull

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/convex-hull', methods=['POST'])
def convex_hull():
    try:
        points = request.json.get('points')
        if not points:
            return jsonify({"error": "No points provided"}), 400

        result, error = calculate_convex_hull(points)
        if error:
            return jsonify({"error": error}), 400

        return jsonify(result)  # Zwracanie danych w JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500
