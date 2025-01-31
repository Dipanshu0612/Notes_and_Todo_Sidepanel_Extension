const script = document.createElement("script");
script.src = "https://accounts.google.com/gsi/client";
script.async = true;

script.onload = () => {
  console.log("Google API loaded successfully");
};

document.head.appendChild(script);
