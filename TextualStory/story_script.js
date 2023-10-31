
const actionTexts = {
    1: "Goal of making a photo mosaic.",
    2: "import scipy and pandas",
    3: "attempt to read image using imageio",
    4: "search: imageio ndimage;'",
    5: "Switch to PIL (Python Image Library) and read in an image",
    6: "search: husky clip art;'",
    7: "search: house clipart jpg;'",
    8: "Calculate average pixel of image",
    9: "search: python pil iterate over pixels;'",
    10: "search: fastest way to calculate average color of image in python;'",
    11: 'Resize image to 1X1 pixel to see "average" pixel',
    12: "Calculate Average Pixel with Numpy average to compare runtime",
    13: "Get AVG pixel for each JPG file in folder",
    14: "Loop through photos in directory, calculate average pixel of each",
    15: "Dump pre-calculated average pixels to disk to test usage speed",
    16: "Map average pixel values back to their respective filenames",
    17: "For each pixel of target_photo, find photo with closest average pixel",
    18: "search: python vector similarity;'",
    19: "search: python kdtree example;'",
    20: "Loop through target_photo's pixels and find the avg_pixel closest, then map back to the filename",
    21: "Improve time it takes to loop through all images and find closest photo",
    22: "search: pil image draft;'",
    23: "Create mapping from filename to image object so images aren't read in more than once",
    24: "Saving and loading filename to image map to disk to improve runtime",
    25: "Generating the first version of the mosaic and organize code",
    26: "Clean up code by putting it into functions",
    27: "Functionalize get_file_avgPixelMap() to make code neater",
    28: "Testing the impact of pulling a random picture from the top-10 matches, instead of using the top match ",
    29: "Use Kmeans to cluster pixels in an image into groups of colors",
    30: "Print out pixel values for an image to investigate how to cluster the data using Kmeans",
    31: "Cluster pixels of a given image, and print out centroid colors, and what percent of image falls into each",
    32: "Create a pandas dataframe for one image that includes a list of all pixel colors and their respective clusters",
    33: "Create pandas dataframe that includes pixels and their clusters for all images, and save to a csv file",
    34: "Use Kmeans clusters for each image to determine which images have clusters similar to a given pixel",
    35: "Detect if two images are duplicates or near-identical",
    36: "Calculate Mean Squared Error (MSE) between images to measure similarity",
    37: "Record which files have been added to mosaic in a matrix",
    38: "Add function for compare_image_distance()",
    39: "Vectorize: one images to many images similarity comparison",
    40: "Debugging vectorization syntax in numpy",
    41: "Rework debugging steps into function",
    42: "Testing running code with different parameters for image similarity threshold and number of neighbors retreived",
    43: "Add comments to functions",
    44: "Test how resizing photos impacts calculated MSE averages"
}


document.addEventListener("DOMContentLoaded", function() {
    const clickableWords = document.querySelectorAll(".clickable");
  
    clickableWords.forEach(word => {
      word.addEventListener("click", function() {
        action_id = parseInt(word.getAttribute("action_id"))
        if (action_id){
            console.log(actionTexts[action_id])
        }
      });
    });
  });