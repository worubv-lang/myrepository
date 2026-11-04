fetch("https://api.github.com/users/octocat")
  .then((res) => res.json())
  .then((data) => console.log(data.name))
  .catch((err) => console.error("실패:", err.message));