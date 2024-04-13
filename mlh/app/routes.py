from app import app
from flask import render_template, request

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/submit_form', methods=['POST'])
def submitForm():
    name = request.form.get('name')
    return render_template("output.html",name=name)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)