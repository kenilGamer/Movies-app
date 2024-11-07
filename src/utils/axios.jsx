import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3/",

  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZmM5MDA4OWUyMjc4OTBlYjkyYjVhMTZhNWJiOTUxZCIsInN1YiI6IjY1ZjQxMGRkMjkzODM1MDE0YTI3ZWJhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aWEJgRAdxjCmTVDir3h8MSKdsBEe7-1tKJzbIdFQIzI'
  }
});

export default instance;
