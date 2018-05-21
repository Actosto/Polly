let timeout = setTimeout(function it() {
    let isExtensionExist = typeof (webExtensionWallet) !== "undefined";
    if (isExtensionExist !== undefined) {
        // document.querySelector("#loadMyPosts").addEventListener("click", () => loadMyMessages());
        addPollHandler();
    } else {
        timeout = setTimeout(it, 200);
    }
}, 200);