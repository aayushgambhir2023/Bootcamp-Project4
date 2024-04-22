#Import libraries
from flask import Flask, jsonify, render_template, request
import json
from bson import json_util #, ObjectId
from pymongo import MongoClient
from scipy.stats import linregress
import numpy as np
import requests
import pickle

#Import ML Modules
from sklearn.linear_model import LinearRegression

#Create Flask App
app = Flask(__name__, static_url_path='/static')

#Call DB
client1 = MongoClient('mongodb+srv://city_toronto:project3@cluster0.gt72z8e.mongodb.net/')
db1 = client1['city_toronto']

# Set Collections
collection1_ak = db1['expense'] #UPLOADED MANUALLY
collection2_ak = db1['revenue'] #UPLOADED MANUALLY
collection3_ak = db1['total_year'] #UPLOADED MANUALLY
collection4_ak = db1['expense_sub_cat'] #UPLOADED MANUALLY
collection5_ak = db1['revenue_sub_cat'] #UPLOADED MANUALLY
collection6_ak = db1['cat_expense_year_total_2014_2023'] #UPLOADED MANUALLY
collection7_ak =  db1['cat_revenue_year_total_2014_2023'] #UPLOADED MANUALLY
wards_collection = db1["city_wards_data"] #UPLOADED MANUALLY
demographic_collection = db1["demographic_data"] #UPLOADED MANUALLY
statsexpense_collectiom = db1['stats_expenses']# UPLOADED VIA PYTHON CODE
statsrevenue_collectiom = db1['stats_revenue']# UPLOADED VIA PYTHON CODE
ol_all_outliers_rev_collection = db1['OL_all_outliers_rev'] # UPLOADED VIA PYTHON CODE
ol_all_outliers_exp_collection = db1['OL_all_outliers_exp'] # UPLOADED VIA PYTHON CODE
collections_program = { 
        2014: db1['pNl_program_2014'],# UPLOADED VIA PYTHON CODE
        2015: db1['pNl_program_2015'],# UPLOADED VIA PYTHON CODE
        2016: db1['pNl_program_2016'],# UPLOADED VIA PYTHON CODE
        2017: db1['pNl_program_2017'],# UPLOADED VIA PYTHON CODE
        2018: db1['pNl_program_2018'],# UPLOADED VIA PYTHON CODE
        2019: db1['pNl_program_2019'],# UPLOADED VIA PYTHON CODE
        2020: db1['pNl_program_2020'],# UPLOADED VIA PYTHON CODE
        2021: db1['pNl_program_2021'],# UPLOADED VIA PYTHON CODE
        2022: db1['pNl_program_2022'],# UPLOADED VIA PYTHON CODE
        2023: db1['pNl_program_2023']# UPLOADED VIA PYTHON CODE
}


############################# WEBAPP APIs  ###############################
#============================HomePage Start===============================
@app.route("/")
def welcome():
    return render_template('index.html')
#============================HomePage End===============================

#============================Categories Start===============================
## API to display all revenue data
@app.route('/api/v1.0/categories_rev', methods=['GET'])
def display_data_rev_ak():
    # Fetch data from MongoDB
    data = list(collection2_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)

## API to display all revenue data year wise, running a loop to make dynamic
@app.route('/api/v1.0/categories_rev/<int:year>', methods=['GET'])
def display_data_by_year_rev_ak(year):
    # Fetch data from MongoDB
    data = list(collection2_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    # Filter data by year
    year_data = []
    total_revenue_year = 0  # Initialize total revenue for the year
    
    for item in data:
        for key, value in item.items():
            if key.startswith("Revenue") and key.endswith(f"{year}(millions)"):
                total_revenue_year += value  # Add expense to total for the year

    # Calculate percentage share for each category
    for item in data:
        for key, value in item.items():
            if key.startswith("Revenue") and key.endswith(f"{year}(millions)"):
                category_name = item["Category Name"]
                revenue = value
                percentage_share = (revenue / total_revenue_year) * 100 if total_revenue_year != 0 else 0
                year_data.append({"Category Name": category_name, "Revenue": revenue, "Share": percentage_share})
    
    return jsonify(year_data)    

## API to display all expense data
@app.route('/api/v1.0/categories_exp', methods=['GET'])
def display_data_exp_ak():
    # Fetch data from MongoDB
    data = list(collection1_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)

## API to display all expense data year wise, running a loop to make dynamic

@app.route('/api/v1.0/categories_exp/<int:year>', methods=['GET'])
def display_data_by_year_exp_ak(year):
    # Fetch data from MongoDB
    data = list(collection1_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    # Filter data by year
    year_data = []
    total_expense_year = 0  # Initialize total expense for the year
    
    for item in data:
        for key, value in item.items():
            if key.startswith("Expense") and key.endswith(f"{year}(millions)"):
                total_expense_year += value  # Add expense to total for the year

    # Calculate percentage share for each category
    for item in data:
        for key, value in item.items():
            if key.startswith("Expense") and key.endswith(f"{year}(millions)"):
                category_name = item["Category Name"]
                expense = value
                percentage_share = (expense / total_expense_year) * 100 if total_expense_year != 0 else 0
                year_data.append({"Category Name": category_name, "Expense": expense, "Share": percentage_share})
    
    return jsonify(year_data)  
#============================Categories End===============================

#============================SubCat Start===============================
@app.route('/api/v1.0/categories_exp_subcat', methods=['GET'])
def display_data_exp_subcat_ak():
    # Fetch data from MongoDB
    data = list(collection4_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)

## API to display all sub category expense data year wise, running a loop to make dynamic
@app.route('/api/v1.0/categories_exp_subcat/<int:year>', methods=['GET'])
def display_data_by_year_exp_sub_cat_ak(year):
    # Fetch data from MongoDB
    data = list(collection4_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    # Filter data by year
    sub_cat_year_data = []
    total_sub_cat_expense_year = 0  # Initialize total expense for the year
    
    for item in data:
        for key, value in item.items():
            if key.startswith("Sub Expense") and key.endswith(f"{year}(millions)"):
                total_sub_cat_expense_year += value  # Add expense to total for the year

    # Calculate percentage share for each category
    for item in data:
        for key, value in item.items():
            if key.startswith("Sub Expense") and key.endswith(f"{year}(millions)"):
                sub_category_name = item["Sub-Category Name"]
                expense = value
                percentage_share = (expense / total_sub_cat_expense_year) * 100 if total_sub_cat_expense_year != 0 else 0
                sub_cat_year_data.append({"Sub-Category Name": sub_category_name, "Sub Expense": expense, "Share": percentage_share})
    
    return jsonify(sub_cat_year_data)

@app.route('/api/v1.0/categories_rev_subcat', methods=['GET'])
def display_data_rev_subcat_ak():
    # Fetch data from MongoDB
    data = list(collection5_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    return jsonify(data)


## API to display all sub category revenue data year wise, running a loop to make dynamic
@app.route('/api/v1.0/categories_rev_subcat/<int:year>', methods=['GET'])
def display_data_by_year_rev_sub_cat_ak(year):
    # Fetch data from MongoDB
    data = list(collection5_ak.find())
    
    # Convert ObjectId to string in each document
    for item in data:
        item['_id'] = str(item['_id'])
    
    # Filter data by year
    sub_cat_year_data_rev = []
    total_sub_cat_revenue_year = 0  # Initialize total expense for the year
    
    for item in data:
        for key, value in item.items():
            if key.startswith("Sub Revenue") and key.endswith(f"{year}(millions)"):
                total_sub_cat_revenue_year += value  # Add expense to total for the year

    # Calculate percentage share for each category
    for item in data:
        for key, value in item.items():
            if key.startswith("Sub Revenue") and key.endswith(f"{year}(millions)"):
                category_name = item["Sub-Category Name"]
                revenue = value
                percentage_share = (revenue / total_sub_cat_revenue_year) * 100 if total_sub_cat_revenue_year != 0 else 0
                sub_cat_year_data_rev.append({"Sub-Category Name": category_name, "Sub Revenue": revenue, "Share": percentage_share})
    
    return jsonify(sub_cat_year_data_rev)       
#============================SubCat End===============================

#============================EDA Start===============================
@app.route('/api/v1.0/statsexp', methods=['GET'])
def get_stats_expense():
    # Fetch data from MongoDB collection and exclude the _id field
    stats3 = statsexpense_collectiom.find_one({}, {'_id': 0})

    return jsonify(stats3)

@app.route('/api/v1.0/statsrev', methods=['GET'])
def get_stats_revenue():
    # Fetch data from MongoDB collection and exclude the _id field
    stats2 = statsrevenue_collectiom.find_one({}, {'_id': 0})

    return jsonify(stats2)
#============================EDA End===============================

#============================Category Outliers Start===============================
@app.route('/api/v1.0/revenue_data_mm', methods=['GET'])
def get_revenue_data():
    # Optional: Use request arguments to filter by year or category, if needed
    year = request.args.get('year', type=int)
    category = request.args.get('category')

    query = {}
    if year:
        query['year'] = year
    if category:
        query['Category Name'] = category

    # Fetch data from MongoDB using the constructed query
    OLrevdata = list(ol_all_outliers_rev_collection.find(query))

    # Convert MongoDB ObjectId to string
    for item in OLrevdata:
        item['_id'] = str(item['_id'])

    # Return the data as JSON
    return jsonify(OLrevdata)


@app.route('/api/v1.0/expense_data_mm', methods=['GET'])
def get_expense_data():
    # Optional: Use request arguments to filter by year or category, if needed
    year = request.args.get('year', type=int)
    category = request.args.get('category')

    query = {}
    if year:
        query['year'] = year
    if category:
        query['Category Name'] = category

    # Fetch data from MongoDB using the constructed query
    OLexpdata = list(ol_all_outliers_exp_collection.find(query))

    # Convert MongoDB ObjectId to string
    for item in OLexpdata:
        item['_id'] = str(item['_id'])

    # Return the data as JSON
    return jsonify(OLexpdata)
#============================Category Outliers End===============================

#============================Program by Year Start===============================
@app.route('/api/program_analysis/<year>')
def get_program_analysis(year):
    # Get parameters from request

    coll = db1[f"pNl_program_{year}"]
    program_data = list(coll.find())
    return jsonify(json.loads(json_util.dumps(program_data)))

@app.route('/api/v1.0/summarized_revenue_data/<int:year>', methods=['GET'])
def summarized_revenue_data(year):
    summarized_revenue_data = summarize_data(year, 'rev')
    return jsonify(summarized_revenue_data)

@app.route('/api/v1.0/summarized_expense_data/<int:year>', methods=['GET'])
def summarized_expense_data(year):
    summarized_expense_data = summarize_data(year, 'exp')
    return jsonify(summarized_expense_data)

@app.route('/api/v1.0/summarized_profit_data/<int:year>', methods=['GET'])
def summarized_profit_data(year):
    summarized_profit_data = summarize_data(year, f'res-{year}')
    return jsonify(summarized_profit_data)

def summarize_data(year, field):
    summarized_data = {}
    data = list(collections_program[year].find())

    for item in data:
        program = item["Program"]
        value = item.get(field, 0)
        summarized_data[program] = summarized_data.get(program, 0) + value

    return summarized_data
#============================Program by Year End===============================

#============================Program All Years Start===============================
@app.route('/api/program_analysis/all/')
def get_program_analysis_all():
    # Get parameters from request

    yearlist = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"]
    program_data = []

    for year in yearlist:
        coll = db1[f"pNl_program_{year}"]
        program_data.append(coll.find())

    return jsonify(json.loads(json_util.dumps(program_data)))
#============================Program All Years End===============================

#============================Demographic Data Start===============================
@app.route('/api/v1.0/city_wards_geo', methods=['GET'])
def display_ward_geo():
    ward_geo = list(wards_collection.find())

    for item in ward_geo:
        item['_id'] = str(item['_id'])
    
    return jsonify(ward_geo)

@app.route('/api/v1.0/demographic_data_2022_budget', methods = ['GET'])
def display_data_demo():
    demographic_data = list(demographic_collection.find())

    for item in demographic_data:
        item['_id'] = str(item['_id'])
    
    return jsonify(demographic_data)

#route to data for plotting
@app.route('/api/v1.0/demographic_graph_data', methods = ['GET'])
def graph_data():
    graph_type = request.args.get("graph_type")  
    #3 options: /demographic_graph_data?graph_type=population_density,/demographic_graph_data?graph_type=median_income,/demographic_graph_data?graph_type=average_income
    cursor = demographic_collection.find({})
    data = list(cursor)

    x_values = []
    y_values = []
    if graph_type == "population_density":
        # data for population graph
        x_values = [entry["Population density per square kilometre"] for entry in data]
        y_values = [entry["2022 Budget"] for entry in data]
    elif graph_type == "median_income":
        # data for median income graph
        x_values = [entry["Median total income in 2020 among recipients ($)"] for entry in data]
        y_values = [entry["2022 Budget"] for entry in data]
    elif graph_type == "average_income":
        # data for average income graph
        x_values = [entry["Average total income in 2020 among recipients ($)"] for entry in data]
        y_values = [entry["2022 Budget"] for entry in data]

    # linear regression calculation
    slope, intercept, r_value, p_value, std_err = linregress(x_values, y_values)
    regress_values = [slope * x + intercept for x in x_values]
    regression_equation = f"y = {slope:.4f}x + {intercept:.4f}"

    response_data = {
        "x_values": x_values,
        "y_values": y_values,
        "regress_values": regress_values,
        "r_value": r_value,
        "regression_equation": regression_equation
    }
    return jsonify(response_data)
#============================Demographic Data End===============================

#============================ML Forecasting Categories Start===============================
#Anuradha's ML Code
## Linear regression for five years all categories
API_ENDPOINT_exp = "http://127.0.0.1:5000/api/v1.0/categories_exp"

@app.route('/api/v1.0/linear_regression_exp', methods=['GET'])
def linear_regression_exp_ak():
    try:
        categories = {}
        
        # Fetch data from API
        response = requests.get(API_ENDPOINT_exp)
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch data from API"}), 500
        
        data = response.json()
        
        # Aggregate expenses for each category
        for item in data:
            category_name = item["Category Name"]
            for key, value in item.items():
                if key.startswith("Expense"):
                    year = key.split()[1].split('(')[0]
                    if category_name not in categories:
                        categories[category_name] = {"expenses": {year: value}}
                    else:
                        categories[category_name]["expenses"][year] = value
        
        # Perform linear regression for each category
        for category, category_data in categories.items():
            years = list(map(int, category_data["expenses"].keys()))
            expenses = list(category_data["expenses"].values())
            expenses_array = np.array(expenses).reshape(-1, 1)  # Reshape expenses for sklearn
            model = LinearRegression().fit(np.array(years).reshape(-1, 1), expenses_array)  # Fit linear regression model
            category_data["slope"] = model.coef_[0][0]  # Slope of the linear regression line
            category_data["intercept"] = model.intercept_[0]  # Intercept of the linear regression line
        
        return jsonify(categories)
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "An error occurred while processing the request"}), 500
    
## Linear regression for five years all categories
API_ENDPOINT_rev = "http://127.0.0.1:5000/api/v1.0/categories_rev"

@app.route('/api/v1.0/linear_regression_rev', methods=['GET'])
def linear_regression_rev_ak():
    try:
        categories = {}
        
        # Fetch data from API
        response = requests.get(API_ENDPOINT_rev)
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch data from API"}), 500
        
        data = response.json()
        
        # Aggregate expenses for each category
        for item in data:
            category_name = item["Category Name"]
            for key, value in item.items():
                if key.startswith("Revenue"):
                    year = key.split()[1].split('(')[0]
                    if category_name not in categories:
                        categories[category_name] = {"revenues": {year: value}}
                    else:
                        categories[category_name]["revenues"][year] = value
        
        # Perform linear regression for each category
        for category, category_data in categories.items():
            years = list(map(int, category_data["revenues"].keys()))
            expenses = list(category_data["revenues"].values())
            revenues_array = np.array(expenses).reshape(-1, 1)  # Reshape revenues for sklearn
            model = LinearRegression().fit(np.array(years).reshape(-1, 1), revenues_array)  # Fit linear regression model
            category_data["slope"] = model.coef_[0][0]  # Slope of the linear regression line
            category_data["intercept"] = model.intercept_[0]  # Intercept of the linear regression line
        
        return jsonify(categories)
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "An error occurred while processing the request"}), 500
    
#--------------------------------------------

#API for Actual Vs Predictions for Category-Expense 2014-2023 and forecasts therefater-----API_1
# Route to get actual and predicted values for each year-LINEAR REGRESSION
@app.route('/api/v1.0/linear_regress/actual_vs_predicted/<int:start_year>/<int:end_year>', methods=['GET'])
def exp_actual_vs_predicted_linear_regress_ak(start_year, end_year):
    # Load the trained model
    with open('ML_modules/category_forecast/trained_models/linear_regression_model.pkl', 'rb') as f:
        model = pickle.load(f)

    # Prepare data for the specified range of years
    years = list(range(start_year, end_year + 1))
    actual_values = []
    predicted_values = []

    response = {}
    for year in years:
        # Retrieve actual expense from MongoDB collection
        document = collection6_ak.find_one({'Year': year})
        if document and 'Total' in document:
            actual_expense = document['Total']
            actual_values.append(actual_expense)
            predicted_value = model.predict([[year]])[0]
            predicted_values.append(predicted_value)
            response[year] = {'Actual': actual_expense, 'Prediction': predicted_value}
        else:
            predicted_value = model.predict([[year]])[0]
            response[year] = {'Prediction': predicted_value}

    # Prepare response

    return jsonify(response)

#--------------------------------------------
#API for Actual Vs Predictions for Category-Expense 2014-2023 and forecasts therefater-----API_2
# Route to get actual and predicted values for each year-polynomial REGRESSION
@app.route('/api/v1.0/poly_regress/actual_vs_predicted/<int:start_year>/<int:end_year>', methods=['GET'])
def exp_actual_vs_predicted_poly_regress_ak(start_year, end_year):
    # Load the trained model
    with open('ML_modules/category_forecast/trained_models/polynomial_regression_model.pkl', 'rb') as f:
        model = pickle.load(f)

    # Prepare data for the specified range of years
    years = list(range(start_year, end_year + 1))
    actual_values = []
    predicted_values = []

    response = {}
    for year in years:
        # Retrieve actual expense from MongoDB collection
        document = collection6_ak.find_one({'Year': year})
        if document and 'Total' in document:
            actual_expense = document['Total']
            actual_values.append(actual_expense)
            predicted_value = model.predict([[year]])[0]
            predicted_values.append(predicted_value)
            response[year] = {'Actual': actual_expense, 'Prediction': predicted_value}
        else:
            predicted_value = model.predict([[year]])[0]
            response[year] = {'Prediction': predicted_value}

    # Prepare response

    return jsonify(response)

#--------------------------------------------

#API for Actual Vs Predictions for Category-Revenue 2014-2023 and forecasts therefater------API_3
# Route to get actual and predicted values for each year-LINEAR REGRESSION
@app.route('/api/v1.0/linear_regress_rev/actual_vs_predicted/<int:start_year>/<int:end_year>', methods=['GET'])
def rev_actual_vs_predicted_linear_regress_ak(start_year, end_year):
    # Load the trained model
    with open('ML_modules/category_forecast/trained_models/linear_regression_model_rev.pkl', 'rb') as f:
        model = pickle.load(f)

    # Prepare data for the specified range of years
    years = list(range(start_year, end_year + 1))
    actual_values = []
    predicted_values = []

    response = {}
    for year in years:
        # Retrieve actual expense from MongoDB collection
        document = collection7_ak.find_one({'Year': year})
        if document and 'Total' in document:
            actual_revenue = document['Total']
            actual_values.append(actual_revenue)
            predicted_value = model.predict([[year]])[0]
            predicted_values.append(predicted_value)
            response[year] = {'Actual': actual_revenue, 'Prediction': predicted_value}
        else:
            predicted_value = model.predict([[year]])[0]
            response[year] = {'Prediction': predicted_value}

    # Prepare response

    return jsonify(response)

#--------------------------------------------
#API for Actual Vs Predictions for Category-Revenue 2014-2023 and forecasts therefater------API_4
# Route to get actual and predicted values for each year-SVM REGRESSION
@app.route('/api/v1.0/poly_regress_rev/actual_vs_predicted/<int:start_year>/<int:end_year>', methods=['GET'])
def rev_actual_vs_predicted_poly_regress_ak(start_year, end_year):
    # Load the trained model
    with open('ML_modules/category_forecast/trained_models/polynomial_regression_model_rev.pkl', 'rb') as f:
        model = pickle.load(f)

    # Prepare data for the specified range of years
    years = list(range(start_year, end_year + 1))
    response = {}

    for year in years:
        # Retrieve actual expense from MongoDB collection
        document = collection7_ak.find_one({'Year': year})
        if document and 'Total' in document:
            actual_revenue = document['Total']
            # Reshape the input to have two dimensions
            year_input = np.array([[year]])
            predicted_value = model.predict(year_input)[0]
            response[year] = {'Actual': actual_revenue, 'Prediction': predicted_value}
        else:
            # Reshape the input to have two dimensions
            year_input = np.array([[year]])
            predicted_value = model.predict(year_input)[0]
            response[year] = {'Prediction': predicted_value}

    # Prepare response
    return jsonify(response)


#API for Actual Vs Predictions for Category-Expense 2014-2027 and forecasts thereafter-----API_1.1
# Route to get actual and predicted values for each year-LINEAR REGRESSION
@app.route('/api/v1.0/linear_regress_exp/actual_vs_predicted/static', methods=['GET'])
def exp_actual_vs_predicted_linear_regress_static():
    # Load the trained model
    with open('ML_modules/category_forecast/trained_models/linear_regression_model.pkl', 'rb') as f:
        model = pickle.load(f)

    # Define years range
    start_year = 2014
    end_year = 2028

    # Prepare data for the specified range of years
    years = list(range(start_year, end_year + 1))
    actual_values = []
    predicted_values = []

    response = {}
    for year in years:
        # Retrieve actual expense from MongoDB collection
        document = collection6_ak.find_one({'Year': year})
        if document and 'Total' in document:
            actual_expense = document['Total']
            actual_values.append(actual_expense)
            predicted_value = model.predict([[year]])[0]
            predicted_values.append(predicted_value)
            response[year] = {'Actual': actual_expense, 'Prediction': predicted_value}
        else:
            predicted_value = model.predict([[year]])[0]
            response[year] = {'Prediction': predicted_value}

    # Prepare response
    return jsonify(response)


#API for Actual Vs Predictions for Category-Expense 2014-2028 and forecasts thereafter-----API_2.2
# Route to get actual and predicted values for each year-polynomial REGRESSION
@app.route('/api/v1.0/poly_regress_exp/actual_vs_predicted/static', methods=['GET'])
def exp_actual_vs_predicted_poly_regress_static():
    # Load the trained model
    with open('ML_modules/category_forecast/trained_models/polynomial_regression_model.pkl', 'rb') as f:
        model = pickle.load(f)

    # Define years range
    start_year = 2014
    end_year = 2028

    # Prepare data for the specified range of years
    years = list(range(start_year, end_year + 1))
    actual_values = []
    predicted_values = []

    response = {}
    for year in years:
        # Retrieve actual expense from MongoDB collection
        document = collection6_ak.find_one({'Year': year})
        if document and 'Total' in document:
            actual_expense = document['Total']
            actual_values.append(actual_expense)
            predicted_value = model.predict([[year]])[0]
            predicted_values.append(predicted_value)
            response[year] = {'Actual': actual_expense, 'Prediction': predicted_value}
        else:
            predicted_value = model.predict([[year]])[0]
            response[year] = {'Prediction': predicted_value}

    # Prepare response
    return jsonify(response)

#API for Actual Vs Predictions for Category-Revenue 2014-2028 and forecasts thereafter------API_3.3
# Route to get actual and predicted values for each year-LINEAR REGRESSION
@app.route('/api/v1.0/linear_regress_rev/actual_vs_predicted/static', methods=['GET'])
def rev_actual_vs_predicted_linear_regress_static():
    # Load the trained model
    with open('ML_modules/category_forecast/trained_models/linear_regression_model_rev.pkl', 'rb') as f:
        model = pickle.load(f)

    # Define years range
    start_year = 2014
    end_year = 2028

    # Prepare data for the specified range of years
    years = list(range(start_year, end_year + 1))
    actual_values = []
    predicted_values = []

    response = {}
    for year in years:
        # Retrieve actual revenue from MongoDB collection
        document = collection7_ak.find_one({'Year': year})
        if document and 'Total' in document:
            actual_revenue = document['Total']
            actual_values.append(actual_revenue)
            predicted_value = model.predict([[year]])[0]
            predicted_values.append(predicted_value)
            response[year] = {'Actual': actual_revenue, 'Prediction': predicted_value}
        else:
            predicted_value = model.predict([[year]])[0]
            response[year] = {'Prediction': predicted_value}

    # Prepare response
    return jsonify(response)

#API for Actual Vs Predictions for Category-Revenue 2014-2028 and forecasts thereafter------API_4.4
# Route to get actual and predicted values for each year-polynomial REGRESSION
@app.route('/api/v1.0/poly_regress_rev/actual_vs_predicted/static', methods=['GET'])
def rev_actual_vs_predicted_poly_regress_static():
    # Load the trained model
    with open('ML_modules/category_forecast/trained_models/polynomial_regression_model_rev.pkl', 'rb') as f:
        model = pickle.load(f)

    # Define years range
    start_year = 2014
    end_year = 2028

    # Prepare data for the specified range of years
    years = list(range(start_year, end_year + 1))
    response = {}

    for year in years:
        # Retrieve actual revenue from MongoDB collection
        document = collection7_ak.find_one({'Year': year})
        if document and 'Total' in document:
            actual_revenue = document['Total']
            # Reshape the input to have two dimensions
            year_input = np.array([[year]])
            predicted_value = model.predict(year_input)[0]
            response[year] = {'Actual': actual_revenue, 'Prediction': predicted_value}
        else:
            # Reshape the input to have two dimensions
            year_input = np.array([[year]])
            predicted_value = model.predict(year_input)[0]
            response[year] = {'Prediction': predicted_value}

    # Prepare response
    return jsonify(response)


#--------------------------------------------

#============================ML Forecasting Categories End===============================

#============================ML Clustering Categories Start===============================
#Muskan's ML Code
#============================ML Clustering Categories End===============================

#============================ML Forecasting Programs Start===============================
#Aayush's ML Code
#============================ML Forecasting Programs End===============================

#============================ML Clustering Programs Start===============================
#Lucas's ML Code
#============================ML Clustering Programs End===============================

#============================ML Clustering Demographics Start===============================
#Jason's Supercode
#============================ML Clustering Demographics End===============================

############################# OTHER APIs  ###############################

#Run App
if __name__ == '__main__':
    app.run(debug=True)