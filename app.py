from flask import Flask, render_template, request, jsonify
import pandas as pd
import os

app = Flask(__name__)

DATA_FOLDER = "data"
os.makedirs(DATA_FOLDER, exist_ok=True)
csv_file = os.path.join(DATA_FOLDER, 'game_data.csv')

# Load data from CSV
if os.path.exists(csv_file):
    df = pd.read_csv(csv_file)
else:
    df = pd.DataFrame()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/input')
def input_page():
    return render_template('input.html')

@app.route('/tracking')
def tracking():
    return render_template('tracking.html')

@app.route('/write_to_csv', methods=['POST'])
def write_to_csv():
    data = request.get_json()
    csv_file = os.path.join(DATA_FOLDER, 'game_data.csv')

    # Prepare data for DataFrame
    rows = [{
        'opponent': data['opponent'],
        'date': data['date'],
        'location': data['location'],
        'possessionNumber': data['possessionNumber'],
        'changeSidesCount': data['changeSidesCount'],
        'paintTouchesCount': data['paintTouchesCount'],
        '2pm': data['stats']['2pm'],
        '2pa': data['stats']['2pa'],
        '3pm': data['stats']['3pm'],
        '3pa': data['stats']['3pa'],
        'fta': data['stats']['fta'],
        'ftm': data['stats']['ftm'],
        'offFoul': data['stats']['offFoul'],
        'defFoul': data['stats']['defFoul'],
        'turnover': data['stats']['turnover'],
        'offReb': data['stats']['offReb'],
        'pointsTotal': data['pointsTotal'],  # Include points total if needed
        'activePlayers': ', '.join(data['activePlayers']), # Join player numbers as a string
    }]

    # Create DataFrame and write to CSV (append mode)
    df = pd.DataFrame(rows)
    df.to_csv(csv_file, mode='a', header=not os.path.isfile(csv_file), index=False)

    return '', 204  # No content response

@app.route('/get_averages', methods=['GET'])
def get_averages():
    csv_file = os.path.join(DATA_FOLDER, 'game_data.csv')
    
    # Read the CSV file
    df = pd.read_csv(csv_file)

    # Get date, opponent, and location from query parameters
    selected_dates = request.args.getlist('date')
    selected_opponents = request.args.getlist('opponent')
    selected_locations = request.args.getlist('location')

    # Filter the DataFrame by the selected dates
    if selected_dates:
        df = df[df['date'].isin(selected_dates)]

    # Filter by opponents if provided
    if selected_opponents:
        df = df[df['opponent'].isin(selected_opponents)]

    # Filter by locations if provided
    if selected_locations:
        df = df[df['location'].isin(selected_locations)]

    # Calculate total possessions
    total_possessions = len(df)

    # Calculate averages
    average_points_per_possession = df['pointsTotal'].mean() if total_possessions > 0 else 0
    average_paint_touches = df['paintTouchesCount'].mean() if total_possessions > 0 else 0
    average_side_changes = df['changeSidesCount'].mean() if total_possessions > 0 else 0

    # Prepare averages and total possessions as a dictionary
    averages = {
        'total_possessions': total_possessions,
        'average_points_per_possession': average_points_per_possession,
        'average_paint_touches': average_paint_touches,
        'average_side_changes': average_side_changes,
        'selected_opponents': selected_opponents,
        'selected_dates': selected_dates,
        'selected_locations': selected_locations,
    }

    return jsonify(averages)  # Return the complete dictionary

@app.route('/paint_touches_impact', methods=['GET'])
def paint_touches_impact():
    csv_file = os.path.join(DATA_FOLDER, 'game_data.csv')

    # Read the CSV file
    df = pd.read_csv(csv_file)

    # Calculate average points per possession for each number of paint touches
    paint_touches_impact = df.groupby('paintTouchesCount')['pointsTotal'].mean().reset_index()

    # Prepare data for chart
    data = {
        'labels': paint_touches_impact['paintTouchesCount'].tolist(),
        'pointsPerPossession': paint_touches_impact['pointsTotal'].tolist()
    }

    return jsonify(data)  # Return the data for the chart

@app.route('/side_changes_impact', methods=['GET'])
def side_changes_impact():
    csv_file = os.path.join(DATA_FOLDER, 'game_data.csv')

    # Read the CSV file
    df = pd.read_csv(csv_file)

    # Calculate average points per possession for each number of side changes
    side_changes_impact = df.groupby('changeSidesCount')['pointsTotal'].mean().reset_index()

    # Prepare data for chart
    data = {
        'labels': side_changes_impact['changeSidesCount'].tolist(),
        'pointsPerPossession': side_changes_impact['pointsTotal'].tolist()
    }

    return jsonify(data)  # Return the data for the chart

@app.route('/data', methods=['GET'])
def data_page():
    # Ensure data is loaded if CSV exists
    if os.path.exists(csv_file):
        df = pd.read_csv(csv_file)
    else:
        df = pd.DataFrame()

    # Extract unique dates, opponents, and locations for the filter dropdowns
    unique_dates = df['date'].unique().tolist() if not df.empty else []
    unique_opponents = df['opponent'].unique().tolist() if not df.empty else []
    unique_locations = df['location'].unique().tolist() if not df.empty else []
    return render_template('data.html', unique_dates=unique_dates, unique_opponents=unique_opponents, unique_locations=unique_locations)

if __name__ == '__main__':
    app.run(debug=True)
