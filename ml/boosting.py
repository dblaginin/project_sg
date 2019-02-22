from sklearn import ensemble, tree
from utilities import load_magic04, load_wine, scale_data, train_model, tune_hyperparameters, model_complexity, learning_curve

df, factors, response = load_wine()
# df, factors, response = load_magic04()
df_train, df_test = scale_data(df, response, 17)

classifier = ensemble.AdaBoostClassifier()
train_model(classifier, df_train, None, factors, response)

best_params = tune_hyperparameters(classifier, df_train, factors, response, {"n_estimators": range(50, 120, 5), "learning_rate": [0.4,0.5,0.6,0.7,0.8,0.9,1.0,1.1,1.2]})
#"n_estimators": range(50, 120, 5) "learning_rate": [0.4,0.5,0.6,0.7,0.8,0.9,1.0,1.1,1.2] "algorithm": ["SAMME.R","SAMME"]

model_complexity(ensemble.AdaBoostClassifier(learning_rate=best_params["learning_rate"]), df_train, factors, response, {"n_estimators": range(50, 120, 5)}, "n_estimators")

classifier = ensemble.AdaBoostClassifier(n_estimators=best_params["n_estimators"], learning_rate=best_params["learning_rate"])
train_model(classifier, df_train, df_test, factors, response, "Final ")

learning_curve(classifier, df_train, factors, response)
