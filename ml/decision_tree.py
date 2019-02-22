from sklearn import tree
from utilities import load_magic04, load_wine, scale_data, train_model, tune_hyperparameters, model_complexity, learning_curve

df, factors, response = load_wine()
# df, factors, response = load_magic04()
df_train, df_test = scale_data(df, response)

classifier = tree.DecisionTreeClassifier()
train_model(classifier, df_train, None, factors, response)
tree.export_graphviz(classifier, out_file="tree_initial.dot")

best_params = tune_hyperparameters(classifier, df_train, factors, response, {"max_depth": range(1, 20), "max_leaf_nodes": range(50, 150, 10)})
# "criterion": ["entropy","gini"] "max_leaf_nodes": range(50, 150, 10) "max_depth": range(1, 20) "min_samples_leaf": range(1, 20) "min_samples_split": range(2, 20)

model_complexity(tree.DecisionTreeClassifier(max_leaf_nodes=best_params["max_leaf_nodes"]), df_train, factors, response, {"max_depth": range(1, 20)}, "max_depth")

classifier = tree.DecisionTreeClassifier(max_depth=best_params["max_depth"], max_leaf_nodes=best_params["max_leaf_nodes"])
train_model(classifier, df_train, df_test, factors, response, "Final ")
tree.export_graphviz(classifier, out_file="tree_pruned.dot")

learning_curve(classifier, df_train, factors, response)
