import React, { useState, useEffect } from 'react'
import axios from 'axios';

function Profile() {
  document.title = "Godcrfts | Profile";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wallpaper, setWallpaper] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [age, setAge] = useState(null);
  // const [password, setPassword] = useState(null);
  axios.get("/api/profile").then((res) => {
    console.log(res.data);
    setUser(res.data);
    setLoading(false);
  }).catch((err) => {
    console.log(err);
  });
  return (
    <div>Profile</div>
  )
}

export default Profile