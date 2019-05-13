# Coclustering: gènes et maladies
La plupart des études d’association se limitent souvent à la mise en évidence d’un lien entre un groupe de gènes G et une maladie. Cependant, l’étape suivante est l’étude des interaction entre les gènes de G pour mieux comprendre comment ces gènes coopèrent pour provoquer l’apparition d’une maladie ou d’un phénotype.

La présentation de la solution se présente sous forme d'une interface graphique Web utilisant le framework Flask dont l'implémentation est disponible [ici](insert_liens_site).

On a un ensemble G de k gènes suspectés d’être associés à une maladie et on construit des représentations vectorielles de ces gènes. Pour étudier ces interactions, nous avons utilisé des techniques de clustering hiérarchique sur le groupe G étudié ainsi que des techniques de co-clustering afin d’obtenir automatiquement des ensembles de termes
descripteurs pour chacun des sous-groupes identifiés au sein du groupe étudié G.

## Organisation du repository
* [Interface](https://github.com/yannistannier/coclust/tree/master/interface) : Front de l'application: 
```
npm install
npm run start
npm run build
```

* [Notebook](https://github.com/yannistannier/coclust/tree/master/notebook) : Preprocessing de la base de données et premiers tests de clustering.
* [Server](https://github.com/yannistannier/coclust/tree/master/server) : Back de l'application, et [API](https://github.com/JosephGesnouin/coclust/blob/master/server/api.py) Flask.

## Datasets
Dans le but d’être le plus précis possible et d'obtenir un nombre de noms de maladies et de gênes conséquents, il aura fallu prendre en considération de nombreuses bases de données: en particulier, si l’on souhaite concevoir une base de données beaucoup plus grande. C’est ce que nous avons réalisé dans le cadre de ce projet. Les bases de données utilisées sont nombreuses:
* Online Mendelian Inheritance in Man (OMIM)
* Diseases
* Gene Ontology (GO)
* Entrez-Gene (EG)
* Pubmed

L’utilisation de toutes ces bases de données nous aura permis d’isoler une multitude de noms de maladies et de gènes grâce à des traitements de text-mining: nous disposions d’une liste assez conséquente des maladies et gènes existants. Ainsi, nous disposions d’environ 4 000 maladies différentes et de 16 000 gènes.


## Named Entity Recognition
En plus des noms de maladies et de gènes isolés grâce aux datasets précédents, un NER (Spacy) aura été lancé sur les fichiers asthma et autism afin d'aggrémenter le jeu de données de nouvelles maladies et de nouveaux gênes, le NER est également disponible sur le site pour experimentation.

## PreProcessing
Nos matrices pouvant s'apparenter à des matrices document-terme, nous avons souhaité utiliser des techniques classiques de text-mining telles:
*  **La Lemmatization**: Transformation des mots en leur "forme canonique": par exemple étoiles /étoile ou encore luisent / luire.
* **Stop word removal**: L'une des principales formes de prétraitement consiste à filtrer les données inutiles. Dans le traitement du langage naturel, les mots inutiles sont appelés Stop words. On peut par exemple citer “the”, “a”, “an”, “in” comme des stop words.
* **Punctuation removal**: Supression de la ponctuation.
* **TF-IDF**: Cette mesure statistique permet d'évaluer l'importance d'un terme contenu dans un document, relativement à une collection ou un corpus. Le poids augmente proportionnellement au nombre d'occurrences du mot dans le document. Il varie également en fonction de la fréquence du mot dans le corpus. Le choix d'appliquer un TF-IDF sur la matrice pré classification hierarchique / co-clustering aura été laissé à l'utilisateur.
* **Thresholding** : Utilisé pour supprimer les termes qui apparaissent trop fréquemment, également connus sous le nom de "StopWords spécifiques au corpus". Nous avons donc utilisé les mots les mots apparaissant dans plus de 70% du corpus et ceux apparaissant dans moins de 1% du corpus.

## Coclust
Nous avons utilisé la bibliothèque [Coclust](https://github.com/franrole/cclust_package/tree/master/datasets) pour le co-clustering ainsi que [Scikit](https://scikit-learn.org/stable/) pour le clustering hiérarchique.

Afin d'être le plus dynamique possible, l'interface permet:
* De sélectionner la maladie concernée et de spécifier la liste des gènes G correspondant à cette maladie.
* De choisir le type de coclustering ainsi que le nombre de cluster si l'utilisateur souhaite en spécifier un, dans le cas contraire le nombre de clusters maximisant la modularity sera affiché.
* De déclencher et d’afficher les résultats d’un clustering hiérarchique selon différents critères d'aggregation (euclidienne, cosinus, Hamming, Jacob...) sur la matrice des vecteurs de gènes de G.
* De déclencher et d’afficher les résultats du co-clustering sur la matrice des vecteurs de gènes de G.
* D'afficher le boxplot correspondant à la matrice de similarités pairwise entre les gènes du groupe G spécifiquement pour la maladie selectionnée et indépendamment de celle-ci.

### Approches proposées
Différentes approches pour le co-clustering sont proposées:
* Une approche Gène Article, les articles correspondant aux articles dans lesquels la maladie et les gènes selectionnés apparaissent.
* Une approche Gène Terme, les termes correspondant aux articles dans lesquels la maladie et les gènes selectionnés apparaissent.
* Une approche Gène Gène similaire dans le traitement.


## Choix des critères d'aggregation
Le choix de la mesure de similarité/dissimilarité est loin d'être un choix facile. Nous proposons à l'utilisateur de choisir entre quatre mesures différentes: 
* Nous recommandons l'utilisation de la **similarité cosinus** afin de conserver cette notion directionnelle dans le travail sur la matrice document-terme.
* La **Distance de Jacard** est également disponible et correspond au rapport entre le cardinal (la taille) de l'intersection des ensembles considérés et le cardinal de l'union des ensembles. La mesure se réfère au nombre de mots communs sur tous les mots. Plus il y a de mots en commun, plus les deux objets seront similaires. La similitude de Jaccard est bonne pour les cas où le dédoublement n'a pas d'importance en text-mining, nous recommandons également son utilisation si cosine n'est pas concluante.
* La **Distance de Hamming** est également utilisée en [systématique](https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.0050069) comme mesure de la distance génétique. Nous avons donc souhaité la mettre à disposition.
* Finalement, il est possible pour l'utilisateur d'utiliser la **distance euclidienne**, qui ne donnera aucune information autre que la différence de "taille" des documents. Nous l'avons laissée par convention.

## Références
* Melissa Ailem, François Role, Mohamed Nadif, Florence Demenais:
**Unsupervised text mining for assessing and augmenting GWAS results**,
Journal of Biomedical Informatics,
Volume 60,
2016,
Pages 252-259,
ISSN 1532-0464,
https://www.sciencedirect.com/science/article/pii/S1532046416000307

* Joseph K Wong, Satish K Pillai, Christopher D Pilcher:
**Inferring HIV Transmission Dynamics from Phylogenetic Sequence Relationships**,
https://doi.org/10.1371/journal.pmed.0050069


