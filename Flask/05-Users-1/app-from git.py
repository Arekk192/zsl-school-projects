from flask import Flask, render_template, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_wtf import FlaskForm
from sqlalchemy.testing.pickleable import User
from wtforms import StringField, PasswordField, EmailField, SubmitField
from wtforms.validators import DataRequired, Length
from flask_bcrypt import Bcrypt
from flask_bs4 import Bootstrap
import os

# konfiguracja aplikacji
app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config['SECRET_KEY'] = 'hjk97%^&*()UGBKL*&*(jk'
bcrypt = Bcrypt(app)

# konfiguracja bazy danych
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data/users.sqlite')
db = SQLAlchemy(app)

# tabela w bazie danych
class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(20))
    lastName = db.Column(db.String(30))
    userMail = db.Column(db.String(50), unique=True)
    userPass = db.Column(db.String(50))

    def is_authenticated(self):
        return True

# konfiguracja Flask-Login
loginManager = LoginManager()
loginManager.init_app(app)
loginManager.login_view = 'login'
loginManager.login_message = 'Nie jesteś zalogowany'
loginManager.login_message_category = 'warning'

@loginManager.user_loader
def loadUser(id):
    return Users.query.filter_by(id=id).first()

# formularze
class Register(FlaskForm):
    """formularz rejestracji"""
    firstName = StringField('Imię', validators=[DataRequired()], render_kw={"placeholder": "Imię"})
    lastName = StringField('Nazwisko', validators=[DataRequired()], render_kw={"placeholder": "Nazwisko"})
    userMail = EmailField('Mail', validators=[DataRequired()], render_kw={"placeholder": "Mail"})
    userPass = PasswordField('Hasło', validators=[DataRequired()], render_kw={"placeholder": "Hasło"})
    submit = SubmitField('Rejestruj')

class Login(FlaskForm):
    """formularz logowania"""
    userMail = EmailField('Mail', validators=[DataRequired()], render_kw={"placeholder": "Mail"})
    userPass = PasswordField('Hasło', validators=[DataRequired()], render_kw={"placeholder": "Hasło"})
    submit = SubmitField('Zaloguj')

# główna apliakacja
@app.route('/')
def index():
    return render_template('index.html', title='Home', headline='Zarządzanie użytkownikami')

@app.route('/dashboard')
@login_required
def dashboard():
    addUser = Register()
    users = Users.query.all()
    return render_template('dashboard.html', title='Dashboard', users=users, addUser=addUser)

@app.route('/add-user', methods=['GET', 'POST'])
@login_required
def addUser():
    addUser = Register()
    if addUser.validate_on_submit():
        try:
            hashPass = bcrypt.generate_password_hash(addUser.userPass.data)
            newUser = Users(userMail=addUser.userMail.data, userPass=hashPass, firstName=addUser.firstName.data, lastName=addUser.lastName.data)
            db.session.add(newUser)
            db.session.commit()
            flash('Konto utworzone poprawnie', 'success')
            return redirect(url_for('dashboard'))
        except Exception:
            flash('Taki adres mail istnieje, proszę wpisać inny.', 'danger')
    return redirect(url_for('dashboard'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    user = Users.query.all()
    if not user:
        return redirect(url_for('register'))
    else:
        login = Login()
        if login.validate_on_submit():
            user = Users.query.filter_by(userMail=login.userMail.data).first()
            if user:
                if bcrypt.check_password_hash(user.userPass, login.userPass.data):
                    login_user(user)
                    return redirect(url_for('dashboard'))
    return render_template('login.html', title='Logowanie', headline='Logowanie', login=login)

@app.route('/register', methods=['GET', 'POST'])
def register():
    register = Register()
    if register.validate_on_submit():
        try:
            hashedPass = bcrypt.generate_password_hash(register.userPass.data)
            newUser = Users(userMail=register.userMail.data, userPass=hashedPass, firstName=register.firstName.data, lastName=register.lastName.data)
            db.session.add(newUser)
            db.session.commit()
            flash('Konto utworzone poprawnie', 'success')
            return redirect(url_for('login'))
        except Exception:
            flash('Taki adres mail już istnieje, wpisz inny.', 'danger')
    return render_template('register.html', title='Rejestracja', headline='Rejestracja', register=register)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)