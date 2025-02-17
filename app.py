import streamlit as st
import requests
import pandas as pd

# API URL for the Node.js backend
API_URL = "https://calorie-tracker-1-8kxd.onrender.com/api/calorieData"

# Title of the web app
st.title("Calorie Tracker")

# Display the form to add a new calorie record
with st.form(key="add_form"):
    date = st.date_input("Date")

    day_of_week = st.selectbox(
        "Day of the Week",
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    )
    calories_consumed = st.number_input("Calories Consumed", min_value=0)
    calories_burned = st.number_input("Calories Burned", min_value=0)
    net_calories = calories_consumed - calories_burned
    weight = st.number_input("Weight (kg)", min_value=0.0, format="%.2f")
    notes = st.text_area("Notes (e.g., workout type, diet details, mood, etc.)")

    submit_button = st.form_submit_button("Add Calorie Data")

    if submit_button:
        # Send the POST request to the backend API
        calorie_data = {
            "date": str(date),
            "dayOfWeek": day_of_week,
            "caloriesConsumed": calories_consumed,
            "caloriesBurned": calories_burned,
            "netCalories": net_calories,
            "weight": weight,
            "notes": notes,
        }
        response = requests.post(API_URL, json=calorie_data)
        if response.status_code == 201:
            st.success("Calorie data added successfully!")
        else:
            st.error("Error adding data")

# Display all calorie data
st.header("Calorie Records")

response = requests.get(API_URL)
if response.status_code == 200:
    calorie_data = response.json()
    df = pd.DataFrame(calorie_data)
    st.dataframe(df)
else:
    st.error("Failed to fetch data")
