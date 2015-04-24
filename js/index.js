(function() {
  // Numero de API_KEY, se utiliza normalmente
  // se utiliza mayusculas para utilizar variables
  // que no se cambiaran.
  var API_WORLDTIME_KEY = "d6a4075ceb419113c64885d9086d5";
  var API_WORLDTIME = "https://api.worldweatheronline.com/free/v2/tz.ashx?format=json&key=" + API_WORLDTIME_KEY + "&q=";
  var API_WEATHER_KEY = "80114c7878f599621184a687fc500a12";
  // URL de la API
// donde esta el weather?, ese ? indica que le vamos
// a ingresar algo a la URL y es por eso que se
// concatena con la API_WEATHER_KEY
  var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&";
  var IMG_WEATHER = "http://openweathermap.org/img/w/";

  var today = new Date();
  var timeNow = today.toLocaleTimeString();
  alert("La hora de tu pais es: " + timeNow);

  // guardado el body en la variable $body con JQuery
  var $body = $("body");
  var $loader = $(".loader");
  var nombreNuevaCiudad = $("[data-input='cityAdd']");
  var buttonAdd = $("[data-button='add']");
  var buttonLoad = $("[data-saved-cities]");
  var $divMensaje = $(".msg");

  // un arreglo de variables
  var cities = []; // para el localStorage
  var cityWeather = {};
  cityWeather.zone; // para guardar la zona
  cityWeather.icon; // para guardar el icono del tiempo
  cityWeather.temp; // para guardar la temperatura
  cityWeather.temp_max; // para guardar temperatura maxima
  cityWeather.temp_min; // "" "" "" minima
  cityWeather.main;

  // Cuando buttonAdd escuche el elemeno click
  buttonAdd.on("click", addNewCity);


  nombreNuevaCiudad.on("keypress", function(event) {
    if(event.which == 13) {
      addNewCity(event);
    }
  });

  // para que al apretar el boton cargue las ciudades
  buttonLoad.on("click", loadSavedCities);

  // Con esto recogemos el evento
  if(navigator.geolocation) {
    debugger;
    navigator.geolocation.getCurrentPosition(getCoords, errorFound);
  } else {
    alert("Por favor, actualiza tu navegador");
  }

  function errorFound(error) {
    alert("Un error ocurrió: " + error.code);
    var activado = activateTemplate("#template--mensaje");
    var mensa = "Error de tipo: " + code.error;
    // 0: Error desconocido
    // 1: Permiso denegado
    // 2: Posición no está disponible
    // 3: Timeout
    if (error.code == 0) {
      activado.querySelector("[data-div='mensaje']").innerHTML = mensa;
    } else if (error.code.equals("1")) {
      activado.querySelector("[data-div]").inneHTML = mensa;
    } else if (error.code == 1) {
      activado.querySelector("[data-div]").inneHTML = mensa;
    }
    $divMensaje.append(activado);
  };

  // funcion para requerir datos
  function getCoords(position) {
    debugger;
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log("Tu posición es: " + lat + "," + lon);
    // pasar URL de la API
    $.getJSON(API_WEATHER_URL + "lat=" + lat + "&lon=" + lon, getCurrentWeather);
  };

  // funcion para obtener los datos
  function getCurrentWeather(data) {
    cityWeather.zone = data.name;
    cityWeather.icon = IMG_WEATHER + data.weather[0].icon + ".png";
    cityWeather.temp = data.main.temp - 273.15;
    cityWeather.temp_max = data.main.temp_max - 273.15;
    cityWeather.temp_min = data.main.temp_min - 273.15;
    cityWeather.main = data.weather[0].main;

    //render - para pintar en la pantalla eso
    renderTemplate(cityWeather);
  };

  function activateTemplate(id) {
    var t = document.querySelector(id);
    return document.importNode(t.content, true);
  };

  function renderTemplate(cityWeather, localtime) {
    var clone = activateTemplate("#template--city");

    var timeToShow;
    if(localtime) {
      timeToShow = localtime.split(" ")[1];
    } else {
      timeToShow = timeNow;
    }
    // con InnerHTML se le inyecta un valor directamente al
    // HTML con los atributos data-valor declarados
    // en las etiquetas en el index, estos atributos se
    // colocaln dentro del querySelector:
    clone.querySelector("[data-time]").innerHTML = timeToShow;
    clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
    clone.querySelector("[data-icon]").src = cityWeather.icon;
    clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(1);
    clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(1);
    clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1);

    // el metodo .toFixed(numero) sirve para definir cuanto
    // decimales tendra la variable resultado

    //inneHTML se utiliza con elementos que no tiene
    //principio y fin como h3 etc...

    // Mostrara el .loader en el body y luego lo escondera
    // con el metodo .hide()
    $loader.hide();
    // en mi html como no encuentra la posición
    // quedara pegado esto


    // luego de esto hay que agregarlo al DOM con JQuery
    // Con esto se indica que se pege(append) al "body" el
    // objeto(clone):
    $body.append(clone);
  }

  function addNewCity(event) {
    event.preventDefault();
    // Con esto obtendremos el valor de la variable ( .val() )
    $.getJSON(API_WEATHER_URL + "q=" + nombreNuevaCiudad.val(), getWeatherCity);
  }



  // LocalStorage (un nuevo elemento de HTML5)
  // nos permite guardar una variable global
  // para el vavegador pero para el dominio en
  // el que nos encontramos

  /*
  Ej:
  var elemento = "hola mundo";
  LocaStorage.setItem("clave", elemento);
  console.log(localStorage.getItem("clave"));

  Explicación:
  * Se crea una variable elemento
  * Luego con .setItem("clave", valor) se guarda
  * el lemento que vendria en el campo valor con
  * un nombre de variable en LocalStorage llamado
  * "clave".
  * Y para obtener el elemento guardado se utiliza
  * la función .getItem("clave"); y la clave "".
  */

  /*
  Dato
  * Una variable tipo objeto como:
  * > var obj {"abc":"def":"ghi"}
  * se puede guardar en un string con:
  * > var objString = JSON.stringify(nombreObjeto);
  * el nombre del objeto seria obj.
  * --------------------------------------
  Para gaurdar el objeto en LocalStorage seria:
  * > localStorage['curso'] = objString;
  * donde decimos que en la variable 'curso'
  * de localStorage vamos a guardar el objeto
  * transformado a string que se llama objString.
  */

  /*
  Metodos de acceso a las variables de LocalSorage:
  * 1) localStorage.getItem("clave") // por metodo Get
  * 2) localStorage['curso'] = objString; // por corchetes
  Metodo para guadar lo que hay en localStorage:
  * 1) var elem = localStorage.curso;
  */

  function getWeatherCity(data) {

    $.getJSON(API_WORLDTIME + nombreNuevaCiudad.val(), function(response) {

      // es para limpiar el campo input del index.html
      nombreNuevaCiudad.val("");

      cityWeather = {};
      cityWeather.zone = data.name;
      cityWeather.icon = IMG_WEATHER + data.weather[0].icon + ".png";
      cityWeather.temp = data.main.temp - 273.15;
      cityWeather.temp_min = data.main.temp_min - 273.15;
      cityWeather.temp_max = data.main.temp_max - 273.15;

      renderTemplate(cityWeather, response.data.time_zone[0].localtime);

      // Esto .push() sirve para agregar a un
      // Array datos, es por eso que al arreglo
      // cities [] se le agrega cityWeather
      // cities.push(cityWeather);
      cities.push(cityWeather);
      // para guardar el objeto cities en "cities" en
      // localStorage -> utilizando JSON y transformando
      // a string con .stringify()
      localStorage.setItem("cities", JSON.stringify(cities));
    });

  }


  function loadSavedCities(event) {
    // sirve para prevenir que ocurra
    // algo que no debiera ocurrir
    event.preventDefault();
    /*
    * esta variable es local por ende no da problemas
    * con la variable cities qu esta fuera de este bloque
    * por nde pasa a ser una variable local que vive
    * dentro de estos bloques
    * Se guardaran las ciudades de cities del localStorage
    * en la variable local y luego se recorre con
    * un foreach y dentro otra funcion para renderizar
    * todo esto con la funcion renderTemplate();
    */
    var cities = JSON.parse( localStorage.getItem("cities") );
    cities.forEach(function(city) {
      renderTemplate(city);
    });
  }

})();

// http://www.ida.cl/blog/desarrollo/guardar-y-eliminar-datos-via-localstorage/
