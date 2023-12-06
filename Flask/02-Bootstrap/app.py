# importowanie modułów i klas
from flask import Flask, render_template
from flask_bs4 import Bootstrap

# konfiguracja aplikacji
app = Flask(__name__)
bootstrap = Bootstrap(app)

# główna część aplikacji
@app.route('/')
def index():
    return render_template('index.html', title="Home")

@app.errorhandler(404)
def pageNotFound(error):
    return render_template('404.html', title="404"), 404

@app.errorhandler(500)
def pageNotFound(error):
    return render_template('500.html', title="Wewnętrzny błąd serwera"), 500

@app.route('/templates')
def templates():
    return render_template('template.html', title='Templates')

@app.route('/user/<userName>')
def user(userName):
    return render_template('user.html', title='User', userName=userName)

# uruchomienie aplikacji
if __name__ == '__main__':
    app.run(debug=True)