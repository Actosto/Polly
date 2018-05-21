'use strict';

let api = new ContractApi();

function appendPoll(poll, showResults) {
    let container = document.querySelector(".polls");
    let div = document.createElement('div');
    div.innerHTML = _getPollHtml(poll, showResults);
    container.append(div.firstChild);
    setHandlers(poll);
}

function setPoll(poll, showResults) {
    let html = _getPollHtml(poll, showResults);
    $(`.poll[data-id=${poll.id}]`).html(html);
    setHandlers(poll);
}

function setHandlers(poll) {
    _voteHandler(poll);
    _showResultsHandler(poll);
    _selectItemHandler(poll.id);
}

function _voteHandler(poll) {
    $(() => {
        $(`.poll[data-id=${poll.id}]`).find("button[data-id=vote]").click(function (event) {
            let itemId = $(`.poll[data-id=${poll.id}]`).find("label.selected").attr('data-id');
            poll.selectedItemId = itemId;

            api.vote(poll.id, itemId, (response) => { });

            setPoll(poll, true);
            event.preventDefault();
        });
    });
}

function _showResultsHandler(poll) {
    $(() => {
        $(`.poll[data-id=${poll.id}]`).find(`button[data-id=showResults]`).click(function (event) {
            setPoll(poll, true);
            event.preventDefault();
        });
    });
}

function _selectItemHandler(id) {
    $(() => {
        $(`.poll[data-id=${id}]`).find("label").click(function (event) {
            $(`.poll[data-id=${id}]`).find("label").removeClass('selected').addClass('unselected');
            $(this).removeClass('unselected').addClass('selected');
            event.preventDefault();
        });
    });
}

function _getPollHtml(poll, showResults) {
    let isUserSelect = poll.selectedItemId == "0" || poll.selectedItemId === 0 || +poll.selectedItemId > 0;

    if (showResults || isUserSelect) {
        let max = 0;

        for (let item of poll.items) {
            item.isSelected = false;
            item.results = {};
            item.results.percent = 0;
            item.results.isWinner = false;

            if (item.voteCount > max) {
                max = item.voteCount;
            }
        }

        console.warn(poll);

        if (isUserSelect) {
            for (let item of poll.items) {
                if (item.id == poll.selectedItemId) {
                    item.isSelected = true;
                }
            }
        }

        if (max != 0) {
            for (let item of poll.items) {
                item.results.percent = item.voteCount * 100 / max;
                item.results.isWinner = item.voteCount == max ? true : false;
            }
        }
    }

    let items = "";
    for (let item of poll.items) {
        items += _getItemHtml(item);
    }

    return `<div class="poll d-flex justify-content-between" data-id="${poll.id}">
            <div class="data">
                <div class="title d-flex">
                    <div href="poll.html#${poll.id}">${poll.title}</div>
                </div>

                <form>
                    ${items}
                </form>
        
                <div class="d-flex justify-content-between">
                    <div>
                        <button type="submit" class="btn btn-sm btn-success" data-id="vote">Vote</button>
                        <button class="btn btn-sm btn-dark" data-id="showResults">Results</button>
                    </div>
                    <div class="meta">
                        <div class="created">
                            <i class="far fa-clock"></i>
                            ${convertUnixStampToScreenDate(Date.parse(poll.created))}
                        </div>
        
                        <div class="from">
                            <i class="far fa-user"></i>
                            <span>${poll.wallet}</span>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>`;
}

function _getItemHtml(item) {
    let hidden = "hidden";
    let percent = 0;
    let selectedClass = "unselected";
    let resultsClass = "";

    if (item.results) {
        hidden = "";
        percent = item.results.percent;
        resultsClass = item.results.isWinner ? "poll-result__progress_winner" : "";
        if (item.isSelected) {
            selectedClass = "selected"
        }
    }

    return `<div class="poll-item ${selectedClass}">
                <div class="item d-flex">
                    <input type="radio" name="options" id="poll-1">

                    <label title="" class="d-flex ${selectedClass}" data-id="${item.id}" for="poll-1">
                        <span>${item.text}</span>
                    </label>
                </div>

                <div class="result" ${hidden}>
                    <div class="d-flex justify-content-between">
                        <div>${percent.toFixed(2)}%</div>
                        <div>${item.voteCount}</div>
                    </div>
                    <div class="poll-result__bar">
                        <div style="width: ${percent}%" class="poll-result__progress ${resultsClass}"></div>
                    </div>
                    
                </div>
            </div>`;
}

function convertUnixStampToScreenDate(unixstamp) {
    return new Date(+unixstamp).toLocaleString();
}

function convertScreenDateToUnixStamp(date) {
    let pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    let dt = new Date(date.replace(pattern, '$3-$2-$1'));
    return +dt;
}

const weiAtNas = new BigNumber(1000000000000000000);

function convertWeiToNas(value) {
    return new BigNumber(value).dividedBy(weiAtNas).toNumber();
}

function convertNasToWei(value) {
    return new BigNumber(value).multipliedBy(weiAtNas).toNumber();
}

function addZeroIfOneCharacter(value) {
    let str = value.toString();
    return str.length == 1 ? "0" + str : str;
}