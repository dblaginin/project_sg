import timeit
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from sklearn import model_selection, preprocessing


def load_magic04():
    response = "class"
    factors = ["fLength", "fWidth", "fSize", "fConc", "fConc1", "fAsym", "fM3Long", "fM3Trans", "fAlpha", "fDist"]
    df = pd.read_csv("magic04.data", header=None)
    df.columns = factors + [response]
    df[response] = np.where(df[response] == "g", 1, 0)  # gamma (signal) = 1, hadron (background) = 0
    return df, factors, response


def load_wine():
    response = "quality"
    df = pd.read_csv("winequality-white.csv", sep=";")
    df[response] = np.where(df[response] > 6, 1, 0)  # considering good when quality > 6
    return df, df.columns.values[:11], response


def scale_data(df, response, rs=7):
    df = pd.DataFrame(preprocessing.MinMaxScaler().fit_transform(df.values), index=df.index, columns=df.columns)
    return model_selection.train_test_split(df, test_size=0.2, random_state=rs, stratify=df[response])


def train_model(classifier, df_train, df_test, factors, response, prefix="Initial "):
    start_time = timeit.default_timer()
    classifier.fit(df_train[factors], df_train[response])
    print(prefix + "Training ", timeit.default_timer() - start_time, " sec")
    print(prefix + "Train Accuracy =", classifier.score(df_train[factors], df_train[response]))
    if df_test is not None:
        start_time = timeit.default_timer()
        test_score = classifier.score(df_test[factors], df_test[response])
        print(prefix + "Testing ", timeit.default_timer() - start_time, " sec")
        print(prefix + "Test Accuracy =", test_score)
    print(classifier)


def tune_hyperparameters(classifier, df_train, factors, response, param_grid):
    start_time = timeit.default_timer()
    grid_search = model_selection.GridSearchCV(classifier, param_grid, cv=5)
    grid_search.fit(df_train[factors], df_train[response])
    print("Grid Search Took ", timeit.default_timer() - start_time, " sec")
    print("Best Score = ", grid_search.best_score_)
    print("Best Parameters = ", grid_search.best_params_)
    print(grid_search.best_estimator_)
    return grid_search.best_params_


def model_complexity(classifier, df_train, factors, response, param_grid, param, transform=lambda x: x, xlog=False):
    grid_search = model_selection.GridSearchCV(classifier, param_grid, cv=5)
    grid_search.fit(df_train[factors], df_train[response])
    plt.plot([transform(e[param]) for e in grid_search.cv_results_["params"]], grid_search.cv_results_["mean_test_score"], "ro")
    if xlog: plt.xscale("log")
    show_graph("Model Complexity", param, "Accuracy")


def learning_curve(classifier, df_train, factors, response, points=20):
    train_sizes, train_scores, valid_scores = model_selection.learning_curve(classifier, df_train[factors], df_train[response], train_sizes=np.linspace(0.1, 1.0, points), cv=5, random_state=7)
    plt.plot(train_sizes, np.mean(train_scores, axis=1), "rs", train_sizes, np.mean(valid_scores, axis=1), "gs")
    plt.legend(handles=[patches.Patch(color='red', label='Train'), patches.Patch(color='green', label='CV')])
    show_graph("Learning Curve", "Training Size", "Accuracy")


def show_graph(title, xlabel, ylabel):
    plt.title(title)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.show()
