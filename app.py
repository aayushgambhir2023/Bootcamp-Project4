#Import libraries
from flask import Flask, jsonify, render_template, request
import json
from bson import json_util #, ObjectId
from pymongo import MongoClient
from scipy.stats import linregress

#Create Flask App
app = Flask(__name__, static_url_path='/static')

#Call DB
client1 = MongoClient('mongodb+srv://city_toronto:project3@cluster0.gt72z8e.mongodb.net/')
db1 = client1['city_toronto']

client2 = MongoClient('mongodb+srv://catdb:projectboot@catdbcluster.n7tfznu.mongodb.net/')
db2 = client2['cat_db']

# Set Collections
collection1_ak = db2['expense'] #UPLOADED MANUALLY
collection2_ak = db2['revenue'] #UPLOADED MANUALLY
wards_collection = db1["city_wards_data"] #UPLOADED MANUALLY
demographic_collection = db1["demographic_data"] #UPLOADED MANUALLY
statsexpense_collectiom = db1['stats_expenses']# UPLOADED VIA PYTHON CODE
statsrevenue_collectiom = db1['stats_revenue']# UPLOADED VIA PYTHON CODE
ol_all_outliers_rev_collection = db1['OL_all_outliers_rev'] # UPLOADED VIA PYTHON CODE
ol_all_outliers_exp_collection = db1['OL_all_outliers_exp'] # UPLOADED VIA PYTHON CODE
collections_program = { 
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
#============================Categories End===============================

#============================SubCat Start===============================
   
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

    yearlist = ["2019", "2020", "2021", "2022", "2023"]
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

#============================ML Categories Start===============================
#============================ML Categories End===============================

#============================ML Programs Start===============================
#============================ML Programs End===============================

#============================ML Demographics Start===============================
#============================ML Demographics End===============================

############################# OTHER APIs  ###############################

#Run App
if __name__ == '__main__':
    app.run(debug=True)