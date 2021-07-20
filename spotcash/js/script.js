$(document).ready(() => {
    const currencies = ["USD", "BTC", "EUR", "CAD", "ARS", "GBP", "JPY", "LTC", "CHF", "AUD", "CNY", "ILS", "ETH", "XRP", "DOGE", "SGD", "AED", "DKK", "HKD", "MXN", "NOK", "NZD", "PLN", "SAR", "SEK", "THB", "TRY", "TWD", "ZAR", "CLP", "PYG", "UYU", "COP", "PEN", "BOB", "RUB", "INR"]

    function optionsOnSelect() {
        currencies.forEach(element => {
            $("#options-coin").append(`
            <option value="${element}-BRL"> ${element}-BRL</option>
            `)
        });
    }

    optionsOnSelect();

    $.get(" https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL", (_dataCoin) => {

        $("#general-info-conteiner").append(`
        <div id="space-one">${_dataCoin["USDBRL"].code} R$${(_dataCoin["USDBRL"].bid.replace(".", ","))} <div id="green-marker"></div> </div>
        <div id="space-two">${_dataCoin["EURBRL"].code} R$${(_dataCoin["EURBRL"].bid.replace(".", ","))} <div id="yellow-marker"></div> </div>
        <div id="space-three">${_dataCoin["BTCBRL"].code} R$${(_dataCoin["BTCBRL"].bid.replace(".", ","))} <div id="pink-marker"></div> </div>
        `);
    });

    $("#options-coin").on("change", function () {
        const coinSelected = $(this).val();

        if (coinSelected == "null") {
            return
        } else {
            console.log(`https://economia.awesomeapi.com.br/json/last/${coinSelected}`);

            $.get(`https://economia.awesomeapi.com.br/json/last/${coinSelected}`, (_data) => {
                const dataCoin = _data[coinSelected.replace("-", "")];
                const timeHours = (dataCoin.create_date).substr(11, 19);

                let timeDate = new Date((dataCoin.create_date).substr(0, 11));
                timeDate = timeDate.toDateString();

                $("#display").html(`
                    <p id="date">${(timeDate)}</p>
                    <h2 id="value-coin">R$ ${(dataCoin.bid.replace(".", ","))}</h2>
                    <p id="hour">${timeHours}</p>
                    <p id="conversion">${dataCoin.name}</p>
                    <p id="minimum">min R$${(dataCoin.low).replace(".", ",")}</p>
                    <p id="maximum">R$${(dataCoin.high).replace(".", ",")} máx</p>
                `);
            });
        }
    });

    $("#btn-search").on("click", () => {
        const coinSelected = $("#options-coin").val();

        if (coinSelected == "null") {
            $("#search-result").html("<div><p>Escolha uma moeda</p></div>");
            return

        } else {
            const initialDate = $("#initial-date").val();
            const finalDate = $("#final-date").val();

            if (initialDate != [] && finalDate != []) {
                $("#search-result").html("");
                $("#search-result").html(` <div id="show-values"></div>`);

                const numberOfDays = (Date.parse(finalDate) - Date.parse(initialDate)) / (1000 * 3600 * 24);
                const initialDateNoReplaced = initialDate.replace(/-/g, "");
                // const initialDateReplaced = initialDate.replace(/-/g, " ");

                let accountDate = new Date(initialDate).getTime();

                for (let i = 0; i <= numberOfDays && i < 10; i++) {

                    let finalDateAccount = new Date(accountDate).toISOString();
                    finalDateAccount = finalDateAccount.substr(0, 10);
                    finalDateAccount = finalDateAccount.replace(/-/g, "");
                    console.log(finalDateAccount);

                    $.get(`https://economia.awesomeapi.com.br/json/daily/${coinSelected}/1?start_date=${initialDateNoReplaced}&end_date=${finalDateAccount}`, (_period) => {
                        try {
                            const periodCoin = _period;

                            $("#show-values").append(`
                            <div>
                                <p>${periodCoin[0].code}</p>  
                                <p>${periodCoin[0].name} </p>
                                <p>R$${periodCoin[0].bid.replace(".", ",")}</p>
                                <p>${periodCoin[0].create_date}</p>
                             </div>`
                            );

                        } catch {
                            $("#search-result").html("<div><p>Período não disponível no banco de dados.</p></div>");
                        }
                    });
                    accountDate += 86400000;
                }
            } else {
                $("#search-result").html("<div><p>Insira uma data válida</p></div>");
                return
            }
        }
    });
});
