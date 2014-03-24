var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var id;
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    onDeviceReady: function () {

        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;


        $.mobile.allowCrossDomainPages = true;
        $.mobile.defaultDialogTransition = "none";
        $.mobile.defaultPageTransition = "none";
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
    }
};


function onLoad() {
    document.addEventListener("deviceready", onDeviceReady123, false);
}

// device APIs are available
//
function onDeviceReady123() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    document.addEventListener("offline", onOffline, false);
    document.addEventListener("backbutton", onBackKeyDown, false);

}

// Handle the offline event
//
function onOffline() {
    navigator.notification.alert(
        'Network connection lost!\nThis app cannot process your data without network connection!\nPlease reactivate',  // message
        // callback
        'Network connection lost',            // title
        'Network offline'                  // buttonName
    );
}

function onBackKeyDown() {
    var activePage = $.mobile.activePage.attr("id");

    if (activePage == "pageLogin") {
        navigator.app.exitApp();
    }

    else {
        history.back();
    }

}
//TIMER TO CHANGEPAGE AFTER 2000ms Preload Select Fields from Database
function loadSplashScreen() {

    $.getJSON("http://chargelocator.com/socketTypeList_Alpha.php", function (data) {
        $.each(data, function (key, val) {
            $('<option>').val(val.id_tipo).text(val.nombre_tipo).appendTo('#socketType1');
            $('<option>').val(val.id_tipo).text(val.nombre_tipo).appendTo('#socketType2');
            $('<option>').val(val.id_tipo).text(val.nombre_tipo).appendTo('#socketType_1');
            $('<option>').val(val.id_tipo).text(val.nombre_tipo).appendTo('#socketType_2');
        });
    });

    $.getJSON("http://chargelocator.com/codigoCountryList_Alpha.php", function (data) {
        $.each(data, function (key, value) {
            $('<option>').val(value.codigo).text(value.NOMBRE_ES).appendTo('#country');
            $('<option>').val(value.codigo).text(value.NOMBRE_ES).appendTo('#country1');
        });
    });

    $.getJSON("http://chargelocator.com/siteTypes_Alpha.php", function (data) {
        $.each(data, function (key, val) {
            $('<option>').val(val.id_tipo).text(val.nombre_tipo).appendTo('#siteType');
            $('<option>').val(val.id_tipo).text(val.nombre_tipo).appendTo('#siteType1');
        });
    });
    //load nivel
    $.getJSON("http://chargelocator.com/nivel_Alpha.php", function (data) {
        $.each(data, function (key, val) {
            $('<option>').val(val.group_id).text(val.group_name).appendTo('#nivel1');
            $('<option>').val(val.group_id).text(val.group_name).appendTo('#group');

            /*
             $("#nivel1").append("<option value='" + val.group_id + "'>" + val.group_name + "</option>");
             $("#group").append("<option value='" + val.group_id + "'>" + val.group_name + "</option>");
             */

        });
    });
    $.mobile.changePage("#pageLogin");
}

$(document).on('pageshow', '#splashScreen', function () {
    setTimeout(function () {
        loadSplashScreen();
    }, 5000);
});

//LOGIN_PAGE_HANDLER
$(document).on('pageinit', '#pageLogin', function () {

    //AutoLogin
        if (localStorage.getItem("userName") && localStorage.getItem("passWord")) {
     $("#username").val(localStorage.getItem("userName"));
     $("#password").val(localStorage.getItem("passWord"));

     handleLogin();

     }

    $(document).on('click', '#submit', function () { // catch the form's submit event
        handleLogin();
    });
});
function handleLogin() {
    if ($('#username').val().length >= 4 && $('#password').val().length >= 4) {
        // Send data to server through the ajax call
        // action is functionality we want to call and outputJSON is our data
        var data = $('#check-user').serialize();
        $.ajax({url: 'http://chargelocator.com/login_Alpha.php',
            data: data,
            type: 'post',
            async: 'true',
            dataType: 'json',
            beforeSend: function () {
                // This callback function will trigger before data is sent
                $.mobile.showPageLoadingMsg(true); // This will show ajax spinner
            },
            complete: function () {
                // This callback function will trigger on data sent/received complete
                $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
            },
            success: function (result) {
                if (result.status) {
                    localStorage.setItem("userName", $('#username').val());
                    localStorage.setItem("passWord", $('#password').val());
                    $.mobile.changePage("#gpsPage");
                } else {
                    navigator.notification.alert(
                        'Please fill out password and username',  // message
                        // callback
                        'Login failed',            // title
                        'Login failed'                  // buttonName
                    );
                }
            },
            error: function (request, error) {
                // This callback function will trigger on unsuccessful action
                navigator.notification.alert(
                    'Network error has occurred\nplease activate your network.',  // message
                    // callback
                    'Network connection lost',            // title
                    'Network error!'                  // buttonName
                );
            }
        });
    } else {
        navigator.notification.alert(
            'Username must have min. 4 characters\npassword min. 4 characters.',  // message
            // callback
            'Validation error',            // title
            'Please fill all necessary fields'                  // buttonName
        );
    }
    return false; // cancel original event to prevent form submitting
};


//GEO CODER
var geocoder;
var map;
var infowindow = new google.maps.InfoWindow();
var marker;
var lat;
var lng;
function initialize() {
    var lat1;
    var lng1;
    if (lat && lng) {
        lat1 = parseFloat(lat);
        lng1 = parseFloat(lng);
    }
    else {
        lat1 = parseFloat(40.730885);
        lng1 = parseFloat(-73.997383);

    }
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(lat1, lng1);
    var mapOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: 'roadmap'
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);

function codeLatLng(lat2, lng2) {
    $("#latitude1").val(lat);
    $("#longitude1").val(lng);
    var lat1 = parseFloat(lat2);
    var lng1 = parseFloat(lng2);
    var latlng = new google.maps.LatLng(lat1, lng1);
    geocoder.geocode({'latLng': latlng}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                map.setZoom(15);
                marker = new google.maps.Marker({
                    position: latlng,
                    map: map
                });
                infowindow.setContent(results[1].formatted_address);
                infowindow.open(map, marker);
                var result = results[0];
                var streetNr;
                var street;
                var city;
                var postalcode;
                var country;

                for (var i = 0, len = result.address_components.length; i < len; i++) {
                    var ac = result.address_components[i];
                    if (ac.types.indexOf("street_number") >= 0) {
                        streetNr = ac.long_name;

                    }
                    if (ac.types.indexOf("route") >= 0) {
                        $("#street1").val(ac.long_name + " " + streetNr);
                    }
                    if (ac.types.indexOf("locality") >= 0) {
                        $("#city1").val(ac.long_name);
                    }
                    if (ac.types.indexOf("postal_code") >= 0) {
                        $("#postalcode1").val(ac.long_name);
                    }
                    if (ac.types.indexOf("country") >= 0) {
                        $("#country1").val(ac.short_name).selectmenu('refresh');
                    }
                }

                var result1 = results[1];

                for (var i = 0, len = result1.address_components.length; i < len; i++) {
                    var ac = result1.address_components[i];
                    if (ac.types.indexOf("street_number") >= 0) {
                        streetNr = ac.long_name;

                    }
                    if (ac.types.indexOf("route") >= 0) {
                        $("#street1").val(ac.long_name + " " + streetNr);
                    }
                    if (ac.types.indexOf("locality") >= 0) {
                        $("#city1").val(ac.long_name);
                    }
                    if (ac.types.indexOf("postal_code") >= 0) {
                        $("#postalcode1").val(ac.long_name);
                    }
                    if (ac.types.indexOf("country") >= 0) {
                        $("#country1").val(ac.short_name).selectmenu('refresh');
                    }
                }


            } else {
                navigator.notification.alert(
                    'Gps geolocation could not be found at your position.',  // message
                    // callback
                    'No Results found.',            // title
                    'No Results found.'                  // buttonName
                );
            }
        } else {
            navigator.notification.alert(
                'Geocoder failed due to:\n' + status,  // message
                // callback
                ' status' + status,            // title
                'Geocoder failed! '                   // buttonName
            );
        }
    });
};

function onSuccess(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;

    $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner


};

// onError Callback receives a PositionError object
function onError(error) {

    navigator.notification.alert(
        'Please activate your GPS Adapter '+ error.code + '\n' + error.message,  // message
        // callback
        'Gps Error connection lost',            // title
        'Gps adapter not activated.'                  // buttonName
    );

};


$(document).on('pageshow', '#gpsPage', function () {

    initialize();

});


$(document).on('pageinit', '#gpsPage', function () {

    $("#latitude1").val(localStorage.getItem("latitude"));
    $("#longitude1").val(localStorage.getItem("longitude"));
    $("#locname1").val(localStorage.getItem("locname"));
    $("#street1").val(localStorage.getItem("street"));
    $("#postalcode1").val(localStorage.getItem("postalcode"));
    $("#city1").val(localStorage.getItem("city"));
    $("#country1").val(localStorage.getItem("country")).selectmenu('refresh');

    $("#maps").click(function () {



        if (lat && lng) {
            codeLatLng(lat, lng);

        }
/*        else {
            navigator.notification.confirm(
                'Please acivate your GPS Sensor!',  // message
                // callback
                'GPS not activated',            // title
                'Ok'                  // buttonName
            );
        }*/
    });

    $(document).on('click', '#buttonNext', function (event) {
        if ($('#locname1').val().length > 2 && $('#street1').val().length > 2 && $('#postalcode1').val().length > 2
            && $('#city1').val().length > 2 && $('#country1').val() != null) {
            localStorage.setItem("latitude", $("#latitude1").val());
            localStorage.setItem("longitude", $("#longitude1").val());
            localStorage.setItem("locname", $("#locname1").val());
            localStorage.setItem("street", $("#street1").val());
            localStorage.setItem("postalcode", $("#postalcode1").val());
            localStorage.setItem("city", $("#city1").val());
            localStorage.setItem("country", $("#country1").val());
            $.mobile.changePage("#pageSockets");
        }
        else {
            navigator.notification.alert(
                'Location name\nstreet\npostalcode\ncity\ncountry\nmust be filled out correctly!',  // message
                // callback
                'Validation error',            // title
                'Please fill all necessary fields'                  // buttonName
            );
        }
    });
});



//SOCKETS PAGE
/*$(document).on('pageshow', '#pageSockets', function () {
 });*/
$(document).on('pageinit', '#pageSockets', function () {
    $("#description1").val(localStorage.getItem("description"));
    $("#openinghours1").val(localStorage.getItem("openinghours"));
    $("#ampere1").val(localStorage.getItem("ampere"));
    $("#siteType").val(localStorage.getItem("siteType")).selectmenu('refresh');
    $("#nivel1").val(localStorage.getItem("nivel1")).selectmenu('refresh');

    var socketType1 = localStorage.getItem("socketType1");
    var socketType2 = localStorage.getItem("socketType2");

    if (socketType1) {
        var dataarray = socketType1.split(",");
        $("#socketType1").val(dataarray).selectmenu('refresh');
    }
    if (socketType2) {
        var dataarray2 = socketType2.split(",");
        $("#socketType2").val(dataarray2).selectmenu('refresh');
    }


    $(document).on('click', '#butSocketNext', function (event) {
        var socketType1 = $("#socketType1").val();
        var socketType2 = $("#socketType2").val();
        var description = $("#description1").val();
        var openinghours = $("#openinghours1").val();
        var siteType = $("#siteType").val();
        var ampere = $("#ampere1").val();
        var nivel1 = $("#nivel1").val();

        if (socketType1 != null && socketType2 != null && nivel1 != null && description.length > 2
            && openinghours != null && siteType != null && ampere > 0 && ampere <= 500) {
            localStorage.setItem("description", description);
            localStorage.setItem("openinghours", openinghours);
            localStorage.setItem("siteType", siteType);
            localStorage.setItem("socketType1", socketType1);
            localStorage.setItem("socketType2", socketType2);
            localStorage.setItem("ampere", ampere);
            localStorage.setItem("nivel1", nivel1);
            $.mobile.changePage("#fotoPage");
        }
        else {
            navigator.notification.alert(
                'Sockettype 1, sockettype 2\nampere (min= 1 max=500)\ngroup, site type\ndescription (min. 2 characters)\nopening hours\nmust be filled out correctly.',  // message
                // callback
                'Validation error',            // title
                'Please fill all necessary fields'                  // buttonName
            );
        }
    });
});


//PHOTO


// Wait for PhoneGap to connect with the device
var imageArray = [];
var points;
var fileNames = [];

$(document).on('pageinit', '#fotoPage', function () {
    for (var i = 0; i <= 8; i++) {
        var str = "i" + i.toString();
        var imageSrc = localStorage.getItem(str);
        if (imageSrc) {
            $("#" + str).attr('src', imageSrc);
        }
    }
    ;

    $(document).on('click', '#hulsa a img', function (event) {
        id = event.target.id;
        var imgSource = $("#" + id).attr("src");
        if (imgSource == "#") {
            getPhoto();
        }
        else {
            $("#popImg").attr('src', imgSource);
            $("#pop").popup("open");
        }
    });
    $("#imagePopUpUpdate").click(function () {
        getPhoto();
        $("#pop").popup("close")
    });
    $("#imagePopDelete").click(function () {
        $("#" + id).attr('src', "#");
        localStorage.removeItem(id);
        $("#pop").popup("close");
    });
    $(".photopopup").on({
        popupbeforeposition: function () {
            var maxHeight = $(window).height() - 60 + "px";
            $(".photopopup img").css("max-height", maxHeight);
        }
    });

    $(document).on('click', '#butSocket', function () { // catch the form's submit event
        $("#images").empty();
        $("#images1").empty();

        fileNames = new Array();
        imageArray = new Array();
        for (var i = 0; i <= 8; i++) {
            var str = "i" + i.toString();
            var imageSrc = localStorage.getItem(str);
            if (imageSrc) {
                $("#images").append("<img style='width: 80px;height: 80px' src='" + imageSrc + "'/>");
                imageArray.push(imageSrc);
                fileName = imageSrc.substr(imageSrc.lastIndexOf('/') + 1);
                fileNames.push(fileName);
                $('<option>').val(fileName).text(fileName).appendTo('#images1');
                /*               points = points + 1;
                 alert(fileName);*/
            }
        }
        $.mobile.changePage("#confirmationPage");
    });
});
function onPhotoURISuccess(imageURI) {
    $("#" + id).attr('src', imageURI);
    localStorage.setItem(id, imageURI);

};
function getPhoto() {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI });
};

// Called if something bad happens.
function onFail(message) {
    alert('Failed because: ' + message);
}
//CONFIRMATION PAGE
$(document).on('pageshow', '#confirmationPage', function () {

    $("#country").val(localStorage.getItem("country")).selectmenu('refresh');
    $("#siteType1").val(localStorage.getItem("siteType")).selectmenu('refresh');
    $("#group").val(localStorage.getItem("nivel1")).selectmenu('refresh');

    var socketType1 = localStorage.getItem("socketType1");
    var socketType2 = localStorage.getItem("socketType2");
    if (socketType1) {
        var dataarray = socketType1.split(",");
        $("#socketType_1").val(dataarray).selectmenu('refresh');
    }
    if (socketType2) {
        var dataarray2 = socketType2.split(",");
        $("#socketType_2").val(dataarray2).selectmenu('refresh');
    }
    /*   $('<option>').val("1").text("test").appendTo('#images1');
     $("#images1").val("1").selectmenu('refresh');*/

    var img = fileNames.toString();

    if (img) {
        var dataarray3 = img.split(",");
        $("#images1").val(dataarray3).selectmenu('refresh');
    }

    points = 13; //without photos
    if ($("#siteType :selected").val() == "1") {
        points = points + 20;
    } else {
        points = points + 1;
    }
    if ($("#ampere1").val() > 32) {
        points = points + 5;
    }
    else {
        points = points + 1;
    }
    //IMAGES
    $("#points").val(points);
    //GPS Coordinates
    $("#latitude").val($("#latitude1").val());
    $("#longitude").val($("#longitude1").val());

    //LOCATION
    $("#locname").val($("#locname1").val());
    $("#street").val($("#street1").val());
    $("#postalcode").val($("#postalcode1").val());
    $("#city").val($("#city1").val());

    //CHARGER DETAILS
    $("#openinghours").val($("#openinghours1").val());
    $("#description").val($("#description1").val());
    $("#ampere2").val($("#ampere1").val());

});

/* berechnung von Punkten mit Message Sie haben soviel punkte etc. gewonnen.*/
$(document).on('pageinit', '#confirmationPage', function () {

    $(document).on('click', '#buttonSend', function () { // catch the form's submit event
        if ($('#longitude').val().length > 2 && $('#latitude').val().length > 2 && $('#locname').val().length > 2 && $('#street').val().length > 2 && $('#postalcode').val().length > 2
            && $('#city').val().length > 2 && $('#country').val() != null &&
            $('#socketType_1').val() != null && $('#socketType_2').val() != null && $('#nivel1').val() != null && $('#description').val().length > 2
            && $('#openinghours').val() != null && $('#siteType1').val() != null && $('#ampere2').val().length > 0
            ) {

            var formData = $('#confirmationForm').serialize();
            console.log(formData);
            $.ajax({url: 'http://chargelocator.com/new_1.php',
                data: formData,
                type: 'post',
                async: 'true',
                dataType: 'json',
                beforeSend: function () {
                    // This callback function will trigger before data is sent
                    $.mobile.showPageLoadingMsg(true); // This will show ajax spinner
                },
                complete: function () {
                    // This callback function will trigger on data sent/received complete
                    $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
                },
                success: function (result) {
                    if (result.status) {
//                        $("#span").html(points);
                        uploadPhoto();
                        showConfirm();


                    } else {
                        navigator.notification.alert(
                            result.massage,  // message
                            // callback
                            'Error',            // title
                            'Error'                  // buttonName

                        );
                    }
                },
                error: function (request, error) {
                    // This callback function will trigger on unsuccessful action
                    navigator.notification.alert(
                        'Network error has occurred.\n Please try again!',  // message
                        // callback
                        'Error',            // title
                        'Error'                  // buttonName
                    );
                }
            });
        } else {
            navigator.notification.alert(
                'Please fill all necessary fields',  // message
                // callback
                '',            // title
                'Validation error'                  // buttonName
            );
        }
        return false; // cancel original event to prevent form submitting
    });
});

function onConfirm(buttonIndex) {
    if(buttonIndex == 1){
        $.mobile.changePage("#splashScreen");

        location.reload();

    }
    else{
        if (navigator.app) {
            navigator.app.exitApp();
        }
        else if (navigator.device) {
            navigator.device.exitApp();
        }
    }
    clearAllData();

};

// Show a custom confirmation dialog
//
function showConfirm() {
    navigator.notification.confirm(
        'You successfully submitted a new point!\nYou have been rewarded with ' +points+' points.', // message
        onConfirm,            // callback to invoke with index of button pressed
        'Confirmation success',           // title
        'Restart,Exit'         // buttonLabels
    );
}



function clearAllData() {


    localStorage.removeItem("latitude");
    localStorage.removeItem("longitude");

    localStorage.removeItem("locname");
    localStorage.removeItem("street");
    localStorage.removeItem("postalcode");
    localStorage.removeItem("city");
    localStorage.removeItem("country");

    localStorage.removeItem("description");
    localStorage.removeItem("openinghours");

    localStorage.removeItem("siteType");
    localStorage.removeItem("ampere");
    localStorage.removeItem("nivel1");
    localStorage.removeItem("socketType1");
    localStorage.removeItem("socketType2");
    for (var i = 0; i <= 8; i++) {
        var str = "i" + i.toString();
        localStorage.removeItem(str);

    };
}
//UPLOAD IMAGES
function uploadPhoto() {
    for (var i = 0; i < imageArray.length; i = i + 1) {
        imageURI = imageArray[ i ];
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        var params = new Object();
        params.value1 = "test";
        params.value2 = "param";
        options.params = params;
        options.headers = {
            Connection: "close"
        } ;
        options.chunkedMode = false;
        var ft = new FileTransfer();
        ft.upload(imageURI, "http://chargelocator.com/upload_image.php", win, fail, options);
    }
};
function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);

    /*    navigator.notification.alert(
            'Success',  // message
            // callback
            'Success',            // title
            'Upload Success' + r.response                 // buttonName
        );*/
};

function fail(error) {
    navigator.notification.alert(
        'Error Code = \n' + error.code,  // message
        // callback
        'Error',            // title
        'An error while submitting your data'                  // buttonName
    );
};

//PASSWORD RECOVERY
$(document).on('pageinit', '#passWordRecoveryPage', function () {
    $(document).on('click', '#recover', function () { // catch the form's submit event
        if ($('#email').val().length > 4) {
            // Send data to server through the ajax call
            // action is functionality we want to call and outputJSON is our data
            var data = $('#email-recover').serialize();
            $.ajax({url: 'http://chargelocator.com/passwordRecovery_Alpha--.php',
                data: data,
                type: 'post',
                async: 'true',
                dataType: 'json',
                beforeSend: function () {
                    // This callback function will trigger before data is sent
                    $.mobile.showPageLoadingMsg(true); // This will show ajax spinner
                },
                complete: function () {
                    // This callback function will trigger on data sent/received complete
                    $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
                },
                success: function (result) {
                    if (result.status) {
                        navigator.notification.alert(
                            'Your password was successfully reseted',  // message
                            // callback
                            'Success Check your Email',            // title
                            result.massage                  // buttonName
                        );
                        $.mobile.changePage("#pageLogin");
                    } else {
                        navigator.notification.alert(
                            'Error changing your password \n. Try again!',  // message
                            // callback
                            'Error',            // title
                            'Error could not reset your password!'                  // buttonName
                        );
                    }
                },
                error: function (request, error) {
                    // This callback function will trigger on unsuccessful action
                    navigator.notification.alert(
                        'Error could not connect to server. \n Please try again.',  // message
                        // callback
                        'Error',            // title
                        'Network error has occurred!'                  // buttonName
                    );
                }
            });
        } else {
            navigator.notification.alert(
                'Please type your email adress',  // message
                // callback
                'Login error',            // title
                'Please fill all necessary fields!'                  // buttonName
            );
        }
        return false; // cancel original event to prevent form submitting
    });
});

$(document).on('pageinit', '#registerPage', function () {
    $(document).on('click', '#regSubmit', function () { // catch the form's submit event
        if ($('#emailR').val().length >= 4 && $('#passwordR').val().length >= 4 && $('#usernameR').val().length >= 4) {
            // Send data to server through the ajax call
            // action is functionality we want to call and outputJSON is our data
            var dat = $('#registerForm').serialize();
            $.ajax({
                url: 'http://chargelocator.com/alpha_register.php',
                data: dat,
                type: 'post',
                dataType: 'json',
                async: 'true',
                beforeSend: function () {
                    // This callback function will trigger before data is sent
                    $.mobile.showPageLoadingMsg(true); // This will show ajax spinner
                },
                complete: function () {
                    // This callback function will trigger on data sent/received complete
                    $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
                },
                success: function (result) {
                    if (result.status) {
                        navigator.notification.alert(
                            'Success',  // message
                            // callback
                            'Success',            // title
                            result.massage                  // buttonName
                        );
                        $.mobile.changePage("#pageLogin");
                    } else {
                        alert(result.massage);
                    }
                },
                error: function (request, error) {
                    // This callback function will trigger on unsuccessful action
                    navigator.notification.alert(
                        'Network error.\nCould not connect to network.\n Try again!',  // message
                        // callback
                        'Error',            // title
                        'Network error!');
                }
            });
        } else {
            navigator.notification.alert(
                'Username min. 4 characters\npassword min.4 characters\nemail must be filled out! ',  // message
                // callback
                'Error',            // title
                'Validation error!'                  // buttonName
            );
        }
        return false; // cancel original event to prevent form submitting
    });
});

