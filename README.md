# Routes.js
Simple Routing System for IEK ΔΕΛΤΑ Students

## Install
incloud the script in your project
```html
<script src="//develobird.gr/routes.js"></script>
```

## Use
Write in your javascript file the following
```js
Routes({
  "/": function(){
    alert("You are at home path");
  },
  "users": function(){
    alert("You are as users path");
  },
  "users/:user_id": function(){
    alert("You are watching the user with id " + UrlParams.user_id);
  },
  default: "/"
});
```
