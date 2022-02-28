/****
  Code in this file will be inserted in the page
****/

function addTooltip(row){
  /*
    Make tooltip displaying brief informations
  */


  // If there is no preceeding element, make tooltip
  if (document.getElementsByClassName("hyextension_tooltip").length === 0){
    /*
      Fetch infos
    */
    var body = {
       "strSuupYear": "2022",
       "strSuupTerm": "10",
       "strSuupNo": row.children.suupNo2.textContent
    };
    // TODO: Year/semester selecting option

    // 성적산출
    var gradeMethodText = '';
    const xhr1 = new XMLHttpRequest();
    xhr1.onload = function () {
        if (xhr1.readyState === xhr1.DONE) {
            if (xhr1.status === 200) {
                gradeMethodText = JSON.parse(xhr1.responseText).DS_SUUPGS03TTM01[0].list[0].sjkInsertGb
            }
        }
    };

    xhr1.open("POST",
              "https://portal.hanyang.ac.kr/sugang/SuscAct/findSuupSugangDetailInfo.do",
            false);
    // FIXME: Use asynchronous fetch, not blocking fetch (await or promise?)
    xhr1.setRequestHeader('Content-Type', 'application/json+sua');
    xhr1.send(JSON.stringify(body));


    // 이수제한
    var applyLimitText = '';
    const xhr2 = new XMLHttpRequest();
    xhr2.onload = function () {
        if (xhr2.readyState === xhr2.DONE) {
            if (xhr2.status === 200) {
                for (let major of JSON.parse(xhr2.responseText).DS_SUUPGS03TTM04[0].list){
                    applyLimitText += `<ul> <b> ${major.isujehanSosokNm} </b>
                    :  ${major.grade1} ${major.grade2} ${major.grade3} ${major.grade4} ${major.grade5}`;
                }
                if (applyLimitText.length === 0)
                {
                  applyLimitText = "<b>없음</b>"
                }
            }
        }
    };

    xhr2.open("POST",
              "https://portal.hanyang.ac.kr/sugang/SgscAct/findSuupSugangIsuGbHakgwa.do",
            false);
    xhr2.setRequestHeader('Content-Type', 'application/json+sua');
    xhr2.send(JSON.stringify(body));

    // TODO: syllabus -> assignments, exam schedules
    // TODO: everytime -> class score / recent comment

    /*
      Make tooltip element and insert element
    */


    // Declare div element
    const tooltip = document.createElement("div");
    tooltip.setAttribute("class", "hyextension_tooltip");
    tooltip.setAttribute("contentEditable", "true");
    tooltip.setAttribute("style", `top:${cursor_y}px; left:${cursor_x}px;`);

    // Make tooltip contents
    // TODO: Use Vue template
    tooltip.innerHTML = `<h1> <b>${row.children.gwamokNm.textContent}</b>
    (${row.children.daepyoGangsaNm.textContent})</h1><br />
    <li> 대상학과 : <b>${row.children.banSosokNm.textContent}</b> </li>
    <li> 강좌유형 : <b>${row.children.suupTypeNm.textContent}</b> </li>
    <li> 성적산출 : ${gradeMethodText}</li>
    <br /><br />
    <p> 이수제한 </p><br />
    ${applyLimitText}`;

    console.log(tooltip.innerHTML);

    // Add element
    document.body.appendChild(tooltip);
  }
}

function removeTooltip(row){
  if (document.getElementsByClassName("hyextension_tooltip").length != 0){
    document.body.removeChild(document.body.lastChild);
  }
}

// Attach EventListner to all rows
document.querySelectorAll('tr')
.forEach(function(e){
  // All class row's class name starts with 'even' or 'odd'
  // Search accordingly
  if (e.className.startsWith('even') || e.className.startsWith('odd')){
    e.addEventListener("mouseover", function(){ addTooltip(this) });
    e.addEventListener("mouseleave",function(){ removeTooltip(this) });
  }
});

// Track mouse position for setting tooltip position
var cursor_x = -1;
var cursor_y = -1;
document.addEventListener('mousemove', (event) => {
  cursor_x = event.pageX;
  cursor_y = event.pageY;
});
