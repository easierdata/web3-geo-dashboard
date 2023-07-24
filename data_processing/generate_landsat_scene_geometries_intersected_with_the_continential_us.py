import geopandas as gpd
from geopandas.tools import sjoin


def get_intersecting_scenes(
    geom: gpd.GeoDataFrame, study_area: gpd.GeoDataFrame
) -> gpd.GeoDataFrame:
    """
    Reproject geometry to match study area and identify scenes intersecting with the study area.
    Reset index because features may be dropped during intersection.
    """
    geom = geom.to_crs(study_area.crs)
    
    # Use Intersects instead of clip to maintain whole scenes
    intersecting_scenes = sjoin(geom, study_area, how="inner", op="intersects") 
    intersecting_scenes.reset_index(inplace=True, drop=True)
    return intersecting_scenes


us_states_shp: gpd.GeoDataFrame = gpd.read_file(
    "https://www2.census.gov/geo/tiger/GENZ2018/shp/cb_2018_us_state_20m.zip"
)[["geometry", "STUSPS"]]
# Remove non-continental US states
continental_us: gpd.GeoDataFrame = us_states_shp[
    ~us_states_shp["STUSPS"].isin(["AK", "HI", "PR", "VI", "GU", "AS", "MP", "UM"])
]

landsat_scenes_shp: gpd.GeoDataFrame = gpd.read_file(
    "https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/atoms/files/WRS2_descending_0.zip"
)[["PATH", "ROW", "geometry"]]
landsat_scenes_intersecting: gpd.GeoDataFrame = get_intersecting_scenes(
    landsat_scenes_shp, continental_us
)
landsat_scenes_intersecting.to_file(
    "landsat_scenes_intersecting_continential_us.geojson", driver="GeoJSON"
)
