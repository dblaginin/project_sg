import matplotlib.pyplot as plt
from pandas.plotting import scatter_matrix
from utilities import load_magic04, load_wine

df, factors, response = load_wine()
x, y = "alcohol", "density"

# df, factors, response = load_magic04()
# x, y = "fAlpha", "fLength"

print(df.head())
print(df.info())
print(df.describe())
print(df[response].value_counts())
print("Baseline: ", 1 - df[response].mean())

print(df.corr()[response].sort_values(ascending=False))

df.drop(response, 1).hist(bins=50, figsize=(20,5), layout=(2,6))
plt.show()

scatter_matrix(df, figsize=(12, 8))
plt.show()

df.plot(kind="scatter", x=x, y=y, alpha=0.4, c=response, cmap=plt.get_cmap("jet"), colorbar=True)
plt.show()
