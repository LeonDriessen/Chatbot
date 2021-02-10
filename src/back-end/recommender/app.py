# Flask imports
from flask import Flask, request
from dotenv import load_dotenv
import os
load_dotenv()

# Other imports
from algorithms import Algorithms

app = Flask(__name__)

@app.route("/", methods=["POST"])
def get_recommendation():
  data = request.get_json()
  technique = request.args.get('technique')
  recommender = Algorithms(data["previousMovies"], technique)
  recommendation = recommender.main(data["movies"], data['similar_movies'],
                                    data["preferences"])
  return recommendation

port = os.getenv("PYTHON_PORT")
app.run(port=port, debug=True)
