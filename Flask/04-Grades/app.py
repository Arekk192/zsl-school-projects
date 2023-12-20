from flask import Flask, render_template, session, redirect
from flask_bs4 import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField, RadioField
from wtforms.validators import DataRequired
from flask_moment import Moment
from datetime import datetime
import json
import requests

app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config['SECRET_KEY'] = 'ghjkGHJ%^&*Fghj56&FGH%^&*vbj5678'
moment = Moment(app)
date = datetime.now()

class LoginForm(FlaskForm):
    """Formularz logowania"""
    userLogin = StringField('Nazwa użytkownika:', validators=[DataRequired()])
    userPass = PasswordField('Hasło:', validators=[DataRequired()])
    submit = SubmitField('Zaloguj')

class Subject(FlaskForm):
    """Formularz dodawania przemiotu"""
    subject = StringField('Nazwa przedmiotu', validators=[DataRequired()])
    submit = SubmitField('Dodaj')

class Grade(FlaskForm):
    """Formularz dodawania oceny"""
    subject = SelectField('Wybierz przemiot', choices=str)
    term = RadioField('Wybierz semestr', choices=[("term1", "Semestr 1"), ("term2", "Semestr 2")])
    category = RadioField('Kategoria oceny', choices=[('answer', 'Odpowiedź'), ('quiz', 'Kartkówka'), ('test', 'Sprawdzian')])
    grade = SelectField('Ocena', choices=[
        (6, "Celujący"),
        (5, "Bardzo dobry"),
        (4, "Dobry"),
        (3, "Dostateczny"),
        (2, "Dopuszczający"),
        (1, "Niedostateczny"),
    ])
    submit = SubmitField('Dodaj ocenę')

def countAverage(subjectValue, termValue):
    """funkcja obliczająca średnie ocen"""
    with open('data/grades.json') as gradesFile:
        grades = json.load(gradesFile)
        gradesFile.close()
    sumGrades = 0
    lenght = 0
    if subjectValue == "" and termValue == "":
        for subject, terms in grades.items():
            for term, categories in terms.items():
                for category, grades in categories.items():
                    if category == 'answer' or category == 'quiz' or category == 'test':
                        for grade in grades:
                            sumGrades += grade
                            lenght += 1
    else:
        for subject, terms in grades.items():
            if subject == subjectValue:
                for term, categories in terms.items():
                    if term == termValue:
                        for category, grades in categories.items():
                            if category == 'answer' or category == 'quiz' or category == 'test':
                                for grade in grades:
                                    sumGrades += grade
                                    lenght += 1
    if lenght != 0:
        return round(sumGrades / lenght, 2)

totalAverage = {}
def yearlyAverage(subjectValue, termValue):
    with open('data/grades.json', encoding='utf-8') as gradesFile:
        grades = json.load(gradesFile)
        gradesFile.close()
    sumGrades = 0
    lenght = 0
    if termValue == '':
        for subject, terms in grades.items():
            if subject == subjectValue:
                for term, categories in terms.items():
                    for category, grades in categories.items():
                        if category == 'answer' or category == 'quiz' or category == 'test':
                            for grade in grades:
                                sumGrades += grade
                                lenght += 1
                                totalAverage[subject] = round(sumGrades / lenght, 2)
    if lenght != 0:
        return round(sumGrades / lenght, 2)

@app.route('/')
def index():
    return render_template('index.html', title='Home')

@app.route('/login', methods=['POST', 'GET'])
def logIn():
    login = LoginForm()
    with open('data/users.json') as usersFile:
        users = json.load(usersFile)
        usersFile.close()
    if login.validate_on_submit():
        userLogin = login.userLogin.data
        userPass = login.userPass.data
        if userLogin == users['userLogin'] and userPass == users['userPass']:
            session['userLogin'] = userLogin
            session['firstName'] = users['firstName']
            return redirect('dashboard')
    return render_template('login.html', title='Logowanie', login=login)

@app.route('/logout')
def logOut():
    session.pop('userLogin')
    return redirect('login')

@app.route('/dashboard')
def dashboard():
    with open('data/grades.json') as gradesFile:
        grades = json.load(gradesFile)
        gradesFile.close()

    weatherRequest = requests.get('https://danepubliczne.imgw.pl/api/data/synop/station/krakow')
    weather = json.loads(weatherRequest.content)

    airQualityRequest = requests.get('https://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/400')
    airQuality = json.loads(airQualityRequest.content)

    return render_template('dashboard.html', title='Dashboard', userLogin=session.get('userLogin'), firstName=session.get(
        'firstName'), date=date, grades=grades, countAverage=countAverage, yearlyAverage=yearlyAverage, weather=weather, airQuality=airQuality)

@app.route('/addSubject', methods=['POST', 'GET'])
def addSubject():
    subjectForm = Subject()
    if subjectForm.validate_on_submit():
        with open('data/grades.json', encoding="utf-8") as gradesFile:
            grades = json.load(gradesFile)
            gradesFile.close()
            subject = subjectForm.subject.data
            grades[subject] = {
                "term1": { "answer": [], "quiz": [], "test": [], "interim": 0 },
                "term2": { "answer": [], "quiz": [], "test": [], "interim": 0, "yearly": 0 }
            }
        with open('data/grades.json', 'w', encoding='utf-8') as gradesFile:
            json.dump(grades, gradesFile)
            gradesFile.close()
            return redirect('dashboard')
    return render_template('add-subject.html', title="Dodaj przedmiot", subjectForm=subjectForm, userLogin=session.get(
        'userLogin'), firstName=session.get('firstName'), date=date)

@app.route('/addGrade')
def addGrade():
    return render_template('add-grade.html', title="Dodaj ocenę", userLogin=session.get('userLogin'), firstName=session.get(
        'firstName'), date=date)

@app.errorhandler(404)
def pageNotFound(error):
    return render_template('404.html', title='Nie ma takiej strony'), 404

@app.errorhandler(500)
def serverError(error):
    return render_template('500.html', title='Wewnętrzny błąd serwera'), 500

if __name__ == '__main__':
    app.run(debug=True)