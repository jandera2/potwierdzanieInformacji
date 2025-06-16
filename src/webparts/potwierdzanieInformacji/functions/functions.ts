export async function getElementsFromList(listUrl: string, listName: string, selectedFields?: string): Promise<Array<any>> {

    /*
    * param: listUrl: string - full path to your page
    * param: listName: string - full name of your list
    * param: filters: string - full text of odata filter f.e. BirthdayDate ge '2000-${varDateNow.getMonth() + 1}, reference: https://www.odata.org/getting-started/basic-tutorial/#filter
    * param: selectedFields: string - full text of selected fields, separated by ',' f.e. BirthdayDate,Email, reference: https://www.odata.org/getting-started/basic-tutorial/#select
    */

    /*
    * response: Promise of JSON file containing all items from your list, or filtered items if using filters
    */

    let apiUrl: string = listUrl + `/_api/lists/GetByTitle('${listName}')/items?expand=fields`;

    if (!listUrl || !listName) {
        return;
    }

    if (selectedFields) {
        const apiSelectedFields: string = `&$select=${selectedFields}`;
        apiUrl = apiUrl + apiSelectedFields;
    }

    //pobranie danych z listy SPO
    const myArray = await fetch(apiUrl,
        {
            method: 'GET',
            headers: { "Accept": "application/json; odata=verbose" }
        }
    );

    //konwertowanie danych na format JSON
    let myArrayJSON = await myArray.json();
    //wybranie interesujących nas danych (wejście głębiej w strukturę JSON'a)
    myArrayJSON = myArrayJSON.d.results;

    return myArrayJSON;

    /*
    * response - array of items from Sharepoint list
    */
}

export async function getElementFromList(listUrl: string, listName: string, id: number, email: string): Promise<any> {

    if (!listUrl || !listName) {
        return;
    }

    const apiLink = `${listUrl}/_api/lists/GetByTitle('${listName}')/items?expand=fields&$filter=ConsentDef eq ${id} and Title eq '${email}'`;

    let arrayNews = await fetch(apiLink,
        {
            method: 'GET',
            headers: { "Accept": "application/json; odata=verbose" }
        }
    );

    if (arrayNews.ok) {

        let arrayNewsJSON = await arrayNews.json();

        const arrayResult = arrayNewsJSON.d.results.length;

        return !!arrayResult;

    }
}


export async function getDef(listUrl: string, listName: string, id: number): Promise<any>  {

    if (!listUrl || !listName) {
        return;
    }

    const apiLink = `${listUrl}/_api/lists/GetByTitle('${listName}')/items?expand=fields&$filter=Id eq '${id}'`;

    let arrayNews = await fetch(apiLink,
        {
            method: 'GET',
            headers: { "Accept": "application/json; odata=verbose" }
        }   
    );

    if (arrayNews.ok) {

        let arrayNewsJSON = await arrayNews.json();

        const arrayResult = arrayNewsJSON.d.results;

        console.log(arrayResult);

        if(arrayResult && arrayResult[0] && arrayResult[0].ConsentText ) return arrayResult;

        return;
    }
  }

export function addDays(date: string, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function createFilterString(days: number, opt1?: Date, opt2?: Date): string {
    const varDateNow: string = new Date().toDateString();
    let con; //conjuction, AND/OR
    let varDate;
    let result;
    switch (days) {
        case (-1):
            varDate = addDays(varDateNow, 364);
            break;
        case (365):
            if (opt1 && opt2) {
                result = `BirthdayDate gt '2000-${setCorrectDatePart(opt1.getMonth() + 1)}-${setCorrectDatePart(opt1.getDate())}' and BirthdayDate lt '2000-${setCorrectDatePart(opt2.getMonth() + 1)}-${setCorrectDatePart(opt2.getDate())}'`;
            }
            break;
        /*
    case (7):
        varDate = addDays(varDateNow, days);
        con = datesInSameYear(varDateNow, varDate) ? '&&' : '||';
        result = `BirthdayDate gt '2000-${new Date().getMonth() + 1}-${new Date().getDate()} ` + con + ` BirthdayDate lt '2000-${varDate.getMonth() + 1}-${varDate.getDate()}'`;
        break;
    case (14):
        varDate = addDays(varDateNow, days);
        con = datesInSameYear(varDateNow, varDate) ? '&&' : '||';
        result = `BirthdayDate gt '2000-${new Date().getMonth() + 1}-${new Date().getDate()} ` + con + ` BirthdayDate lt '2000-${varDate.getMonth() + 1}-${varDate.getDate()}T21:59:00Z'`;
        break;
    case (30):
        varDate = addDays(varDateNow, days);
        con = datesInSameYear(varDateNow, varDate) ? '&&' : '||';
        result = `BirthdayDate gt '2000-${new Date().getMonth() + 1}-${new Date().getDate()} ` + con + ` BirthdayDate lt '2000-${varDate.getMonth() + 1}-${varDate.getDate()}T21:59:00Z'`;
        break;
    case (90):
        varDate = addDays(varDateNow, days);
        con = datesInSameYear(varDateNow, varDate) ? '&&' : '||';
        result = `BirthdayDate gt '2000-${new Date().getMonth() + 1}-${new Date().getDate()} ` + con + ` BirthdayDate lt '2000-${varDate.getMonth() + 1}-${varDate.getDate()}T21:59:00Z'`;
        break;
        */
        default:
            varDate = addDays(varDateNow, days + 1);
            con = datesInSameYear(varDateNow, varDate) ? 'and' : 'or';
            result = `BirthdayDate gt '2000-${new Date(varDateNow).getMonth() + 1}-${new Date(varDateNow).getDate()}T23:59:59Z'` + con + ` BirthdayDate lt '2000-${varDate.getMonth() + 1}-${varDate.getDate()}T21:59:00Z'`;
            break;
    }
    return result;
}

export function datesInSameYear(sDateTodayStr: string, dDate: Date): boolean {
    const dDateTomorrow = addDays(sDateTodayStr, 1)
    if (dDate.getMonth() > dDateTomorrow.getMonth() || (dDate.getMonth() === dDateTomorrow.getMonth() && dDate.getDate() > dDateTomorrow.getDate())) return true; else return false;
}

export function createFilterToday(): string {
    const varDateNow: Date = new Date();
    const result = `BirthdayDate lt '2000-${varDateNow.getMonth() + 1}-${varDateNow.getDate()}T23:59:59Z' and BirthdayDate gt '2000-${varDateNow.getMonth() + 1}-${varDateNow.getDate()}T00:00:00Z'`;
    return result;//T23:59:00Z%27%20and%20BirthdayDate%20ge%20%272000-04-12T00:00:00Z
}

export function createCalendarEventLink(date: Date, userName: string): string {
    const result = `https://outlook.office.com/owa/?path=/calendar/view/Month&rru=addevent&startdt=2023-${date.getMonth() + 1}-${date.getDate()}T8:15:00&enddt=2023-${date.getMonth() + 1}-${date.getDate()}T8:15:00&subject=Urodziny+${userName}&body=Dzisiaj+${userName}+ma+urodziny.+Nie+zapomnij+zlozyc+zyczen,+a+moze+otrzymasz+kawalek+urodzinowego+serniczka!`;
    return result;
}

export function createTeamsLink(mail: string): string {
    const result = `sip:${mail}`;
    return result;
}

export function diffDateFromToday(d1: Date): string {
    const d2 = new Date();
    d1.setFullYear(d2.getFullYear());
    if (d2 > d1) d1.setFullYear(d2.getFullYear() + 1);
    const diff = d1.getTime() - d2.getTime();
    const daydiff: number = diff / (1000 * 60 * 60 * 24);
    if (!daydiff) {
        return "Wszystkiego najlepszego!";
    }
    else {
        if (daydiff){
            if(daydiff === 1) 
                return ("za 1 dzień")
                else
                return ("za " + Math.floor(daydiff) + " dni");
        }
    }
}

export function setCorrectDatePart(nDate: number): string {
    let sDate = nDate.toString();
    if (sDate.length === 1) {
        sDate = `0${sDate}`;
    }
    return sDate;
}

export async function getItems(apiLink: string, var_domElement: any, var_properties: any, varRandomId: string) {

    // Wywołanie zmiennych
    let myDate = new Date();
    let myHours: String;
    let myMinutes: String;

    // Dodawanie 0 przed godziną i minutą jeżeli są mniejsze od 10
    if (myDate.getUTCHours() < 10)
        myHours = "0" + myDate.getUTCHours();
    else
        myHours = myDate.getUTCHours().toString();

    if (myDate.getUTCMinutes() < 10)
        myMinutes = "0" + myDate.getUTCMinutes();
    else
        myMinutes = myDate.getUTCMinutes().toString();

    // Tworzenie zmiennych wykorzystywanych w filtrze API
    var filterValidFrom: string = `ValidFrom le '${myDate.getUTCFullYear()}-${myDate.getUTCMonth() + 1}-${myDate.getUTCDate()}T${myHours}:${myMinutes}:00Z'`; //zmienna zawierająca filtrowanie po polu ValidFrom
    var filterValidUntil: string = `ValidUntil ge '${myDate.getUTCFullYear()}-${myDate.getUTCMonth() + 1}-${myDate.getUTCDate()}T${myHours}:${myMinutes}:00Z'`; //Zmienna zawierająca filtrowanie po polu ValidUntil
    let apiFilter: string = "/items?expand=fields" + `&$filter=${filterValidFrom} and ${filterValidUntil}`; //Złożenie całego zapytania w jedną całość wraz z filtrami

    if (apiLink == "")
        console.log("Missing site address or list name!"); //Missing
    else {
        apiLink += apiFilter;
        //Pobranie danych z api SPO
        let arrayNews = await fetch(apiLink,
            {
                method: 'GET',
                headers: { "Accept": "application/json; odata=verbose" }
            }
        );
        let arrayNewsJSON = await arrayNews.json();
        let arrayResult = arrayNewsJSON.d.results;

        if (arrayResult.length == 0)
            var_domElement.style.display = "none";
        else {
            combineNews(arrayResult, var_domElement, var_properties, varRandomId);
        }
    }
}


export function combineNews(newsArray: Array<any>, var_domElement: HTMLElement, var_properties: any, varRandomId: string) {

    var varNewsString: string;
    var varNews: string = "";
    let varCountRows: number = newsArray.length;
    var varLineWidth;
    var varAnimationTime: number;
    let myStyles: any;

    for (var i: number = 0; i < varCountRows; i++) {
        // Zapisywanie samego tekstu wiadomości osobno żeby zmierzyć jego długość bez znacznika <div>
        varNewsString += newsArray[i].Title;

        // "Sklejanie" wiadomości. Warunkowo jest dodawane jest zdjęcie pomiędzy wiadomościami oraz sprawdzanie czy tekst ma być odnośnikiem do wiadomości
        if (i == varCountRows - 1) {
            if (!newsArray[i].NewsUrl || newsArray[i].NewsUrl.length === 0)
                varNews += `
              <div class="${myStyles.item}" style="font-family:'${var_properties.fontFamily}'; color: ${var_properties.fontColor}" id="xyz">
                ${newsArray[i].Title}
              </div>`;
            else
                varNews += `
              <div class="${myStyles.item}" style="font-family:'${var_properties.fontFamily}'; color: ${var_properties.fontColor}" id="xyz">
                <a href="${newsArray[i].NewsUrl}" target="_blank" style="color: ${var_properties.fontColor}">
                  ${newsArray[i].Title}
                </a>
              </div>`;
        }
        else {
            if (!newsArray[i].NewsUrl || newsArray[i].NewsUrl.length === 0)
                varNews += `
              <div class="${myStyles.item}" style="font-family:'${var_properties.fontFamily}'; color: ${var_properties.fontColor}" id="xyz">
                ${newsArray[i].Title}
                <img 
                  src="${var_properties.imageLink}" 
                  width="${var_properties.fontSize}" 
                  height="${var_properties.fontSize}" 
                  style="
                    margin-left:${var_properties.fontSize * 3}px;
                    margin-right: ${var_properties.fontSize * 3}px;
                    object-fit: contain;
                ">
              </div>`;
            else
                varNews += `
              <div class="${myStyles.item}" style="font-family:'${var_properties.fontFamily}'; color: ${var_properties.fontColor}" id="xyz">
                <a href="${newsArray[i].NewsUrl}" target="_blank" style="color: ${var_properties.fontColor}">
                  ${newsArray[i].Title}
                </a>
                <img 
                  src="${var_properties.imageLink}" 
                  width="${var_properties.fontSize}px" 
                  height="${var_properties.fontSize}px" 
                  style="
                    margin-left:${var_properties.fontSize * 3}px;
                    margin-right: ${var_properties.fontSize * 3}px;
                    object-fit: contain;
                ">
              </div>`;
        }
    }

    // Obliczanie długości tekstu na podstawie rozmiaru czcionki
    varLineWidth = measureText(varNewsString, var_properties.fontSize) + ((var_properties.fontSize * 7) * (varCountRows - 1));

    // Obliczanie czasu trwania animacji na podstawie ustawionej prędkości oraz szerokoście tekstu
    varAnimationTime = varLineWidth / (var_properties.scrollAmount * 2);

    // Ustawianie wartości diva wyświetlającego wiadomoście na utworzony ciąg wiadomości
    document.querySelectorAll(`[id=${varRandomId}]`).forEach(el => {
        el.innerHTML = varNews;
    });


    // Ustawianie zmiennych CSS odpowiedzialnych za obsługę animacji    
    var_domElement.style.setProperty("--varLineWidth", "-" + varLineWidth + "px");
    var_domElement.style.setProperty("--varAnimationTime", varAnimationTime + "s");
    //document.documentElement.style.setProperty("--varLineWidth", "-" + varLineWidth + "px");
    //document.documentElement.style.setProperty("--varAnimationTime", varAnimationTime + "s");

    // Wyświetlanie WebPartu na stronie
    var_domElement.style.visibility = 'visible';
}

export function measureText(str: string, fontSize: number) {
    const widths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875, 0.8890625, 0.665625, 0.190625, 0.3328125, 0.3328125, 0.3890625, 0.5828125, 0.2765625, 0.3328125, 0.2765625, 0.3015625, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.2765625, 0.2765625, 0.584375, 0.5828125, 0.584375, 0.5546875, 1.0140625, 0.665625, 0.665625, 0.721875, 0.721875, 0.665625, 0.609375, 0.7765625, 0.721875, 0.2765625, 0.5, 0.665625, 0.5546875, 0.8328125, 0.721875, 0.7765625, 0.665625, 0.7765625, 0.721875, 0.665625, 0.609375, 0.721875, 0.665625, 0.94375, 0.665625, 0.665625, 0.609375, 0.2765625, 0.3546875, 0.2765625, 0.4765625, 0.5546875, 0.3328125, 0.5546875, 0.5546875, 0.5, 0.5546875, 0.5546875, 0.2765625, 0.5546875, 0.5546875, 0.221875, 0.240625, 0.5, 0.221875, 0.8328125, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.3328125, 0.5, 0.2765625, 0.5546875, 0.5, 0.721875, 0.5, 0.5, 0.5, 0.3546875, 0.259375, 0.353125, 0.5890625];
    const avg = 0.5279276315789471;
    return str
        .split('')
        .map(c => c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg)
        .reduce((cur, acc) => acc + cur) * fontSize;
}

import { ServiceScope } from '@microsoft/sp-core-library';
import { SPHttpClient } from '@microsoft/sp-http';


export async function postItems(props, approvalText, context) {

    const apiLink = `${props.confirmListUrl}/_api/lists/GetByTitle('${props.confirmListName}')/items?expand=fields`;

    if (!apiLink || !props.confirmListUrl || !props.confirmListName|| !props.choosenDef) {

        return;

    } else {

        let req = context.spHttpClient.post(

            `${props.confirmListUrl}/_api/lists/GetByTitle('${props.confirmListName}')/items`,

            SPHttpClient.configurations.v1,
            {
                body: JSON.stringify({
                    "Title": props.context.pageContext.user.email,
                    "ConsentDefId": props.choosenDef,
                    "ConsentText": approvalText
                })  
            }
        ).then(result => {
        });
    }

}