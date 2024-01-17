from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, login_user, logout_user, UserMixin, login_required, current_user
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, EmailField, SubmitField
from wtforms.validators import DataRequired, Length
from flask_bcrypt import Bcrypt
from flask_bs4 import Bootstrap
import os

# app configuration
app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config['SECRET_KEY'] = 'hjk97%^&*()UGBKL*&*(jk'
bcrypt = Bcrypt(app)

# database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data/users.sqlite')
db = SQLAlchemy(app)

# table in database
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(20))
    lastName = db.Column(db.String(30))
    userMail = db.Column(db.String(50), unique=True)
    userPass = db.String(db.String(50))

    def is_autentificated(self):
        return True

# Flask-Login configuration
loginManager = LoginManager()
loginManager.init_app(app)
loginManager.login_view = 'login'
loginManager.login_message = 'Nie jesteś zalogowany'
loginManager.login_message_category = 'warning'

@loginManager.user_loader
def loadUser(id):
    return Users.query.filter_by(id=id).first()

# forms
class LoginForm(FlaskForm):
    """ logging in form """
    userMail = EmailField('Mail', validators=[DataRequired()], render_kw={"placeholder": "Adres e-mail"})
    userPass = PasswordField('Password', validators=[DataRequired()], render_kw={"placeholder": "Hasło"})
    submit = SubmitField('Zaloguj')

class RegisterForm(FlaskForm):
    """ register form """
    firstName = StringField('FirstName', validators=[DataRequired()], render_kw={"placeholder": "Imię"})
    lastName = StringField('LastName', validators=[DataRequired()], render_kw={"placeholder": "Nazwisko"})
    userMail = EmailField('Mail', validators=[DataRequired()], render_kw={"placeholder": "Adres e-mail"})
    userPass = PasswordField('Password', validators=[DataRequired()], render_kw={"placeholder": "Hasło"})
    submit = SubmitField('Zarejestruj')

# main app
@app.route('/')
def index():
    return render_template('index.html', title='Home', headline='Zarządzanie użytkownikami')

@app.route('/login', methods=['GET', 'POST'])
def login():
    user = Users.query.all()
    if not user:
        return redirect(url_for('register'))
    login = LoginForm()
    return render_template('login.html', title='Logowanie', headline='Logowanie', form=login)

@app.route('/register', methods=['GET', 'POST'])
def register():
    register = RegisterForm()
    if register.validate_on_submit():
        try:
            hashedPass = bcrypt.generate_password_hash(register.userPass.data)
            newUser = Users(userMail=register.userMail.data, userPass=hashedPass, firstName=register.firstName.data,
                            lastName=register.lastName.data)
            db.session.add(newUser)
            db.session.commit()
            flash('Konto utworzone poprawnie', 'success')
            return redirect(url_for('login'))
        except Exception:
            flash('Nazwa użytkownika istnieje. Proszę wybrać inną.', 'danger')
    return render_template('register.html', title='Rejestracja', headline='Rejestracja', form=register)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)