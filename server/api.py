from flask import Flask
from flask import request
from flask_cors import CORS
import spacy, json
from flask import jsonify
from coclust.coclustering import CoclustMod, CoclustSpecMod, CoclustInfo
from coclust.evaluation.internal import best_modularity_partition
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from collections import defaultdict
from matplotlib import pyplot as plt
import numpy as np
import seaborn as sns
import base64
import pandas as pd
from scipy.cluster.hierarchy import dendrogram, linkage
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



@app.route('/genes_articles', methods=['POST'])
def genes_articles():
	print(request.json)
	tfidf = request.json["tfidf"]
	distance = request.json["distance"]
	coclust = int(request.json["coclust"])
	selected_genes = [ v["label"] for v in request.json["genes"]]
	nb_cluster = int(request.json["nb"])

	genes_articles_str = [ ' '.join(str(x) for x in genesjson[g]) for g in selected_genes ]

	if tfidf:
		vec = TfidfVectorizer()
	else:
		vec = CountVectorizer()
	
	X = vec.fit_transform(genes_articles_str)
	nb = nb_cluster
	if nb_cluster == 0 and coclust != 3:
		xn = X.shape[0]
		step = round(xn/10) if round(xn/10) > 0 else 1
		rng =  range(1, xn, step)
		# _, modularities = best_modularity_partition(X, rng, n_rand_init=1)
		# nb = rng[np.argmax(modularities)]
		modularities=[]
		for x in rng:
			print(x)
			m = CoclustMod(n_clusters=x, n_init=1).fit(X)
			modularities.append(m.modularity)
		nb = rng[np.argmax(modularities)]
	
	if coclust == 1:
		model = CoclustMod(n_clusters=nb, random_state=0)
	if coclust == 2:
		model = CoclustSpecMod(n_clusters=nb, random_state=0)
	if coclust == 3:
		model = CoclustInfo()
	

	dt = X.toarray()
	model.fit(dt)
	fit_data = dt[np.argsort(model.row_labels_)]
	fit_data = fit_data[:, np.argsort(model.column_labels_)]

	plt.figure(figsize=(22,5))
	if nb_cluster == 0 and coclust != 3:
		plt.subplot(131)
		plt.plot(rng, modularities, 'ro-')
		plt.xlabel("Number of cluster")
		plt.ylabel("Modularity")
		plt.title("Max modularity for "+str(nb)+" clusters ("+str(round(np.max(modularities),3))+")")
		plt.axvline(x=nb, color='r', linestyle='-')
	plt.subplot(132)
	sns.heatmap(dt,cmap="BuPu", yticklabels=False, xticklabels=False, cbar=False)
	plt.title("Heatmap on Original Data")
	plt.subplot(133)
	sns.heatmap(fit_data,cmap="BuPu", yticklabels=False, xticklabels=False, cbar=False)
	plt.title("CoclustMod %i clusters"%nb)
	plt.savefig("img-ga1.jpg",bbox_inches='tight',  pad_inches = 0)


	# hierarchical clustering
	Z = linkage(dt, 'single', 'euclidean')

	plt.figure(figsize=(15, 7))
	plt.xlabel('')
	plt.ylabel('distance')
	dendrogram(
		Z,
		labels = selected_genes
	)
	plt.savefig("img-ga2.jpg",bbox_inches='tight',  pad_inches = 0)
	plt.close('all')

	
	return jsonify({"tab":1})



@app.route('/genes_termes', methods=['POST'])
def genes_termes():
	tfidf = request.json["tfidf"]
	coclust = int(request.json["coclust"])
	selected_genes = [ v["label"] for v in request.json["genes"]]
	nb_cluster = int(request.json["nb"])

	# get id articles from all genes
	l = [ genesjson[g] for g in selected_genes ]
	genes_articles = list(set([item for sublist in l for item in sublist]))
	# get text from article
	articles_text = [ ' '.join(asthmajson[str(i)]["text"]) for i in genes_articles ]

	if tfidf:
		vec = TfidfVectorizer(max_df=0.7, min_df=0.01)
	else:
		vec = CountVectorizer(max_df=0.7, min_df=0.01)
	
	dt = vec.fit_transform(articles_text)

	matrix_article_terms = dt.toarray()
	matrix_genes_terms = defaultdict(lambda : np.zeros(matrix_article_terms.shape[1]).astype(np.float64))
	for idx, row in enumerate(matrix_article_terms):
		article = asthmajson[str(genes_articles[idx])]
		for ge in article["genes"]:
			if ge in selected_genes:
				matrix_genes_terms[ge] +=  row
	list_matrix_genes_terms = [ v for k,v in matrix_genes_terms.items() ]
	list_genes = [ k for k,v in matrix_genes_terms.items() ]
	#df3 = pd.DataFrame(list_matrix_genes_terms, columns=vec.get_feature_names())

	if coclust == 1:
		model = CoclustMod(n_clusters=nb_cluster, random_state=0)
	if coclust == 2:
		model = CoclustSpecMod(n_clusters=nb_cluster, random_state=0)
	if coclust == 3:
		model = CoclustInfo()

	dt = np.array(list_matrix_genes_terms)
	m1 = model.fit(dt)
	fit_data = dt[np.argsort(model.row_labels_)]
	fit_data = fit_data[:, np.argsort(model.column_labels_)]

	plt.figure(figsize=(20,8))
	plt.subplot(121)
	sns.heatmap(np.log(dt+1),cmap="BuPu", yticklabels=False, xticklabels=False, cbar=False)
	plt.title("Heatmap on Original Data",  fontdict = {'fontsize' : 20})

	plt.subplot(122)
	sns.heatmap(np.log(fit_data+1),cmap="BuPu", yticklabels=False, xticklabels=False, cbar=False)
	plt.title("CoclustMod %i clusters"%nb_cluster, fontdict = {'fontsize' : 20})
	plt.savefig("img-gt1.jpg", bbox_inches='tight',  pad_inches = 0)

	# Top terms by cluster
	nb_clust = np.unique(model.column_labels_)
	nm = np.array(vec.get_feature_names())
	dt_sum = np.sum(dt, axis=0)
	col_label = np.array(model.column_labels_)
	cluster = []
	for c in nb_clust:
		idx = np.argsort(-dt_sum[col_label == c])
		col = nm[np.array(model.column_labels_) == c]
		value = dt_sum[col_label == c][idx]
		name = col[idx]
		cluster.append({"name" : list(name[0:8]), "value": list(value[0:8])})
	

	# hierarchical clustering
	Z = linkage(dt, 'single', 'euclidean')
	plt.figure(figsize=(15, 7))
	# plt.title('Hierarchical Clustering - Hamming')
	plt.xlabel('')
	plt.ylabel('distance')
	dendrogram(
		Z,
		labels = list_genes
	)
	plt.savefig("img-gt2.jpg",bbox_inches='tight',  pad_inches = 0)
	plt.close('all')

	return jsonify({"tab":2, "cluster" : cluster})



@app.route('/genes_genes', methods=['POST'])
def genes_genes():
	print(request.json)
	tfidf = request.json["tfidf"]
	distance = request.json["distance"]
	coclust = int(request.json["coclust"])
	selected_genes = [ v["label"] for v in request.json["genes"]]
	nb_cluster = int(request.json["nb"])

	genes_articles_str = [ ' '.join(str(x) for x in genesjson[g]) for g in selected_genes ]

	if tfidf:
		vec = TfidfVectorizer()
	else:
		vec = CountVectorizer()
	
	X = vec.fit_transform(genes_articles_str)

	g_g = np.dot(X.toarray(), X.toarray().T)
	diag = 1 - np.diag((np.ones(g_g.shape[0])))
	X = g_g * diag

	nb = nb_cluster
	if nb_cluster == 0 and coclust != 3:
		xn = X.shape[0]
		step = round(xn/10) if round(xn/10) > 0 else 1
		rng =  range(1, xn, step)
		modularities=[]
		for x in rng:
			print(x)
			m = CoclustMod(n_clusters=x, n_init=1).fit(X)
			modularities.append(m.modularity)
		nb = rng[np.argmax(modularities)]
	
	if coclust == 1:
		model = CoclustMod(n_clusters=nb, random_state=0)
	if coclust == 2:
		model = CoclustSpecMod(n_clusters=nb, random_state=0)
	if coclust == 3:
		model = CoclustInfo()
	
	dt = X
	model.fit(dt)
	fit_data = dt[np.argsort(model.row_labels_)]
	fit_data = fit_data[:, np.argsort(model.column_labels_)]

	plt.figure(figsize=(22,5))
	if nb_cluster == 0 and coclust != 3:
		plt.subplot(131)
		plt.plot(rng, modularities, 'ro-')
		plt.xlabel("Number of cluster")
		plt.ylabel("Modularity")
		plt.title("Max modularity for "+str(nb)+" clusters ("+str(round(np.max(modularities),3))+")")
		plt.axvline(x=nb, color='r', linestyle='-')
	plt.subplot(132)
	sns.heatmap(dt,cmap="BuPu", yticklabels=False, xticklabels=False, cbar=False)
	plt.title("Heatmap on Original Data")
	plt.subplot(133)
	sns.heatmap(fit_data,cmap="BuPu", yticklabels=False, xticklabels=False, cbar=False)
	plt.title("CoclustMod %i clusters"%nb)
	plt.savefig("img-gg1.jpg",bbox_inches='tight',  pad_inches = 0)

	
	Z = linkage(dt, 'single', 'euclidean')

	plt.figure(figsize=(15, 7))
	plt.xlabel('')
	plt.ylabel('distance')
	dendrogram(
		Z,
		labels = selected_genes
	)
	plt.savefig("img-gg2.jpg",bbox_inches='tight',  pad_inches = 0)
	plt.close('all')

	return jsonify({"tab":3})


@app.route('/images/img-<id>-<rd>.jpg')
def get_image(id, rd):
    return send_file("img-"+str(id)+".jpg", mimetype='image/jpeg')