# Exam Cross-platform

Crossplattform application for sharing travel photos and locations

## Case 
Develop an application called TravelSnap. You may choose either
Ionic + Vue or React Native for frontend development (in alignment with the technologies
covered in the course), and Firebase as Backend as a Service.

TravelSnap is designed to
simplify travellers’ experiences by focusing on three core functions: taking photos, sharing
geolocations, and connecting with others for tips and recommendations

### Must have functionality:
* Present an overview of all traveller photos that are retrieved from Firebase. This can,
for example, to be in a list or grid format 
* Ensure that each travel photo is clickable to access a detailed view or information.
* Develop a secure and intuitive interface where users can upload new traveller photos
directly from camera or select from existing gallery. Along with the photo, users shall
be able to add captions and additional information before storing in Firebase.
* Allow users to navigate seamlessly between different pages, i.e., the photo overview,
detailed view, and upload images.

### Other functionality added 
* The app provides authentication opportunity for users to register, log in and log out.
* Camera (Capacitor Camera) to take pictures.
* Separate profile page for logged in users.
* Only logged in users should be able to access photo details and upload new traveller
photo, etc.
* Users can leave comments or share feedback such as like/dislike on individual detail
photo page.
* Users can delete their own comments.
* Provide GPS (Geolocation) information to allocate where the photo is taken.
* Incorporate a map view, i.e., Google Maps in the app.
* Feedback during user interaction (error messages, loading spinners, etc.).
* Implementation of accessibility principles such as router guards.
 
The user is presented a swiper when entering the application. 

 Log in                    |  Register a new user         |    Home Feed 
:-------------------------:|:-------------------------:|:-------------------------:



Upload |  Profile page
:-------------------------:|:-------------------------:



Details         |  Gallery
:-------------------------:|:-------------------------:
