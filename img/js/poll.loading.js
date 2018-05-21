'use strict';

function addPollHandler() {
    let form = document.querySelector("#createPoll");
    let addAnswerBtn = form.querySelector("#addAnswer");

    addAnswerBtn.onclick = function () {
        let container = document.querySelector(".answers");
        let div = document.createElement('div');
        div.innerHTML =
            `<div class="form-group form-control-sm">
                <input type="text" class="form-control form-control-sm answer" placeholder="Answer" maxlength="500">
            </div>`;
        container.append(div.firstChild);
    }

    form.onsubmit = function (event) {
        event.preventDefault();

        let title = document.querySelector("#title").value;
        let fields = document.querySelectorAll(".answer");
        let answers = [];

        for (let field of fields) {
            if (field.value != "") {
                answers.push(field.value);
            }
        }

        api.addPoll(title, answers, (response) => { });
    }
}

document.querySelector("#myPolls").onclick = () => {
    loadMyPolls();
};

loadPolls();

function loadPolls() {
    api.getPolls((response) => {
        if (response && response.result) {
            let polls = JSON.parse(response.result);
            polls = polls.reverse();

            for (let poll of polls) {
                appendPoll(poll);
            }
        }
    });
}

function loadMyPolls() {
    api.getMyPolls((response) => {
        if (response && response.result) {
            console.warn(response);
            let polls = JSON.parse(response.result);
            polls = polls.reverse();

            document.querySelector(".polls").innerHTML = "";

            for (let poll of polls) {
                appendPoll(poll);
            }
        }
    });
}