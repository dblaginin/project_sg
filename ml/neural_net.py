from sklearn import neural_network
from utilities import load_magic04, load_wine, scale_data, train_model, tune_hyperparameters, model_complexity, learning_curve

df, factors, response = load_wine()
# df, factors, response = load_magic04()
df_train, df_test = scale_data(df, response)

classifier = neural_network.MLPClassifier(activation="tanh", solver="lbfgs", max_iter=500, random_state=7)
train_model(classifier, df_train, None, factors, response)

best_params = tune_hyperparameters(classifier, df_train, factors, response, {"hidden_layer_sizes": [tuple([i]*2) for i in range(5,20)], "alpha": [10.0**(-i) for i in range(2, 6)]})
# "hidden_layer_sizes": [tuple([i]*j) for i in range(1,9) for j in range(1,9)] "activation": ["identity","logistic","tanh","relu"] "solver": ["lbfgs","sgd","adam"]
# "alpha": [10.0**(-i) for i in range(1, 7)] "learning_rate": ["constant","invscaling","adaptive"]

model_complexity(neural_network.MLPClassifier(activation="tanh", solver="lbfgs", alpha=best_params["alpha"], max_iter=500, random_state=7), df_train, factors, response,
                 {"hidden_layer_sizes": [tuple([i]*2) for i in range(5,20)]}, "hidden_layer_sizes", transform=lambda x:x[0])
best_hls = best_params["hidden_layer_sizes"]
model_complexity(neural_network.MLPClassifier(hidden_layer_sizes=best_hls, activation="tanh", solver="lbfgs", alpha=best_params["alpha"]),
                 df_train, factors, response, {"max_iter":range(20,800,20)}, "max_iter")

classifier = neural_network.MLPClassifier(hidden_layer_sizes=best_hls, activation="tanh", solver="lbfgs", alpha=best_params["alpha"], max_iter=500, random_state=7)
train_model(classifier, df_train, df_test, factors, response, "Final ")

learning_curve(classifier, df_train, factors, response)
