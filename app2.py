import streamlit as st
import pandas as pd
import os

# Constants
DATA_FOLDER = "data"
csv_file = os.path.join(DATA_FOLDER, 'game_data.csv')

# Load data from CSV
if os.path.exists(csv_file):
    df = pd.read_csv(csv_file)
else:
    st.error("CSV file not found.")
    st.stop()

# Title of the App
st.title('Data Table')

# Sidebar for filters
st.sidebar.header('Filter Options')

# Filter by date
unique_dates = df['date'].unique().tolist()
selected_dates = st.sidebar.multiselect('Select Date(s)', unique_dates)

# Filter by opponent
unique_opponents = df['opponent'].unique().tolist()
selected_opponents = st.sidebar.multiselect('Select Opponent(s)', unique_opponents)

# Filter by location
unique_locations = df['location'].unique().tolist()
selected_locations = st.sidebar.multiselect('Select Location(s)', unique_locations)

# Function to apply filters
def apply_filters(df, dates, opponents, locations):
    if dates:
        df = df[df['date'].isin(dates)]
    if opponents:
        df = df[df['opponent'].isin(opponents)]
    if locations:
        df = df[df['location'].isin(locations)]
    return df

# Apply the filters to the DataFrame
filtered_df = apply_filters(df, selected_dates, selected_opponents, selected_locations)

# Collapsible section for filtered data
with st.expander("Show/Hide Filtered Data"):
    st.write("Filtered Data", filtered_df)

# Calculate and display overall statistics
if not filtered_df.empty:
    total_possessions = len(filtered_df)
    average_points_per_possession = filtered_df['pointsTotal'].mean()
    average_paint_touches = filtered_df['paintTouchesCount'].mean()
    average_side_changes = filtered_df['changeSidesCount'].mean()

    # Display overall statistics horizontally
    st.subheader('Overall Statistics')
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Total Possessions", total_possessions)
    col2.metric("Avg Points per Possession", f"{average_points_per_possession:.2f}")
    col3.metric("Avg Paint Touches", f"{average_paint_touches:.2f}")
    col4.metric("Avg Side Changes", f"{average_side_changes:.2f}")
else:
    st.warning("No data available for the selected filters.")
