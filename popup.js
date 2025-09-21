let logs = [];
let counts = {};



const palette = ["#E44C4C", "#54E7F5", "#F5BF54", "#A199F0", "#90E65F", "#F05499", "#33d4b1ff", "#F19E29", "#CD72E7"];
const getColors = dataLength => {
    return Array.from({length: dataLength}, (_, i) => palette[i % palette.length]);
}

chrome.storage.local.get(["logs"], result => {
    logs = result.logs || [];
    counts = {};
    logs.forEach(entry => {
        counts[entry.domain] = (counts[entry.domain] || 0) + 0.1
    });
    pieChart = document.getElementById("pieChart").getContext("2d");
    new Chart(pieChart, {
        type: "doughnut",
        data: {
            labels: Object.keys(counts),
            datasets: [{
                label: "Minutes",
                data: Object.values(counts),
                backgroundColor: getColors(Object.keys(counts).length)
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
});


const loadWhitelist = () => {
    chrome.storage.local.get(["whitelist"], (result) => {
        const list = result.whitelist || [];

        siteList.innerHTML = "";
        list.forEach((site, i) => {
            const li = document.createElement("li");
            li.textContent = site + " ";
            const XButton = document.createElement("button");
            XButton.textContent = "X";
            XButton.onclick = () => {
                list.splice(i, 1);
                chrome.storage.local.set({whitelist: list}, loadWhitelist);
            }
            li.appendChild(XButton);
            document.getElementById("siteList").appendChild(li);
        });
    });
}

document.getElementById("siteAdd").onclick = () => {
    const site = document.getElementById("siteInput").value.trim();
    if (site) {
        chrome.storage.local.get(["whitelist"], (result) => {
            const list = result.whitelist || [];
            if (!list.includes(site)) {
                list.push(site);
                chrome.storage.local.set({whitelist: list}, loadWhitelist);
            }
        });
    }
    input.value = "";
};

loadWhitelist();

document.getElementById("clearData").onclick = () => {
    chrome.storage.local.clear();
}