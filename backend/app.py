from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database import db
from routes.notes import notes_bp
from routes.auth import auth_bp

app = Flask(__name__)

# JWT config
app.config["JWT_SECRET_KEY"] = "super-secret-key-change-later"
jwt = JWTManager(app)
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True
)

app.register_blueprint(notes_bp)
app.register_blueprint(auth_bp)
@app.route('/')
def home():  # put application's code here
    return {"message": "Flask is running", "db": str(db.name)}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
