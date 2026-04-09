// use strict in JS code
"use strict";

// checkPhone
function checkPhone() {

    const pOne = document.getElementById("phoneFirstPart").value.trim();
    const pTwo = document.getElementById("phoneSecondPart").value.trim();
    const pThree = document.getElementById("phoneThirdPart").value.trim();

    if (pOne.length === 3 && pTwo.length === 3 && pThree.length === 4 && 
        isDigits(pOne) && isDigits(pTwo) && isDigits(pThree)) {

        return "";
    }

    else {

        return "Invalid phone number";
    }
}

// helper for checkPhone
function isDigits(nums) {

    for (let i = 0; i < nums.length; i++) {

        if (nums[i] < '0' || nums[i] > '9') { 
            
            return false; 
        }
    }

    return true;
}

//checkConditions
function checkCondition() {

    const bp = document.getElementById("highBloodPressure").checked;
    const diabetes = document.getElementById("diabetes").checked;
    const glaucoma = document.getElementById("glaucoma").checked;
    const asthma = document.getElementById("asthma").checked;
    const none = document.getElementById("none").checked;

    if (!bp && !diabetes && !glaucoma && !asthma && !none) {

        return "No conditions selected";
    }

    else if (none && (bp || diabetes || glaucoma || asthma)) {

        return "Invalid conditions selection";
    }

    else {
        
        return "";
    }
}


// checkTime
function checkTime() {

    const time = document.getElementsByName("period");

    for (let i = 0; i < time.length; i++) {

        if (time[i].checked) { 
            
            return ""; 
        }
    }

    return "No time period selected";
}

// check study
function checkStudy() {

    const sOne  = document.getElementById("firstFourDigits").value.trim();
    const sTwo = document.getElementById("secondFourDigits").value.trim();

    // realized I could use isDigits here too
    if (sOne.length !== 4 || sTwo.length !== 4 ||
        sOne[0] !== 'A' || sTwo[0] !== 'B' || 
        !isDigits(sOne.substring(1)) || !isDigits(sTwo.substring(1))) {

        return "Invalid study id";
    }

    else {

        return "";
    }
}


// checkSubmit
function checkSubmit() {

    const msgs = [];

    const phoneMsg = checkPhone();
    const conditionMsg = checkCondition();
    const timeMsg = checkTime();
    const studyMsg = checkStudy();

    if (phoneMsg !== "") { 

        msgs.push(phoneMsg);      
    }

    if (conditionMsg !== "") { 

        msgs.push(conditionMsg); 
    }

    if (timeMsg !== "") { 

        msgs.push(timeMsg);     
    }

    if (studyMsg !== "") { 

        msgs.push(studyMsg);    
    }

    // if error msgs
    if (msgs.length > 0) {

        alert(msgs.join("\n"));
        return;
    }

    // no error msgs
    else {

        const confirmed = confirm("Do you want to submit the form data?");

        if (confirmed) {
        
            document.getElementById("mainForm").submit();
        }
    }
}

// main
function main() {

    document.getElementById("submitBtn").onclick = checkSubmit;
}

window.onload = main;