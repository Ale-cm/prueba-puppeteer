
const puppeteer = require('puppeteer');

(async () => {
 const browser = await puppeteer.launch({ 
    headless: true, //defaults to true 
    defaultViewport: null, //Defaults to an 800x600 viewport
      args:['--start-maximized' ]
    });// dentro de launch podemos poner 
  const page = await browser.newPage();
  await page.goto('https://www.amazon.com/-/es/');
  await page.screenshot({path: 'amazon1.jpg'});

  await page.type('#twotabsearchtextbox','libros de javascript')
  await page.screenshot({path: 'amazon2.jpg'});

  await page.click('.nav-search-submit-text input');
  await page.waitForSelector('[data-component-type=s-search-result]'); //espera hasta que encuentre el selector
  await page.screenshot({path: 'amazon3.jpg'});

            const enlaces = await page.evaluate(()  => {  // función anonima 
              const elements = document.querySelectorAll('[data-component-type=s-search-result] h2 a'); // el espacio cambia la declaracion en este caso en h2 busca a 
              const links = []; //carga los links 
                    for(let element of elements){         
                    links.push(element.href);  
                    }   
            return links;
  });
  console.log(enlaces.length);
  console.log(enlaces, "                   \n");
  const books = [];
  for(let enlace of enlaces){   //va pasando enlace por enlace hasta terminar 

    await page.goto(enlace, {"waitUntil" : "networkidle0"}); 
    //await page.waitForSelector("#title"); // espera el selector y luego avanza
    
  
    const book= await page.evaluate(() => {  //dentro de un enlace busca titulo y autor. al terminar se guarda en book
          const tmp = {};
         
             tmp.title = document.querySelector("#productTitle").innerText;
          tmp.author = document.querySelector("#bylineInfo a").innerText;
      
         
          return tmp;
    });
              books.push(book); // cada libro guardado se envia a la const books 
  }
  console.log(books);
  await browser.close();
})();

/*
 
    
*/