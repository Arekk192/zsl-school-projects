from flask import Flask, render_template, redirect, url_for, flash, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_wtf import FlaskForm
from sqlalchemy.testing.pickleable import User
from wtforms import StringField, PasswordField, EmailField, SubmitField, SelectField, FileField, HiddenField
from wtforms.validators import DataRequired, Length
from flask_wtf.file import FileAllowed
from flask_bcrypt import Bcrypt
from flask_bs4 import Bootstrap
import os
from werkzeug.utils import secure_filename
from datetime import datetime

# login: askupien@mail.com
# password: 123

# zaległe zadanie:
# zmiana hasła w navbar dashboard z lewej strony jako user
# podaj stare hasło, nowe
# jesli wszystko git to zmien haslo

# app config
app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config['SECRET_KEY'] = 'hjk97%^&*()UGBKL*&*(jk'
bcrypt = Bcrypt(app)
app.config['UPLOAD_PATH'] = 'uploads'
app.config['UPLOAD_EXTENSIONS'] = ['.txt', '.jpg', '.png', '.jpeg']
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16MB

# database config
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data/users.sqlite')
db = SQLAlchemy(app)

#region database tables
class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(20))
    lastName = db.Column(db.String(30))
    userMail = db.Column(db.String(50), unique=True)
    userPass = db.Column(db.String(50))
    userRole = db.Column(db.String(20))

    def is_authenticated(self):
        return True

class Files(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fileName = db.Column(db.String(50), unique=True)
    size = db.Column(db.String(20))
    type = db.Column(db.String(20))
    icon = db.Column(db.String(20))
    time = db.Column(db.String(20))

class Folders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    folderName = db.Column(db.String(50), unique=True)
    type = db.Column(db.String(20))
    icon = db.Column(db.String(20))
    time = db.Column(db.String(20))
#endregion

# Flask-Login config
loginManager = LoginManager()
loginManager.init_app(app)
loginManager.login_view = 'login'
loginManager.login_message = 'Nie jesteś zalogowany'
loginManager.login_message_category = 'warning'

@loginManager.user_loader
def loadUser(id):
    return Users.query.filter_by(id=id).first()

#region forms
class Register(FlaskForm):
    """register form"""
    firstName = StringField('Imię', validators=[DataRequired()], render_kw={"placeholder": "Imię"})
    lastName = StringField('Nazwisko', validators=[DataRequired()], render_kw={"placeholder": "Nazwisko"})
    userMail = EmailField('Mail', validators=[DataRequired()], render_kw={"placeholder": "Mail"})
    userPass = PasswordField('Hasło', validators=[DataRequired()], render_kw={"placeholder": "Hasło"})
    userRole = SelectField('Uprawnienia', validators=[DataRequired()], choices=[
        ('user', 'Użytkownik'), ('admin', 'Administrator'), ], render_kw={"placeholder": "Uprawnienia"})
    submit = SubmitField('Rejestruj')

class Login(FlaskForm):
    """log in form"""
    userMail = EmailField('Mail', validators=[DataRequired()], render_kw={"placeholder": "Mail"})
    userPass = PasswordField('Hasło', validators=[DataRequired()], render_kw={"placeholder": "Hasło"})
    submit = SubmitField('Zaloguj')

class Add(FlaskForm):
    """add user form"""
    firstName = StringField('Imię', validators=[DataRequired()], render_kw={"placeholder": "Imię"})
    lastName = StringField('Nazwisko', validators=[DataRequired()], render_kw={"placeholder": "Nazwisko"})
    userMail = EmailField('Mail', validators=[DataRequired()], render_kw={"placeholder": "Mail"})
    userPass = PasswordField('Hasło', validators=[DataRequired()], render_kw={"placeholder": "Hasło"})
    userRole = SelectField('Uprawnienia', validators=[DataRequired()], choices=[('user', 'Użytkownik'), ('admin', 'Administrator')])
    submit = SubmitField('Dodaj')

class Edit(FlaskForm):
    """edit user data form"""
    firstName = StringField('Imię', validators=[DataRequired()], render_kw={"placeholder": "Imię"})
    lastName = StringField('Nazwisko', validators=[DataRequired()], render_kw={"placeholder": "Nazwisko"})
    userMail = EmailField('Mail', validators=[DataRequired()], render_kw={"placeholder": "Mail"})
    userRole = SelectField('Uprawnienia', validators=[DataRequired()], choices=[('user', 'Użytkownik'), ('admin', 'Administrator')])
    submit = SubmitField('Zapisz')

class Password(FlaskForm):
    """change user password form"""
    userMail = EmailField('Mail:', validators=[DataRequired(), Length(min=3, max=50)], render_kw={"placeholder": "Mail", "readonly": True})
    userPass = PasswordField('Bieżące hasło:', validators=[DataRequired(), Length(min=3, max=50)], render_kw={"placeholder": "Bieżące hasło"})
    newUserPass = PasswordField('Nowe hasło:', validators=[DataRequired(), Length(min=3, max=50)], render_kw={"placeholder": "Nowe hasło"})
    submit = SubmitField('Zapisz')

class ChangePass(FlaskForm):
    """change user password form from admin dashboard"""
    userPass = PasswordField('Nowe hasło:', validators=[DataRequired(), Length(min=3, max=50)], render_kw={"placeholder": "Nowe hasło"})
    submit = SubmitField('Zapisz')

class Search(FlaskForm):
    """search directories and files form"""
    searchKey = StringField("Szukaj", validators=[DataRequired()])
    submit = SubmitField('Szukaj')

class CreateFolders(FlaskForm):
    """make directory form"""
    folderName = StringField("Nazwa folderu", validators=[DataRequired()], render_kw={'placeholder': 'Nazwa folderu'})
    submit = SubmitField('Utwórz')

class UploadFiles(FlaskForm):
    """upload files form"""
    fileName = FileField('Plik', validators=[FileAllowed('.txt, .jpg, .png, .jpeg')], render_kw={'placeholder': '.txt, .jpg, .png, .jpeg'})
    submit = SubmitField('Prześlij')

class RenameFolder(FlaskForm):
    """rename folder form"""
    newFolderName = StringField("Nowa nazwa folderu", validators=[DataRequired()])
    submit = SubmitField('Zmień nazwę')

#endregion

# główna aplikacja
@app.route('/')
def index():
    return render_template('index.html', title='Home', headline='Zarządzanie użytkownikami')

@app.route('/dashboard')
@login_required
def dashboard():
    addUser = Add()
    editUser = Edit()
    editUserPass = ChangePass()
    search = Search()
    createFolder = CreateFolders()
    uploadFile = UploadFiles()
    users = Users.query.all()
    files = Files.query.all()
    folders = Folders.query.all()
    renameFolder = RenameFolder()
    return render_template('dashboard.html', title='Dashboard', users=users, addUser=addUser, editUser=editUser,
                           editUserPass=editUserPass, search=search, createFolder=createFolder, uploadFile=uploadFile, files=files,
                           folders=folders, renameFolder=renameFolder)

#region add, edit, delete user
@app.route('/add-user', methods=['GET', 'POST'])
@login_required
def addUser():
    addUser = Add()
    if addUser.validate_on_submit():
        try:
            hashPass = bcrypt.generate_password_hash(addUser.userPass.data)
            newUser = Users(userMail=addUser.userMail.data, userPass=hashPass, firstName=addUser.firstName.data,
                            lastName=addUser.lastName.data, userRole=addUser.userRole.data)
            db.session.add(newUser)
            db.session.commit()
            flash('Konto utworzone poprawnie', 'success')
            return redirect(url_for('dashboard'))
        except Exception:
            flash('Taki adres mail istnieje, proszę wpisać inny.', 'danger')
    return redirect(url_for('dashboard'))


@app.route('/edit-user<int:id>', methods=['GET', 'POST'])
@login_required
def editUser(id):
    editUser = Edit()
    user = Users.query.get_or_404(id)
    if editUser.validate_on_submit():
        user.firstName = editUser.firstName.data
        user.lastName = editUser.lastName.data
        user.userMail = editUser.userMail.data
        user.userRole = editUser.userRole.data
        db.session.commit()
        flash('Dane zapisane poprawnie', 'success')
        return redirect(url_for('dashboard'))

# zmiana hasła po id użytkownika
@app.route('/edit-user-pass<int:id>', methods=['GET', 'POST'])
@login_required
def editUserPass(id):
    editUserPass = ChangePass()
    user = Users.query.get_or_404(id)
    if editUserPass.validate_on_submit():
        user.userPass = bcrypt.generate_password_hash(editUserPass.userPass.data)
        db.session.commit()
        flash('Hasło zmienione poprawnie', 'success')
        return redirect(url_for('dashboard'))

# zmiana hasła po mailu użytkownika
# @app.route('/edit-user-pass', methods=['GET', 'POST'])
# @login_required
# def editUserPass():
#     editUserPass = Register()
#     user = Users.query.filter_by(userMail=editUserPass.userMail.data).first()
#     if editUserPass.validate_on_submit():
#         user.userPass = bcrypt.generate_password_hash(editUserPass.userPass.data)
#         db.session.commit()
#         flash('Hasło zmienione poprawnie', 'success')
#         return redirect(url_for('dashboard'))

@app.route('/delete-user', methods=['GET', 'POST'])
@login_required
def deleteUser():
    if request.method == 'GET':
        id = request.args.get('id')
        user = Users.query.filter_by(id=id).one()
        db.session.delete(user)
        db.session.commit()
        flash('Użytkownik usunięty poprawnie', 'success')
        return redirect(url_for('dashboard'))

@app.route('/change-pass', methods=['GET', 'POST'])
@login_required
def changePass():
    changePassForm = Password()
    if changePassForm.validate_on_submit():
        user = Users.query.filter_by(userMail=changePassForm.userMail.data).first()
        if user:
            if bcrypt.check_password_hash(user.userPass, changePassForm.userPass.data):
                user.userPass = bcrypt.generate_password_hash(changePassForm.newUserPass.data)
                db.session.commit()
                flash('Hasło zostało zmienione', 'success')
                return redirect(url_for('dashboard'))
    return render_template('change-pass.html', title='Zmiana hasła', changePassForm=changePassForm)
#endregion

#region login, register, logout
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
    user = Users.query.all()
    if register.validate_on_submit() and not user:
        try:
            hashedPass = bcrypt.generate_password_hash(register.userPass.data)
            newUser = Users(userMail=register.userMail.data, userPass=hashedPass, firstName=register.firstName.data, lastName=register.lastName.data, userRole='admin')
            db.session.add(newUser)
            db.session.commit()
            flash('Konto utworzone poprawnie', 'success')
            return redirect(url_for('login'))
        except Exception:
            flash('Taki adres mail już istnieje, wpisz inny.', 'danger')
    else:
        try:
            hashedPass = bcrypt.generate_password_hash(register.userPass.data)
            newUser = Users(userMail=register.userMail.data, userPass=hashedPass, firstName=register.firstName.data, lastName=register.lastName.data, userRole='user')
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
#endregion

# region files, directories
@app.route('/upload-file', methods=['GET', 'POST'])
@login_required
def uploadFile():
    uploadedFile = request.files['fileName']
    fileName = secure_filename(uploadedFile.filename)
    if fileName != '':
        fileExtension = os.path.splitext(fileName)[1]
        if fileExtension not in app.config['UPLOAD_EXTENSIONS']:
            abort(400)
        if fileExtension == '.png':
            uploadedFile.save(os.path.join(app.config['UPLOAD_PATH'], fileName))
            fileSize = ''
            now = datetime.now()
            newFile = Files(fileName=fileName, type='png', size=fileSize, icon='bi bi-filetype-png', time=now.strftime("%d/%m/%Y %H:%M:%S"))
            db.session.add(newFile)
            db.session.commit()
            flash('Plik przesłany poprawnie', 'success')
        return redirect(url_for('dashboard'))

@app.route('/create-folder', methods=['GET', 'POST'])
@login_required
def createFolder():
    folderName = request.form['folderName']
    if folderName != '':
        os.mkdir(os.path.join(app.config['UPLOAD_PATH'], folderName))
        now = datetime.now()
        newFolder = Folders(folderName=folderName, type='folder', icon='bi bi-folder', time=now.strftime("%d/%m/%Y %H:%M:%S"))
        db.session.add(newFolder)
        db.session.commit()
        flash('Folder utworzony pomyślnie', 'success')
        return redirect(url_for('dashboard'))

@app.route('/rename-folder<int:id>', methods=['GET', 'POST'])
@login_required
def renameFolder(id):
    renameFolderForm = RenameFolder()
    folder = Folders.query.get_or_404(id)
    oldName = folder.folderName
    newName = renameFolderForm.newFolderName.data

    if renameFolderForm.validate_on_submit():
        os.rename(os.path.join(app.config['UPLOAD_PATH'], oldName), os.path.join(app.config['UPLOAD_PATH'], newName))
        folder.folderName = newName
        db.session.commit()
        flash('Nazwa folderu zmieniona poprawnie', 'success')
    else:
        flash('Nazwa folderu nie zmieniona', 'success')
    return redirect(url_for('dashboard'))

@app.route('/delete-folder<int:id>', methods=['GET', 'POST'])
@login_required
def deleteFolder(id):
    if id:
        folder = Folders.query.get_or_404(id)
        os.rmdir(os.path.join(app.config['UPLOAD_PATH'], folder.folderName))
        db.session.delete(folder)
        db.session.commit()
        flash('Folder usunięty pomyślnie', 'success')
    return redirect(url_for('dashboard'))
# endregion

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)