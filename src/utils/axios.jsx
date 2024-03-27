import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZmM5MDA4OWUyMjc4OTBlYjkyYjVhMTZhNWJiOTUxZCIsInN1YiI6IjY1ZjQxMGRkMjkzODM1MDE0YTI3ZWJhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aWEJgRAdxjCmTVDir3h8MSKdsBEe7-1tKJzbIdFQIzI'
  }
});

// instance
//   .get('/search/multi') // Corrected endpoint for currently playing movies
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });

export default instance;

// Example of how to use the data from the API call in your application
/*
app.get('/movies', function(req, res){
  var movies = response.data.results; 
  // Do something with the array of movie objects
});
*/
//eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZmM5MDA4OWUyMjc4OTBlYjkyYjVhMTZhNWJiOTUxZCIsInN1YiI6IjY1ZjQxMGRkMjkzODM1MDE0YTI3ZWJhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aWEJgRAdxjCmTVDir3h8MSKdsBEe7-1tKJzbIdFQIzI

//7fc90089e227890eb92b5a16a5bb951d
