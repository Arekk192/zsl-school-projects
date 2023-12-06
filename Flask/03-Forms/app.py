from flask import Flask, render_template
from flask_bs4 import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired

# konfiguracja aplikacji
app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config['SECRET_KEY'] = 'ghjkGHJ%^&*Fghj56&FGH%^&*vbj5678' # klucz szyfrowania danych z formularza

class LoginForm(FlaskForm):
    """
    Formularz logowania
    """

    userLogin = StringField('Nazwa użytkownika:', validators=[DataRequired()])
    userPass = PasswordField('Hasło:', validators=[DataRequired()])
    submit = SubmitField('Zaloguj')

users = {
    'userLogin': 'askupien',
    'userPass': 'Qwerty123!',
    'firstName': 'Arkadiusz',
    'lastName': 'Skupień'
}

# główna część aplikacji
@app.route('/')
def index():
    return render_template('index.html', title="Home")

@app.route('/login', methods=["POST", "GET"])
def login():
    login = LoginForm()
    return render_template('login.html', title="Logowanie", login=login)

# uruchomienie aplikacji
if __name__ == '__main__':
    app.run(debug=True)