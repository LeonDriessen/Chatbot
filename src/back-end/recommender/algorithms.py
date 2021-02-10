import json
import sys
import copy

class Algorithms:

    def __init__(self, movies, technique):
        if movies != None:
            self.recommended = movies
        else:
            self.recommended = None
        self.string_prefs = ["actors", "genres", "directors"]
        self.technique = technique

    def recommend(self, movies, similar, prefs):
        #Sorting data on vote average. Is useful later
        if movies is None:
            return json.dumps("There were no movies")
        scores, data = self.make_scores(movies, similar,prefs)
        self.recommended = self.get_best(scores, data)
        #Turn movie to JSON data type
        return json.dumps(self.recommended)

    def recommend_shuffle(self, movies, similar, prefs):
        self.recommended = self.recommend(movies, similar, prefs)
        #Shuffle keys to simulate question misinterpretation.
        self.recommended = self.shuffle_keys(self.recommended)
        return json.dumps(self.recommended)#Turn movie to JSON data type

    def shuffle_keys(self, to_shuffle):
        #This function shuffles the key values to simulate misinterpretation.
        dummy = copy.deepcopy(to_shuffle)

        to_shuffle['runtime'] = dummy['genres']
        to_shuffle['cast'] = dummy['runtime']
        to_shuffle['genres'] = dummy['release_date']
        to_shuffle['directors'] = dummy['vote_average']
        to_shuffle['vote_average'] = dummy['cast']
        to_shuffle['release_date'] = dummy['directors']

        return to_shuffle

    def get_best(self, scores, data):
        #This function gets the best movie based on the scores.
        #The line below makes sorting on vote average easier.
        scores = [(score[0], score[1], data[score[1]]['vote_average']) for score in scores]
        sort_scores = sorted(scores, key=lambda x: (x[0], x[2]), reverse=True)
        for movie in sort_scores:
            if self.recommended is None:
                return data[movie[1]]
            elif not data[movie[1]]['movie_title'] in self.recommended:
                return data[movie[1]]
        return 'No more best movies'

    def make_scores(self,movies,similar,preferences):
        #We need to use appending to get the scores and indices correct. Sorting
        #on best rating will be done later.
        if(similar is None):
            similar = []
        scores = [[value, index] for index, value in enumerate([1]*len(similar))]
        scores_mov = [[value, index+len(similar)] for index, value in enumerate([0]*len(movies))]
        similar.extend(movies)
        scores.extend(scores_mov)
        for pref_type, pref_value in preferences.items():
            scores = self.update_scores(scores, similar, pref_type,
                                        pref_value)
        return scores,similar

    def update_scores(self, scores, data, pref_type, pref_value):
        if pref_type in self.string_prefs:
            return self.update_score_string(scores, data, pref_type, pref_value)
        elif pref_type == "runtime":
            return self.update_score_runtime(scores, data, pref_type, pref_value)
        elif pref_type == "release_date":
            return self.update_score_relyear(scores, data, pref_type, pref_value)
        else:
            return scores

    def update_score_string(self, scores, data, pref_type, pref_value):
        #Updates scores with a percentual score, used for any string-type preference
        for index, movie in enumerate(data):
            amount_in = len([i for i in pref_value if i in movie[pref_type]])
            if len(movie[pref_type]) == 0:
                percentage_in = 0
            else:
                percentage_in = amount_in/len(movie[pref_type])
            scores[index][0] += percentage_in
        return scores

    def update_score_runtime(self, scores, data, pref_type, pref_value):
        #Updates scores for the runtime-type preference
        for index, movie in enumerate(data):
            if movie[pref_type] <= pref_value:
                scores[index][0] += 5
        return scores

    def update_score_relyear(self, scores, data, pref_type, pref_value):
        #Updates scores for the release-year-type preference.
        for index, movie in enumerate(data):
            if movie[pref_type] >= pref_value:
                scores[index][0] += 5
        return scores

    """Main function"""
    def main(self, movies, similar, preferences):
        if (self.technique == 'default'):
            return self.recommend(movies, similar, preferences)
        elif (self.technique == 'shuffle'):
            return self.recommend_shuffle(movies, similar, preferences)