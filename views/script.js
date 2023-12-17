// 모달 창 열기
function openModal(userId) {
  document.getElementById("userId").value = userId; // 수정할 사용자의 ID를 hidden 필드에 설정
  document.getElementById("newPhoneNumber").value = ""; // 모달 안의 값 초기화
  document.getElementById("myModal").style.display = "block";
}

// 모달 창 닫기
function closeModal() {
  document.getElementById("newPhoneNumber").value = ""; // 모달 안의 값 초기화
  document.getElementById("myModal").style.display = "none";
}

// 폼 제출 이벤트 핸들러
document
  .getElementById("editForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // 폼 제출 기본 동작 중단

    const userId = document.getElementById("userId").value;
    const newPhoneNumber = document.getElementById("newPhoneNumber").value;

    // 서버로 수정된 데이터 전송
    fetch(`/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber: newPhoneNumber }),
    })
      .then((response) => {
        if (response.ok) {
          closeModal();
          return response.json();
        } else {
          throw new Error("수정 실패");
        }
      })
      .then((updatedUser) => {
        console.log("수정된 사용자:", updatedUser);
        // 데이터 갱신 및 화면 업데이트
        updateUserTable(updatedUser);
      })
      .catch((error) => {
        console.error("수정 실패:", error);
        closeModal();
        alert("수정 실패했습니다.");
      });
  });

// 사용자 테이블 업데이트
function updateUserTable(updatedUser) {
  const table = document.querySelector("tbody");
  const rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const userId = row.cells[0].innerText;

    if (userId === updatedUser._id) {
      row.cells[2].innerText = updatedUser.phoneNumber;
      break;
    }
  }
}

function deleteFirstValue() {
  // 서버와 통신하여 맨 처음 값 삭제를 요청하는 코드 작성
  fetch("/deleteFirstValue", {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      // 삭제가 성공적으로 이루어진 경우, 필요한 동작 수행
      console.log("맨 처음 값 삭제 완료");
    })
    .catch((error) => {
      // 삭제 요청이 실패한 경우, 에러 처리
      console.error("맨 처음 값 삭제 실패:", error);
    });
}

function deleteLastValue() {
  // 서버와 통신하여 맨 마지막 값 삭제를 요청하는 코드 작성
  fetch("/deleteLastValue", {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      // 삭제가 성공적으로 이루어진 경우, 필요한 동작 수행
      console.log("맨 마지막 값 삭제 완료");
    })
    .catch((error) => {
      // 삭제 요청이 실패한 경우, 에러 처리
      console.error("맨 마지막 값 삭제 실패:", error);
    });
}
