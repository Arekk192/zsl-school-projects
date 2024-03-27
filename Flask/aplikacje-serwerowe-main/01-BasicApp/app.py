# importowanie modułów i klas
from flask import Flask, render_template

# konfiguracja aplikacji
app = Flask(__name__)

# główna część aplikacji
@app.route('/')
def index():
    return '<h2>Witaj Flask</h2>'

@app.route('/templates')
def templates():
    return render_template('template.html', title='Templates')

@app.route('/user/<userName>')
def user(userName):
    return render_template('user.html', title='User', userName=userName)

# uruchomienie aplikacji
if __name__ == '__main__':
    app.run(debug=True)