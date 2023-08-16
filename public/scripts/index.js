function showDangerToast(message) {
  return Toastify({
    text: message,
    duration: 3000,
    gravity: "top", // `top` or `bottom`
    position: "right",
    style: {
      background: "linear-gradient(147deg, #990000 0%, #ff0000 74%)",
    },
  }).showToast();
}

const sendJsonPostRequest = async (url, body) => {
  const rawResponse = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return rawResponse.json();
};

window.addEventListener("DOMContentLoaded", function () {
  switch (this.window.location.pathname) {
    case "/auth/login":
      loginPageSettings();
      break;
    case "/domains/new":
      newDomainRegisterSettings();
      break;
    case "/auth/register":
      registerPageSettings();
      break;
    default:
      if (this.window.location.pathname.includes("/bid")) {
        return placeBid();
      }
      break;
  }
});

const newDomainRegisterSettings = () => {
  const form = document.getElementById("create-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = e.target.url.value;
    const askAmount = e.target.askAmount.value;
    if (!url || !askAmount) {
      return showDangerToast("All Fields are Required!");
    }

    const content = await sendJsonPostRequest("/api/v1/domains/", {
      askAmount,
      url,
      isAutoList: e.target.isAutoList.checked,
    });
    if (content.status === 201) {
      return (window.location.href = "/users/dashboard");
    } else {
      return showDangerToast(content.message);
    }
  });
};

const placeBid = () => {
  const form = document.getElementById("bid-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = e.target.amount.value;
    if (!amount) {
      return showDangerToast("Bid Amount is invalid!");
    }
    const domainId = e.target.domainId.value;
    const content = await sendJsonPostRequest(`/api/v1/bids/${domainId}`, {
      amount,
    });
    if (content.status === 201) {
      return window.location.reload();
    } else {
      return showDangerToast(content.message);
    }
  });
};

const registerPageSettings = () => {
  const form = document.getElementById("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const requiredFields = ["firstName", "lastName", "password", "email"];
    const fields = requiredFields
      .map((key) => e.target[key].value)
      .filter((data) => data);
    if (fields.length !== requiredFields.length) {
      return showDangerToast("All Fields are Required!");
    }
    const bodyData = {};
    requiredFields.forEach((key) => {
      if (e.target[key].value) {
        bodyData[key] = e.target[key].value;
      }
    });
    const content = await sendJsonPostRequest(
      "/api/v1/auth/register",
      bodyData
    );
    if (content.status === 201) {
      return (window.location.href = "/auth/login?message=register success");
    } else {
      return showDangerToast(content.message);
    }
  });
};

const loginPageSettings = () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formTarget = e.target;
    const email = formTarget.email.value;
    const password = formTarget.password.value;
    if (!email || !password) {
      return showDangerToast("All Fields Are required!");
    }
    const content = await sendJsonPostRequest("/api/v1/auth/login", {
      email,
      password,
    });
    if (content.status === 200) {
      return (window.location.href = "/");
    } else {
      return showDangerToast(content.message);
    }
  });
};
