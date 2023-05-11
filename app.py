from flask import Flask, render_template

from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

import pandas as pd
import json


app = Flask(__name__)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 25
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route('/')
def data():
    df = pd.read_csv('static/data/agriRuralDevelopmentFilled.csv', index_col=0)

    random_countries = pd.Series(df['Country Name'].unique()).sample(n=40)
    random_sample = df[df['Country Name'].isin(random_countries)]
    countries = random_sample.to_json(orient='records')

    # PCA
    X = random_sample.loc[random_sample['year'] == random_sample['year'].max(), 'Access to electricity (% of population)':'Surface area (sq. km)']
    X = StandardScaler().fit_transform(X)

    # Computing the PCA with 2 components
    pc = PCA(n_components=2).fit_transform(X)

    df_pca = pd.DataFrame({
        'Country Name': random_sample['Country Name'].unique(),
        'Country Code': random_sample['Country Code'].unique(),
        'PC1': pc[:, 0],
        'PC2': pc[:, 1]
    }).to_json(orient='records')

    return render_template("index.html", countries_data=countries, pca_data=df_pca)


if __name__ == '__main__':
    app.run()
