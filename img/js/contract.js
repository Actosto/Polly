const CONTRACT_ADDRESS = "n1oyVmJtE5DZt1GmHpnUGYjy9AjZJTE2q1N";

class SmartContractApi {
    constructor(contractAdress) {
        let NebPay = require("nebpay");
        this.nebPay = new NebPay();
        this._contractAdress = contractAdress || CONTRACT_ADDRESS;
    }

    getContractAddress() {
        return this.contractAdress;
    }

    _simulateCall({
        value = "0",
        callArgs = "[]",
        callFunction,
        callback
    }) {
        this.nebPay.simulateCall(this._contractAdress, value, callFunction, callArgs, {
            callback: function (resp) {
                if (callback) {
                    callback(resp);
                }
            }
        });
    }

    _call({
        value = "0",
        callArgs = "[]",
        callFunction,
        callback
    }) {
        this.nebPay.call(this._contractAdress, value, callFunction, callArgs, {
            callback: function (resp) {
                if (callback) {
                    callback(resp);
                }
            }
        });
    }
}

class ContractApi extends SmartContractApi {
    getPollById(id, cb) {
        this._simulateCall({
            callArgs: `["${id}"]`,
            callFunction: "getPollById",
            callback: cb
        });
    }

    getPollsByWallet(wallet, cb) {
        this._simulateCall({
            callArgs: `["${wallet}"]`,
            callFunction: "getPollsByWallet",
            callback: cb
        });
    }

    getMyPolls(cb) {
        this._simulateCall({
            callFunction: "getMyPolls",
            callback: cb
        });
    }

    getPolls(cb) {
        this._simulateCall({
            callFunction: "getPolls",
            callback: cb
        });
    }

    addPoll(title, items, cb) {
        let itemsJson = JSON.stringify(items);
        let request = [title, itemsJson];

        this._call({
            callArgs: JSON.stringify(request),
            callFunction: "addPoll",
            callback: cb
        });
    }

    vote(pollId, itemId, cb) {
        this._call({
            callArgs: `["${pollId}", "${itemId}"]`,
            callFunction: "vote",
            callback: cb
        });
    }
}