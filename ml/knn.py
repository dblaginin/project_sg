from sklearn import neighbors
from utilities import load_magic04, load_wine, scale_data, train_model, tune_hyperparameters, model_complexity, learning_curve

df, factors, response = load_wine()
# df, factors, response = load_magic04()
df_train, df_test = scale_data(df, response)

classifier = neighbors.KNeighborsClassifier(weights="distance")
train_model(classifier, df_train, None, factors, response)

best_params = tune_hyperparameters(classifier, df_train, factors, response, {"n_neighbors": range(1, 20), "p": range(1, 4)})
# "n_neighbors": range(1, 20) "p": range(1, 4) "metric": ["minkowski","euclidean","manhattan","chebyshev"] "weights": ["uniform", "distance"]

model_complexity(neighbors.KNeighborsClassifier(weights="distance", p=best_params["p"]), df_train, factors, response, {"n_neighbors":range(1, 30)}, "n_neighbors")

classifier = neighbors.KNeighborsClassifier(weights="distance", n_neighbors=best_params["n_neighbors"], p=best_params["p"])
train_model(classifier, df_train, df_test, factors, response, "Final ")

learning_curve(classifier, df_train, factors, response)
