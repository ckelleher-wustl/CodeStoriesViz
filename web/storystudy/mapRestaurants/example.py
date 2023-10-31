print("starting script")
import requests
import time
import math
import pandas as pd

print("imports done")

API_KEY = open("/Users/joeyallen/Documents/API_KEYS/PythonGoogleMaps.txt").read().strip()
PLACES_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
LATITUDE = 38.634098
LONGITUDE = -90.254306

LATITUDE, LONGITUDE = 38.672451, -90.263111

LOCATION = str(LATITUDE)+', '+str(LONGITUDE)  # Saint Louis, MO coordinates
RADIUS = 20000  # 15 km, adjust as needed

def meters_to_latitude(m):
    return m/111000.0

def meters_to_longitude(m, lat):
    return m/ abs(111000*math.cos(math.radians(lat)))

GRID_DIM = 7

subCircleRadius = RADIUS*1/GRID_DIM #increasing by 1.1 just for a bigger range, to be all inclusive. experimentals

#subCircleDistance = subCircleRadius *((3+2*math.sqrt(3))/3) #this is assuming chatGPT is right
subCircleDistance = subCircleRadius * math.sqrt(3) # hand calculation, this looks better

subCircleCentroidOffset = math.sqrt(subCircleDistance**2 / 2)


mid_grid = GRID_DIM//2+1
startLatitude = LATITUDE - meters_to_latitude(subCircleCentroidOffset*mid_grid) #offset it halfway to the left
startLongitude = LONGITUDE - meters_to_longitude(subCircleCentroidOffset*mid_grid, startLatitude) #offset halfway up
#print(startLatitude, startLongitude)
#print("{lat: "+str(startLatitude)+", lng:"+str(-90.34743652887738)+"}")
print("centroids")
# print("[")

locations = []
for rowNum in range(GRID_DIM):
    for colNum in range(GRID_DIM):
        currLatitude = startLatitude + meters_to_latitude(subCircleCentroidOffset*colNum)
        currLongitude = startLongitude + meters_to_longitude(subCircleCentroidOffset*rowNum, currLatitude)
        if colNum % 2 == 0:
            currLongitude = currLongitude + meters_to_longitude(subCircleCentroidOffset/2, currLatitude)
        # print("{lat: "+str(currLatitude)+", lng:"+str(currLongitude)+"},")
        locations.append(str(currLatitude)+", "+str(currLongitude))
print("]")


def get_restaurants(location, api_key, radius=50000, next_page_token=None):
    time.sleep(2)
    restaurants = []
    params = {
        'location': location,
        'radius': radius,
        'type': 'cafe',
        'key': api_key
    }
    if next_page_token:
        params['pagetoken'] = next_page_token

    response = requests.get(PLACES_ENDPOINT, params=params).json()
    
    if 'results' in response:
        for place in response['results']:
            name = place.get('name')
            rating = place.get('rating')
            user_ratings_total = place.get('user_ratings_total')
            restaurants.append({
                'name': name,
                'rating': rating,
                'user_ratings_total': user_ratings_total
            })

    return restaurants, response.get('next_page_token')


all_restaurants = []
next_token = None

print("begining...")
loc_count = 0
for location in locations:
    print("location:",loc_count)
    loc_count += 1
    while True:
        restaurants, next_token = get_restaurants(location, API_KEY, subCircleRadius, next_token)
        print("\t",len(restaurants))
        all_restaurants.extend(restaurants)
        if not next_token:
            break

df = pd.DataFrame(all_restaurants)
df.to_csv("all_cafes.csv",index=False)