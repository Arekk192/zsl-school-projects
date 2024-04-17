from flask import Flask, render_template, redirect, url_for, flash, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, EmailField, SubmitField, SelectField, FileField
from wtforms.validators import DataRequired, Length
from flask_wtf.file import FileAllowed
from flask_bcrypt import Bcrypt
from flask_bs4 import Bootstrap
import os
from werkzeug.utils import secure_filename
from datetime import datetime

# login: askupien@mail.com
# password: 123

# app config
app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config['SECRET_KEY'] = 'hjk97%^&*()UGBKL*&*(jk'
bcrypt = Bcrypt(app)
app.config['UPLOAD_PATH'] = 'uploads'
app.config['UPLOAD_EXTENSIONS'] = ['.txt', '.jpg', '.png', '.jpeg']
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

# database config
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data/users.sqlite')
db = SQLAlchemy(app)

#region Database tables
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


#region Forms
class Register(FlaskForm):
    """Register form"""
    firstName = StringField('Imię', validators=[DataRequired()], render_kw={"placeholder": "Imię"})
    lastName = StringField('Nazwisko', validators=[DataRequired()], render_kw={"placeholder": "Nazwisko"})
    userMail = EmailField('Mail', validators=[DataRequired()], render_kw={"placeholder": "Mail"})
    userPass = PasswordField('Hasło', validators=[DataRequired()], render_kw={"placeholder": "Hasło"})
    userRole = SelectField('Uprawnienia', validators=[DataRequired()], choices=[
        ('user', 'Użytkownik'), ('admin', 'Administrator'), ], render_kw={"placeholder": "Uprawnienia"})
    submit = SubmitField('Rejestruj')

class Login(FlaskForm):
    """Log in form"""
    userMail = EmailField('Mail', validators=[DataRequired()], render_kw={"placeholder": "Mail"})
    userPass = PasswordField('Hasło', validators=[DataRequired()], render_kw={"placeholder": "Hasło"})
    submit = SubmitField('Zaloguj')

class Add(FlaskForm):
    """Add user form"""
    firstName = StringField('Imię', validators=[DataRequired()], render_kw={"placeholder": "Imię"})
    lastName = StringField('Nazwisko', validators=[DataRequired()], render_kw={"placeholder": "Nazwisko"})
    userMail = EmailField('Mail', validators=[DataRequired()], render_kw={"placeholder": "Mail"})
    userPass = PasswordField('Hasło', validators=[DataRequired()], render_kw={"placeholder": "Hasło"})
    userRole = SelectField('Uprawnienia', validators=[DataRequired()],
                           choices=[('user', 'Użytkownik'), ('admin', 'Administrator')])
    submit = SubmitField('Dodaj')

class Edit(FlaskForm):
    """Edit user data form"""
    firstName = StringField('Imię', validators=[DataRequired()], render_kw={"placeholder": "Imię"})
    lastName = StringField('Nazwisko', validators=[DataRequired()], render_kw={"placeholder": "Nazwisko"})
    userMail = EmailField('Mail', validators=[DataRequired()], render_kw={"placeholder": "Mail"})
    userRole = SelectField('Uprawnienia', validators=[DataRequired()],
                           choices=[('user', 'Użytkownik'), ('admin', 'Administrator')])
    submit = SubmitField('Zapisz')

class ChangePassword(FlaskForm):
    """Change user password form"""
    # userMail = EmailField('Mail:', validators=[DataRequired(), Length(min=3, max=50)], render_kw={"placeholder": "Mail", "readonly": True})
    userPass = PasswordField('Bieżące hasło:', validators=[DataRequired(), Length(min=3, max=50)],
                             render_kw={"placeholder": "Bieżące hasło"})
    newUserPass = PasswordField('Nowe hasło:', validators=[DataRequired(), Length(min=3, max=50)],
                                render_kw={"placeholder": "Nowe hasło"})
    submit = SubmitField('Zapisz')
class ChangeUserPassword(FlaskForm):
    """Change user password form from admin dashboard"""
    userPass = PasswordField('Nowe hasło:', validators=[DataRequired(), Length(min=3, max=50)],
                             render_kw={"placeholder": "Nowe hasło"})
    submit = SubmitField('Zapisz')

class Search(FlaskForm):
    """Search directories and files form"""
    searchKey = StringField("Szukaj", validators=[DataRequired()])
    submit = SubmitField('Szukaj')

class CreateFolders(FlaskForm):
    """Create folder form"""
    folderName = StringField("Nazwa folderu", validators=[DataRequired()], render_kw={'placeholder': 'Nazwa folderu'})
    submit = SubmitField('Utwórz')

class UploadFiles(FlaskForm):
    """Upload files form"""
    fileName = FileField('Plik', validators=[FileAllowed('.txt, .jpg, .png, .jpeg')],
                         render_kw={'placeholder': '.txt, .jpg, .png, .jpeg'})
    submit = SubmitField('Prześlij')

class RenameFolder(FlaskForm):
    """Rename folder form"""
    newFolderName = StringField("Nowa nazwa folderu", validators=[DataRequired()])
    submit = SubmitField('Zmień nazwę')

class RenameFile(FlaskForm):
    """Rename file form"""
    newFileName = StringField("Nowa nazwa pliku", validators=[DataRequired()])
    submit = SubmitField('Zmień nazwę')
#endregion

# Main app
@app.route('/')
def index():
    return render_template('index.html', title='Home', headline='Zarządzanie użytkownikami')

@app.route('/dashboard')
@login_required
def dashboard():
    addUser = Add()
    editUser = Edit()
    changeUserPass = ChangeUserPassword()
    editPass = ChangePassword()
    search = Search()
    createFolder = CreateFolders()
    uploadFile = UploadFiles()
    users = Users.query.all()
    files = Files.query.all()
    folders = Folders.query.all()
    renameFolder = RenameFolder()
    renameFile = RenameFile()
    return render_template('dashboard.html', title='Dashboard', users=users, addUser=addUser, editUser=editUser,
                           editPass=editPass, changeUserPass=changeUserPass, search=search, createFolder=createFolder,
                           uploadFile=uploadFile, files=files, renameFile=renameFile, folders=folders, renameFolder=renameFolder)

#region Users
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
    form = Edit()
    user = Users.query.get_or_404(id)
    if form.validate_on_submit():
        user.firstName = form.firstName.data
        user.lastName = form.lastName.data
        user.userMail = form.userMail.data
        user.userRole = form.userRole.data
        db.session.commit()
        flash('Dane zapisane poprawnie', 'success')
        return redirect(url_for('dashboard'))


@app.route('/change-user-pass<int:id>', methods=['GET', 'POST'])
@login_required
def changeUserPass(id):
    form = ChangeUserPassword()
    user = Users.query.get_or_404(id)
    if form.validate_on_submit():
        user.userPass = bcrypt.generate_password_hash(form.userPass.data)
        db.session.commit()
        flash('Hasło zmienione poprawnie', 'success')
        return redirect(url_for('dashboard'))


@app.route('/change-pass<int:id>', methods=['GET', 'POST'])
@login_required
def changePass(id):
    form = ChangePassword()
    if form.validate_on_submit():
        user = Users.query.get_or_404(id)
        if user:
            if bcrypt.check_password_hash(user.userPass, form.userPass.data):
                user.userPass = bcrypt.generate_password_hash(form.newUserPass.data)
                db.session.commit()
                flash("Hasło zmienione pomyślnie", "success")
            else:
                flash("Błędne hasło", "danger")
    return redirect(url_for('dashboard'))


@app.route('/delete-user', methods=['GET', 'POST'])
@login_required
def deleteUser():
    if request.method == 'GET':
        id = request.args.get('id')
        user = Users.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        flash('Użytkownik usunięty poprawnie', 'success')
        return redirect(url_for('dashboard'))


#endregion

#region Login, Register
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
            newUser = Users(userMail=register.userMail.data, userPass=hashedPass, firstName=register.firstName.data,
                            lastName=register.lastName.data, userRole='admin')
            db.session.add(newUser)
            db.session.commit()
            flash('Konto utworzone poprawnie', 'success')
            return redirect(url_for('login'))
        except Exception:
            flash('Taki adres mail już istnieje, wpisz inny.', 'danger')
    else:
        try:
            hashedPass = bcrypt.generate_password_hash(register.userPass.data)
            newUser = Users(userMail=register.userMail.data, userPass=hashedPass, firstName=register.firstName.data,
                            lastName=register.lastName.data, userRole='user')
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

# region Files, Directories
@app.route('/upload-file', methods=['GET', 'POST'])
@login_required
def uploadFile():
    uploadedFile = request.files['fileName']
    fileName = secure_filename(uploadedFile.filename)
    if fileName != '':
        fileExtension = os.path.splitext(fileName)[1]
        if fileExtension not in app.config['UPLOAD_EXTENSIONS']:
            flash('Plik o podanym rozszerzeniu nie może być przesłany', 'danger')
        else:
            uploadedFile.save(os.path.join(app.config['UPLOAD_PATH'], fileName))
            fileSize = ''
            now = datetime.now()
            ext = fileExtension.replace('.', '')
            newFile = Files(fileName=fileName, type=ext, size=fileSize, icon=f'bi bi-filetype-{ext}',
                            time=now.strftime("%d/%m/%Y %H:%M:%S"))
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
        newFolder = Folders(folderName=folderName, type='folder', icon='bi bi-folder',
                            time=now.strftime("%d/%m/%Y %H:%M:%S"))
        db.session.add(newFolder)
        db.session.commit()
        flash('Folder utworzony pomyślnie', 'success')
        return redirect(url_for('dashboard'))


@app.route('/rename-file<int:id>', methods=['GET', 'POST'])
@login_required
def renameFile(id):
    form = RenameFile()
    file = Files.query.get_or_404(id)
    oldName = file.fileName
    newName = form.newFileName.data

    if form.validate_on_submit():
        os.rename(os.path.join(app.config['UPLOAD_PATH'], oldName), os.path.join(app.config['UPLOAD_PATH'], newName))
        file.fileName = newName
        db.session.commit()
        flash('Nazwa pliku zmieniona poprawnie', 'success')
    else:
        flash('Nazwa pliku nie została zmieniona', 'success')
    return redirect(url_for('dashboard'))


@app.route('/rename-folder<int:id>', methods=['GET', 'POST'])
@login_required
def renameFolder(id):
    form = RenameFolder()
    folder = Folders.query.get_or_404(id)
    oldName = folder.fileName
    newName = form.newFolderName.data

    if form.validate_on_submit():
        os.rename(os.path.join(app.config['UPLOAD_PATH'], oldName), os.path.join(app.config['UPLOAD_PATH'], newName))
        folder.folderName = newName
        db.session.commit()
        flash('Nazwa folderu zmieniona poprawnie', 'success')
    else:
        flash('Nazwa folderu nie została zmieniona', 'success')
    return redirect(url_for('dashboard'))


@app.route('/delete-file<int:id>', methods=['GET', 'POST'])
@login_required
def deleteFile(id):
    if id:
        file = Files.query.get_or_404(id)
        os.remove(os.path.join(app.config['UPLOAD_PATH'], file.fileName))
        db.session.delete(file)
        db.session.commit()
        flash('Plik usunięty pomyślnie', 'success')
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
