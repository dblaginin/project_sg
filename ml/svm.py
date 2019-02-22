from sklearn import svm
from utilities import load_magic04, load_wine, scale_data, train_model, tune_hyperparameters, model_complexity, learning_curve

df, factors, response = load_wine()
# df, factors, response = load_magic04()
df_train, df_test = scale_data(df, response)

classifier = svm.SVC(kernel="rbf", cache_size=2000)
train_model(classifier, df_train, None, factors, response)

best_params = tune_hyperparameters(classifier, df_train, factors, response, {"C": [4**power for power in range(-1, 10)]})
# "C": [4**power for power in range(-1, 10)] "kernel": ["linear", "rbf", "poly", "sigmoid"]

model_complexity(svm.SVC(kernel="rbf", cache_size=2000), df_train, factors, response, {"C": [4**power for power in range(3, 12)]}, "C", xlog=True)

classifier = svm.SVC(C=best_params["C"], kernel="rbf", cache_size=2000)
train_model(classifier, df_train, df_test, factors, response, "Final ")

learning_curve(classifier, df_train, factors, response)
