// main page 로부터 받은 데이터
const receivedData = location.href.split("?")[1];
data = decodeURI(receivedData);

// 데이터 받아서 최초 목록 표시
Data(
  `http://openapi.seoul.go.kr:8088/6e716276736c6f7538335658626c64/json/culturalEventInfo/1/999/${data}/`
);

// 카테고리 버튼 선택 하기
var tab_radio = document.getElementsByName("culture");
var list_btn = document.getElementById("list-btn");
var searchInput = document.getElementById("search-list");

list_btn.addEventListener("click", function (e) {
  for (i = 0; i < tab_radio.length; i++) {
    if (tab_radio[i].checked) {
      menuList.innerHTML = "";
      searchInput.value = "";
      console.log(`${tab_radio[i].value}`);
      Data(
        `http://openapi.seoul.go.kr:8088/6e716276736c6f7538335658626c64/json/culturalEventInfo/1/999/${tab_radio[i].value}/`
      );
    }
  }
});


function Data(url) {
  fetch(url)
    .then((res) => res.json())
    .then((myJson) => {
      var cult = myJson.culturalEventInfo.row;
      var menuList = document.getElementById("menuList");
      var num_search = document.getElementById("num-search");
      var tab_check = document.getElementsByName("tab_check");

      var count = 0;

      if (
        tab_radio[0].checked == false &&
        tab_radio[1].checked == false &&
        tab_radio[2].checked == false &&
        tab_radio[3].checked == false
      ) {

        // menuList 안에 목록 추가하기
        for (i = 0; i < cult.length; i++) {
          if (cult[i].STRTDATE < DateMake()) {
            if (cult[i].END_DATE >= DateMake()) {
              PutmenuList();
            }
          }
        }
        num_search.innerHTML = "총 " + count + "건이 검색되었습니다.";
        // 최초 목록 표시시 카테고리 버튼 선택하기
        for (k = 0; k < tab_radio.length; k++) {
          if (tab_radio[k].value == `${data}`) {
            tab_radio[k].checked = true;
          }
        }
      }

      // 라이트박스
      var lightbox = document.querySelector("#lightbox");
      var block = document.querySelector("#block"); // 라이트박스 배경
      var btnopn = document.getElementsByClassName("thumb");
      var btncls = document.getElementsByClassName("btn-close");
      var figure = document.querySelector("figure");
      var info = document.getElementById("info");

      // 라이트 박스 열기
      function lightbox_open(num) {
        figure.innerHTML =
          '<img src="' + cult[num].MAIN_IMG + '" class="active" alt="" />';
        info.innerHTML =
          "<h1>" +
          cult[num].TITLE +
          "</h1><p>기간: " +
          cult[num].DATE +
          " <br><br>장소: " +
          cult[num].PLACE +
          '<br><br><a href="' +
          cult[num].ORG_LINK +
          '" target="_blank" >홈페이지 바로가기</a><br><br></p>';
        lightbox.setAttribute("class", "active");
        block.setAttribute("class", "active");
      }
      // 라이트 박스 닫기
      function lightbox_close() {
        lightbox.removeAttribute("class");
        block.removeAttribute("class");
      }
      // 라이트 박스 표시

      for (i = 0; i < btnopn.length; i++) {
        btnopn[i].onclick = function () {
          lightbox_open(this.dataset.no);
        };
      }

      btncls[0].onclick = lightbox_close;

      // 현재 / 예정 선택 함수
      list_btn.addEventListener("click", function () {
        menuList.innerHTML = "";
        count = 0;
        for (i = 0; i < cult.length; i++) {
          if (tab_check[1].checked) {
            if (cult[i].STRTDATE > DateMake()) {
              PutmenuList();
            }
          } else {
            if (cult[i].STRTDATE < DateMake()) {
              if (cult[i].END_DATE >= DateMake()) {
                PutmenuList();
              }
            }
          }
        }
        num_search.innerHTML = "총 " + count + "건이 검색되었습니다.";
      });

      // 검색기능
      var searchInput = document.getElementById("search-list");
      var searchBtn = document.getElementById("searchBtn");
      searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const val = searchInput.value;
        SearchList(val);
      });

      // 검색으로 보여주는 목록
      function SearchList(val) {
        menuList.innerHTML = "";
        count = 0;
        for (i = 0; i < cult.length; i++) {
          if (cult[i].TITLE.includes(val)) {
            if (tab_check[1].checked) {
              if (cult[i].STRTDATE > DateMake()) {
                PutmenuList();
              }
            } else {
              if (cult[i].STRTDATE < DateMake()) {
                if (cult[i].END_DATE >= DateMake()) {
                  PutmenuList();
                }
              }
            }
          }
        }
        num_search.innerHTML = "총 " + count + "건이 검색되었습니다.";
        for (i = 0; i < btnopn.length; i++) {
          btnopn[i].onclick = function () {
            lightbox_open(this.dataset.no);
          };
        }
      }

      function PutmenuList() {
        menuList.innerHTML +=
          ' <li class="show-list"><div class="clt-img">' +
          '<img class="thumb" src ="' +
          cult[i].MAIN_IMG +
          '" data-no="' +
          i +
          '" style="width:100%;height:100%" />' +
          '</div><div class="clt-title">' +
          cult[i].TITLE +
          "</div></li>";
        count++;
      }
    });
}

// 오늘 날짜 yyyy - mm - dd 형식으로 가져오는 함수
function DateMake() {
  let today = new Date();
  let now =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1 < 9
      ? "0" + (today.getMonth() + 1)
      : today.getMonth() + 1) +
    "-" +
    (today.getDate() < 9 ? "0" + today.getDate() : today.getDate());
  return now;
}



// 내일 해야할 일.
// 두번 클릭해야 바뀌는거 수정하기
// 필요없는 코드 삭제하기
// github에 외부 api 로 올려보고 에러확인해서 교수님께 이메일 보내기
