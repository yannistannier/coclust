# Coclustering: gènes et maladies
La plupart des études d’association se limitent souvent à la mise en évidence d’un lien entre un groupe de gènes G et une maladie. Cependant, l’étape suivante est l’étude des interaction entre les gènes de G pour mieux comprendre comment ces gènes coopèrent pour provoquer l’apparition d’une maladie ou d’un phénotype.

La présentation de la solution se présente sous forme d'une interface graphique Web utilisant le framework Flask dont l'utilisation est disponible [ici](insert_liens_site)

On a un ensemble G de k gènes suspectés d’être associés à une maladie et on construit des représentations vectorielles de ces gènes. Pour étudier ces interactions, nous avons utilisé des techniques de clustering hiérarchique sur le groupe G étudié ainsi que des techniques de co-clustering afin d’obtenir automatiquement des ensembles de termes
descripteurs pour chacun des sous-groupes identifiés au sein du groupe étudié G.

### Organisation du repository
* [Interface](https://github.com/yannistannier/coclust/tree/master/interface) : Front de l'application, les informations d'installation sont disponibles dans le readme du dossier.
* [Notebook](https://github.com/yannistannier/coclust/tree/master/notebook) : Preprocessing de la base de données et premiers tests de clustering.
* [Server](https://github.com/yannistannier/coclust/tree/master/server) : Back de l'application, et [Api](https://github.com/JosephGesnouin/coclust/blob/master/server/api.py) Flask.

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
*  **La Lemmatization**: Ce traitement consiste à appliquer aux occurrences des lexèmes sujets à flexion (en français, verbes, substantifs, adjectifs) un codage renvoyant à leur entrée lexicale commune ("forme canonique" enregistrée dans les dictionnaires de la langue, le plus couramment), que l'on désigne sous le terme de lemme. Par exemple étoiles /étoile ou encore luisent / luire.
* **Stop word removal**: L'une des principales formes de prétraitement consiste à filtrer les données inutiles. Dans le traitement du langage naturel, les mots inutiles sont appelés Stop words. On peut par exemple citer “the”, “a”, “an”, “in” comme des stop words.
* **Punctuation removal**: Supression de la ponctuation.
* **TF-IDF**: Cette mesure statistique permet d'évaluer l'importance d'un terme contenu dans un document, relativement à une collection ou un corpus. Le poids augmente proportionnellement au nombre d'occurrences du mot dans le document. Il varie également en fonction de la fréquence du mot dans le corpus. Le choix d'appliquer un TF-IDF sur la matrice pré classification hierarchique / co-clustering aura été laissé à l'utilisateur.

## Coclust
Nous avons utilisé la bibliothèque [Coclust](https://github.com/franrole/cclust_package/tree/master/datasets) pour le co-clustering ainsi que [Scikit](https://scikit-learn.org/stable/) pour le clustering hiérarchique.

Afin d'être le plus dynamique possible, l'interface permet:
* De sélectionner la maladie concernée et de spécifier la liste des gènes G correspondant à cette maladie.
* De choisir le type de coclustering ainsi que le nombre de cluster si l'utilisateur souhaite en spécifier un, dans le cas contraire le nombre de clusters maximisant la modularity sera affiché.
* De déclencher et d’afficher les résultats d’un clustering hiérarchique selon différents critères d'aggregation (euclidienne, cosinus, Hamming, Jacob...) sur la matrice des vecteurs de gènes de G.
* De déclencher et d’afficher les résultats du co-clustering sur la matrice des vecteurs de gènes de G.

### Approches proposées
Différentes approches pour le co-clustering sont proposées:
#### Gène Gène
Une approche Gène Gène, 
#### Gene Terme
Une approche Gène Terme, 
#### Gene Article
Une approche Gène Article,

### Choix des critères d'aggregation

## Références
* Melissa Ailem, François Role, Mohamed Nadif, Florence Demenais:
**Unsupervised text mining for assessing and augmenting GWAS results**,
Journal of Biomedical Informatics,
Volume 60,
2016,
Pages 252-259,
ISSN 1532-0464,


