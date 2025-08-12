// const { config } = require("dotenv");

function handleCredentialResponse(response) {
  const userData = jwt_decode(response.credential);

  fetch("http://localhost:3000/api/save-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
    }),
  })
    .then(async (res) => {
      const msg = await res.text();

      if (res.status === 409) {
        alert(msg);
        return;
      }

      if (!res.ok) {
        alert(msg);
        return;
      }

      localStorage.setItem("user", JSON.stringify(userData));
      window.location.href = "student-form.html";
    })
    .catch((err) => {
      console.error("❌ Save failed:", err);
      alert("Network or server error");
    });
}

function handleCredentialResponseAdmin(responseAdmin) {
  console.log("🔐 Admin credential response:", responseAdmin);
  const adminData = jwt_decode(responseAdmin.credential);
  console.log("✅ Decoded Admin Data:", adminData);

  fetch("http://localhost:3000/api/save-admins", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: adminData.name,
      email: adminData.email,
      picture: adminData.picture,
    }),
  })
    .then(async (res) => {
      const msg = await res.text();

      if (res.status === 409) {
        alert(msg);
        return;
      }

      if (!res.ok) {
        alert(msg);
        return;
      }

      localStorage.setItem("admin", JSON.stringify(adminData));
    })
    .catch((err) => {
      console.error("❌ Save failed:", err);
      alert("Network or server error");
    });
}


window.addEventListener("DOMContentLoaded", async ()=>{
  const email = document.getElementById("semail").innerText
  const response = await fetch("http://localhost:3000/api/allotment-display" ,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({email})
  })
  const result = await response.json();
  
  document.getElementById("allotment").innerText = result.user.allotment
})


window.addEventListener("DOMContentLoaded",()=>{
   document.getElementById("payment-btn").addEventListener("click", ()=>{
      if(document.getElementById("allotment").innerText=='ECE' || document.getElementById("allotment").innerText == 'CSE'){
        window.location.href = 'payment-window.html'
      }
      else{
        alert("Please wait for the allotment to be done")
      }
 
})
 
})

window.addEventListener("DOMContentLoaded", () => {
  const pathname = window.location.pathname;
  if (pathname.includes("studentlogin.html")) {
    document.getElementById("forget-btn").addEventListener("click", () => {
      document.getElementById("pass-req").classList.remove("hidden");
      document.getElementById("st-main").classList.add("opacity-40");
    });
  }
});
window.addEventListener("DOMContentLoaded", () => {
  const pathname = window.location.pathname;
  if (pathname.includes("studentlogin.html")) {
    document.getElementById("pass-req-rem").addEventListener("click", () => {
      document.getElementById("pass-req").classList.add("hidden");
      document.getElementById("st-main").classList.remove("opacity-40");
    });
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const pathname = window.location.pathname;

  if (pathname.includes("student-form.html")) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.name && user.email) {
      const nameInput = document.getElementById("full_name");
      const emailInput = document.getElementById("email");

      if (nameInput) nameInput.value = user.name;
      if (emailInput) emailInput.value = user.email;
    } else {
      window.location.href = "index.html";
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("s-form").addEventListener("submit", async (e) => {
    console.log("hello");
    e.preventDefault();
    const name = document.getElementById("full_name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phno = document.getElementById("phone").value;
    const gender = document.getElementById("gender").value;
    const father_name = document.getElementById("father_name").value;
    const mother_name = document.getElementById("mother_name").value;
    const address = document.getElementById("address").value;
    const maths_10 = document.getElementById("maths_10").value;
    const science_10 = document.getElementById("science_10").value;
    const english_10 = document.getElementById("english_10").value;
    const hindi_10 = document.getElementById("hindi_10").value;
    const sst_10 = document.getElementById("sst_10").value;
    const it_10 = document.getElementById("it_10").value;
    const physics_12 = document.getElementById("physics_12").value;
    const chemistry_12 = document.getElementById("chemistry_12").value;
    const maths_12 = document.getElementById("maths_12").value;

    const res = await fetch("http://localhost:3000/api/student-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phno,
        gender,
        father_name,
        mother_name,
        address,
        maths_10,
        science_10,
        english_10,
        hindi_10,
        sst_10,
        it_10,
        physics_12,
        chemistry_12,
        maths_12,
      }),
    });

    const data = await res.text();
    console.log(data);

    window.location.href = "studentlogin.html";
  });
});

window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("admin-pass")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("✅ Form submitted");
      const admin_email = document.getElementById("aemail").value;
      const admin_key = document.getElementById("akey").value;

      const res = await fetch("http://localhost:3000/api/admin-enter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ admin_email, admin_key }),
      });
      const data = await res.text();
      if (res.status === 200) {
        console.log("user entered");
        console.log(data);
        console.log(JSON.parse(data));
        localStorage.setItem("user", JSON.stringify(JSON.parse(data)));
        window.location.href = "admin-panel.html";
      } else {
        alert("Invalid email or password");
        console.log(data);
      }
    });
});

window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("s-login-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const user_email = document.getElementById("login-email").value;
      const user_pass = document.getElementById("login-password").value;

      const res = await fetch("http://localhost:3000/api/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email, user_pass }),
      });

      const data = await res.text();

      if (res.status === 200) {
        const user_detail = JSON.parse(data);
        console.log(user_detail);
        localStorage.setItem("user", JSON.stringify(user_detail.user));
        window.location.href = "student-dashboard.html";
        console.log(data);
      } else {
        alert("Invalid email or password");
      }
    });
});

async function getUserData() {
  const response = await fetch("http://localhost:3000/api/student-data");
  const data = await response.json();

  const table = document.getElementById("details-table");
  data.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.gender}</td>
        <td>${user.father_name}</td>
        <td>${user.mother_name}</td>
        <td>${user.address}</td>
      `;
    table.appendChild(row);
  });
}
getUserData();

const detail_btn = document.getElementById("detail-btn")
const marks_btn = document.getElementById("marks-btn")
const rank_all = document.getElementById("rank-all")
const cdetail = document.getElementById("details-table")
const c10 = document.getElementById("student-marks")
const call = document.getElementById("rank-all-table")
const allot_btn = document.getElementById("allotment-btn")

detail_btn.addEventListener("click", () => {
  detail_btn.classList.add("bg-red-400")
  marks_btn.classList.remove("bg-red-400")

  rank_all.classList.remove("bg-red-400")
  cdetail.classList.remove("hidden")
  c10.classList.add("hidden")

  call.classList.add("hidden")
  allot_btn.classList.add("hidden")

  
});
marks_btn.addEventListener("click", () => {
  detail_btn.classList.remove("bg-red-400")
  marks_btn.classList.add("bg-red-400")

  rank_all.classList.remove("bg-red-400")
  cdetail.classList.add("hidden")
  c10.classList.remove("hidden")

  call.classList.add("hidden")
  allot_btn.classList.add("hidden")
  
});

rank_all.addEventListener("click", () => {
  detail_btn.classList.remove("bg-red-400")
  marks_btn.classList.remove("bg-red-400")

  rank_all.classList.add("bg-red-400")
  cdetail.classList.add("hidden")
  c10.classList.add("hidden")
  
  call.classList.remove("hidden")
  allot_btn.classList.remove("hidden")
});



async function getUserRank() {
  const response = await fetch("http://localhost:3000/api/student-rank");
  const data = await response.json();

  // Step 1: Add total marks to each user object
  data.forEach(user => {
    user.totalMarks10 =
      user.maths_10 +
      user.science_10 +
      user.sst_10 +
      user.it_10 +
      user.hindi_10 +
      user.english_10;
    user.totalMarks12 = user.physics_12 +
      user.chemistry_12 +
      user.maths_12;
  });

  // Step 2: Sort the data in ascending order of totalMarks
  data.sort((a, b) => b.totalMarks - a.totalMarks);
  
  // Step 3: Render the sorted table
  const table = document.getElementById("student-marks");

  data.forEach((user, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.hindi_10}</td>
      <td>${user.english_10}</td>
      <td>${user.maths_10}</td>
      <td>${user.science_10}</td>
      <td>${user.sst_10}</td>
      <td>${user.it_10}</td>
      <td>${user.totalMarks10}</td>

      <td>${user.physics_12}</td>
      <td>${user.chemistry_12}</td>
      <td>${user.maths_12}</td>
      <td>${user.totalMarks12}</td>
    `;

    table.appendChild(row);
  });
}

getUserRank();


async function getUserRank12() {
  const response = await fetch("http://localhost:3000/api/student-rank-12");
  const data = await response.json();

  // Step 1: Add total marks to each user object
  data.forEach(user => {
    console.log(user)
    user.totalMarks =
      user.maths_12 +
      user.physics_12 +
      user.chemistry_12;
     
  });

  // Step 2: Sort the data in ascending order of totalMarks
  data.sort((a, b) => b.totalMarks - a.totalMarks);
  
  // Step 3: Render the sorted table
  const table = document.getElementById("rank-12-table");

  data.forEach((user, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.physics_12}</td>
      <td>${user.chemistry_12}</td>
      <td>${user.maths_12}</td>
     
      <td>${user.totalMarks}</td>
    `;

    table.appendChild(row);
  });
}

getUserRank12();

async function getUserRankAll() {
  const response = await fetch("http://localhost:3000/api/student-rank-all");
  const data = await response.json();

  // Step 1: Add total marks to each user object
  data.forEach(user => {
    console.log(user)
    user.totalMarks =
      user.maths_12 +
      user.physics_12 +
      user.chemistry_12+
      user.maths_10 +
      user.science_10 +
      user.sst_10 +
      user.it_10 +
      user.hindi_10 +
      user.english_10;
     
  });

  // Step 2: Sort the data in ascending order of totalMarks
  data.sort((a, b) => b.totalMarks - a.totalMarks);
  
  // Step 3: Render the sorted table
  const table = document.getElementById("rank-all-table");

  data.forEach((user, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>     
      <td>${user.totalMarks}</td>
      <td>
    
      <select name="allotment" data-email="${user.email}" required
      class="std-allot w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="" disabled selected hidden>${user.allotment}</option>
      <option value="CSE">CSE</option>
      <option value="ECE">ECE</option>
      <option value="Rejected">Rejected</option>
    </select>
      
</td>
    `;

    table.appendChild(row);
  });
}

getUserRankAll();

document.getElementById("allotment-btn").addEventListener("click", async () => {
  const selects = document.querySelectorAll(".std-allot");

  const allotmentData = [];

  selects.forEach((select) => {
    const email = select.getAttribute("data-email");
    const allotment = select.value;

    if (allotment) {
      allotmentData.push({ email, allotment });
    }
  });

  // Send the data to server in bulk
  try {
    const response = await fetch("http://localhost:3000/api/update-allotments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updates: allotmentData }),
    });

    const result = await response.json();
    alert(result.message || "Allotments updated successfully!");
    // console.log(result.allotment)
  } catch (err) {
    console.error("Bulk update error:", err);
    alert("Something went wrong while updating.");
  }
});
