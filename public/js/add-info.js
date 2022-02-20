const inputHiddenPsid = document.querySelector("#psid");
const inputHiddenUsername = document.querySelector("#username");
const btnAddInfo = document.querySelector("#btnAddInfo");
const email = document.querySelector(".email");
const phoneNumber = document.querySelector(".phoneNumber");
const customerName = document.querySelector("#customerName");
console.log("------------------------------------------------");
console.log({
  inputHiddenPsid,
  inputHiddenUsername,
  btnAddInfo,
  email,
  phoneNumber,
  customerName,
});

(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/messenger.Extensions.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "Messenger");

window.extAsyncInit = function () {
  MessengerExtensions.getContext(
    "650725819618425",
    function success(thread_context) {
      // success
    },
    function error(err) {
      // error
      console.log("Fix loi facebook messenger webview error code 2071011", err);
      handleClickButtonAddInfo();
    }
  );
};

//validate inputs
function validateInputFields() {
  const EMAIL_REG =
    /[a-zA-Z][a-zA-Z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}/g;

  if (!email.value.match(EMAIL_REG)) {
    email.classList.add("is-invalid");
    return true;
  } else {
    email.classList.remove("is-invalid");
  }

  if (phoneNumber.value === "") {
    phoneNumber.classList.add("is-invalid");
    return true;
  } else {
    phoneNumber.classList.remove("is-invalid");
  }

  return false;
}

function handleClickButtonAddInfo() {
  btnAddInfo.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("-----------CLICK---------------");
    let check = validateInputFields(); //return true or false

    let data = {
      psid: inputHiddenPsid.value,
      customerName: customerName.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      username: inputHiddenUsername.value,
    };

    if (!check) {
      //close webview
      MessengerExtensions.requestCloseBrowser(
        function success() {
          // webview closed
        },
        function error(err) {
          // an error occurred
          console.log(err);
        }
      );
      console.log("---------------------------HAnDLE---------------------");

      //send data to node.js server
      fetch(`${window.location.origin}/add-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("[result-+-]", result);
        })
        .catch((err) => console.log("[err-fetch-]", err));
      let tt2 = document.querySelector(".tt2");
      tt2.classList.remove("hidden");
    }
  });
}
