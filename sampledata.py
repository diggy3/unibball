import pandas as pd
import numpy as np
import random
from faker import Faker

# Initialize Faker
fake = Faker()

# Constants
NUM_SAMPLES = 100
TEAMS = ['Briar Cliff', 'Iowa Central', 'Team USA', 'Manager Squad']
DATES = ['2024-05-15', '2024-03-20', '1776-07-04', '2000-01-01']
LOCATIONS = ['home', 'away']
PLAYERS = [str(i) for i in range(1, 16)]  # Player numbers 1 to 15

# Ensure that each team-date pair is represented equally
samples_per_team = NUM_SAMPLES // len(TEAMS)

# Generate sample data
data = []

for i in range(NUM_SAMPLES):
    opponent = TEAMS[i % len(TEAMS)]
    date = DATES[i % len(DATES)]
    location = random.choice(LOCATIONS)
    possession_number = random.randint(1, 100)
    change_sides_count = random.randint(0, 5)
    paint_touches_count = random.randint(0, 10)
    
    # Scoring logic
    two_pm = random.randint(0, 10)
    two_pa = two_pm + random.randint(0, 10)
    three_pm = random.randint(0, 5)
    three_pa = three_pm + random.randint(0, 5)
    ftm = random.randint(0, 5)
    fta = ftm + random.randint(0, 5)
    
    points_total = 2 * two_pm + 3 * three_pm + ftm
    
    off_foul = random.randint(0, 1)
    def_foul = random.randint(0, 1)
    turnover = random.randint(0, 1)
    off_reb = random.randint(0, 3)
    
    active_players = ', '.join(random.sample(PLAYERS, random.randint(5, 10)))
    
    data.append({
        'opponent': opponent,
        'date': date,
        'location': location,
        'possessionNumber': possession_number,
        'changeSidesCount': change_sides_count,
        'paintTouchesCount': paint_touches_count,
        '2pm': two_pm,
        '2pa': two_pa,
        '3pm': three_pm,
        '3pa': three_pa,
        'fta': fta,
        'ftm': ftm,
        'offFoul': off_foul,
        'defFoul': def_foul,
        'turnover': turnover,
        'offReb': off_reb,
        'pointsTotal': points_total,
        'activePlayers': active_players
    })

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv('sample_game_data.csv', index=False)

print("Sample data generated and saved to 'sample_game_data.csv'")
