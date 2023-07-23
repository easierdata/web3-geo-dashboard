import geopandas as gpd
us_states_shp = gpd.read_file("https://www2.census.gov/geo/tiger/GENZ2018/shp/cb_2018_us_state_20m.zip")[["geometry", "STUSPS"]]
us_states_shp = us_states_shp[us_states_shp["STUSPS"].isin(["AK", "HI", "PR", "VI", "GU", "AS", "MP", "UM"]) == False] # Remove non-continental US states
# Save to GeoJSON
us_states_shp.to_file("us_states.geojson", driver="GeoJSON")

