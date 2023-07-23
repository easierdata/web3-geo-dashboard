import geopandas as gpd


def clip_tp_study_area(geom, study_area):
    """
    Reproject geometry to study area projection and clip to study area. Reset index because features are dropped during clipping.
    """
    geom.to_crs(study_area.crs, inplace=True)
    geom = gpd.clip(geom, study_area)
    geom.reset_index(inplace=True, drop=True)
    return geom


us_states_shp = gpd.read_file(
    "https://www2.census.gov/geo/tiger/GENZ2018/shp/cb_2018_us_state_20m.zip"
)[["geometry", "STUSPS"]]
continental_us = us_states_shp[
    us_states_shp["STUSPS"].isin(["AK", "HI", "PR", "VI", "GU", "AS", "MP", "UM"])
    is False
]  # Remove non-continental US states

landsat_scenes_shp = gpd.read_file(
    "https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/atoms/files/WRS2_descending_0.zip"
)[["PATH", "ROW", "geometry"]]
landsat_scenes_shp_clipped = clip_tp_study_area(landsat_scenes_shp, continental_us)
landsat_scenes_shp_clipped.to_file(
    "landsat_scenes_clipped_to_continential_us.geojson", driver="GeoJSON"
)
