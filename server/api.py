from flask import Flask
from flask import request
from flask_cors import CORS
import spacy, json
from flask import jsonify
from coclust.coclustering import CoclustMod, CoclustSpecMod, CoclustInfo
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from collections import defaultdict
from matplotlib import pyplot as plt
import numpy as np
import seaborn as sns
import base64
from io import BytesIO
from PIL import Image

import io
from flask import send_file

app = Flask(__name__)
CORS(app)



nlp = spacy.load("epoch_13")

maladiesgenes = json.load(open("maladies_genes.json"))

maladiesjson = json.load(open("maladies_index.json"))
genesjson = json.load(open("genes_index.json"))
asthmajson = { str(v["id"]):v for v in json.load(open("asthma_preprocessed.json")) }

@app.route('/ner', methods=['POST'])
def hello_world():
	#print(request.json["text"])
	doc = nlp(unicode(request.json["text"]))
	gene = 0
	disease = 0
	for t in doc:
		if t.ent_type_ == "GENE":
			gene += 1
		if t.ent_type_ == "DISEASE":
			disease += 1
	return jsonify(text=[(t.text, t.ent_type_ if t.ent_type_ else "default") for t in doc], count={"gene":gene, "disease":disease})



@app.route('/maladies', methods=['GET'])
def maladies():
	mds = [ { "value" : g, "label" : g} for g in list(maladiesgenes.keys()) ]
	return jsonify(mds)

@app.route('/maladies_genes/<m>', methods=['GET'])
def maladies_genes(m):
	mds = [ { "id" : idx, "label" : g} for idx, g in enumerate(maladiesgenes[m]) ]
	return jsonify(mds)



@app.route('/genes_termes', methods=['POST'])
def genes_termes():
	tfidf = request.json["tfidf"]
	coclust = int(request.json["coclust"])
	selected_genes = [ v["label"] for v in request.json["genes"]]
	# get id articles from all genes
	l = [ genesjson[g] for g in selected_genes ]
	genes_articles = list(set([item for sublist in l for item in sublist]))
	# get text from article
	articles_text = [ ' '.join(asthmajson[str(i)]["text"]) for i in genes_articles ]

	if tfidf:
		vec = TfidfVectorizer(max_df=0.6, min_df=0.01)
	else:
		vec = CountVectorizer(max_df=0.6, min_df=0.01)
	
	dt = vec.fit_transform(articles_text)

	matrix_article_terms = dt.toarray()
	matrix_genes_terms = defaultdict(lambda : np.zeros(matrix_article_terms.shape[1]).astype(np.float64))
	for idx, row in enumerate(matrix_article_terms):
		article = asthmajson[str(genes_articles[idx])]
		for ge in article["genes"]:
			if ge in selected_genes:
				matrix_genes_terms[ge] +=  row
	list_matrix_genes_terms = [ v for k,v in matrix_genes_terms.items() ]
	#df3 = pd.DataFrame(list_matrix_genes_terms, columns=vec.get_feature_names())

	if coclust == 1:
		model = CoclustMod(n_clusters=2, random_state=0)
	if coclust == 2:
		model = CoclustSpecMod(n_clusters=2, random_state=0)
	if coclust == 3:
		model = CoclustInfo()

	dt = np.array(list_matrix_genes_terms)
	m1 = model.fit(dt)
	fit_data = dt[np.argsort(model.row_labels_)]
	fit_data = fit_data[:, np.argsort(model.column_labels_)]

	plt.figure(figsize=(20,8))
	plt.subplot(121)
	sns.heatmap(np.log(dt+1),cmap="BuPu", yticklabels=False, xticklabels=False, cbar=False)
	plt.title("Heatmap on Original Data")

	plt.subplot(122)
	sns.heatmap(np.log(fit_data+1),cmap="BuPu", yticklabels=False, xticklabels=False, cbar=False)
	plt.title("CoclustMod %i clusters"%40)
	plt.savefig("/media/yannis/data/cours/coclust/server/test1.jpg")

	return jsonify({"img":True})





@app.route('/images/test.jpg')
def get_image():
    return send_file("test.jpg", mimetype='image/jpeg')