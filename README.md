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
<img width="383" alt="Skjermbilde 2023-12-14 kl  17 40 54" src="https://github.com/Ensve/TDS200_H23_CrossPlatform/assets/89137468/20f71d48-1fb5-4c7f-af22-72665974e963">  |  <img width="383" alt="Skjermbilde 2023-12-14 kl  17 38 02" src="https://github.com/Ensve/TDS200_H23_CrossPlatform/assets/89137468/fe727e45-4a05-4c71-95b7-ffa33526e1e7">  |  <img width="383" alt="Skjermbilde 2023-12-14 kl  17 41 56" src="https://github.com/Ensve/TDS200_H23_CrossPlatform/assets/89137468/c5fd95e2-a634-4e64-9e44-d986d8337809">


Upload |  Profile page
:-------------------------:|:-------------------------:
<img width="383" alt="Skjermbilde 2023-12-14 kl  17 43 04" src="https://github.com/Ensve/TDS200_H23_CrossPlatform/assets/89137468/12263ec9-796d-44b3-9401-854e3a92a0a8">  |  <img width="383" alt="Skjermbilde 2023-12-14 kl  17 43 41" src="https://github.com/Ensve/TDS200_H23_CrossPlatform/assets/89137468/7e26c0c8-8ab4-44a0-a7e1-5c134ee99384">


Details         |  Map  |  Gallery
:-------------------------:|:-------------------------: |:-------------------------:
<img width="383" alt="Skjermbilde 2023-12-14 kl  17 48 46" src="https://github.com/Ensve/TDS200_H23_CrossPlatform/assets/89137468/03a27e0e-9950-402d-949e-b81cc92006a8">  |  <img width="383" alt="Skjermbilde 2023-12-14 kl  17 48 03" src="https://github.com/Ensve/TDS200_H23_CrossPlatform/assets/89137468/83e172a9-8697-41d7-bcba-928ac2e4bffb">  |  <img width="383" alt="Skjermbilde 2023-12-14 kl  17 46 35" src="https://github.com/Ensve/TDS200_H23_CrossPlatform/assets/89137468/74ae4e98-f1fa-457b-8066-46aba3ce736b">

Add Comment      
:-------------------------: |
<img width="383" alt="Skjermbilde 2023-12-14 kl  17 45 39" src="https://github.com/Ensve/TDS200_H23_CrossPlatform/assets/89137468/c2a3f13f-2b82-4f5a-ab00-bb19b5450c02">
