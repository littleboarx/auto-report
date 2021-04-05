
import puppeteer from 'puppeteer';



const URL_LOGIN = 'https://newsso.shu.edu.cn/login/eyJ0aW1lc3RhbXAiOjE2MDM0Mzc2MjI0MDk1NTMxODQsInJlc3BvbnNlVHlwZSI6ImNvZGUiLCJjbGllbnRJZCI6IldVSFdmcm50bldZSFpmelE1UXZYVUNWeSIsInNjb3BlIjoiMSIsInJlZGlyZWN0VXJpIjoiaHR0cHM6Ly9zZWxmcmVwb3J0LnNodS5lZHUuY24vTG9naW5TU08uYXNweD9SZXR1cm5Vcmw9JTJmRGVmYXVsdC5hc3B4Iiwic3RhdGUiOiIifQ==';
const URL_REPORT = 'http://selfreport.shu.edu.cn/DayReport.aspx';
const SELECTOR_INPUT_USERNAME = '#username';
const SELECTOR_INPUT_PASSWORD = '#password';
const SELECTOR_LOGIN_SUBMIT = '#submit';
const SELECTOR_REPORT_SUBMIT = '#p1_ctl00_btnSubmit';
const SELECTOR_REPORT_SUCCESS = '.f-panel > div.f-panel-bodyct > div.f-panel-body.f-widget-content > table > tr > td.f-messagebox-messagect > div';

const SELECTOR_INPUT_CHECKBOX = '#p1_ChengNuo-inputEl-icon';
const SELECTOR_INPUT_TEMP = '#p1_TiWen-inputEl';

const TITLE_REDIRECTION_FAIL = '健康之路';
const TEXT_SUCCESS = '提交成功';

export default async () => {
  const DATA_USERNAME = process.env.DATA_USERNAME;
  const DATA_PASSWORD = process.env.DATA_PASSWORD;
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  const frame = page.mainFrame();
  function checkTime(i) {
    if (i < 10) { i = "0" + i }
    return i
  }
  console.log('Started new session.');
  try{

    await page.goto(URL_LOGIN);
    await page.screenshot({
      path:'1.png'
    })
    await page.setGeolocation({ latitude: 28.58808778, longitude: 112.36654665 });
    await frame.type(SELECTOR_INPUT_USERNAME, DATA_USERNAME, { delay: 100 });
    await frame.type(SELECTOR_INPUT_PASSWORD, DATA_PASSWORD, { delay: 100 });
    await Promise.all([
      frame.click(SELECTOR_LOGIN_SUBMIT),
      frame.waitForNavigation()
    ]);
    console.log('Logged in.');
        console.log(`https://selfreport.shu.edu.cn/DayReport.aspx?day=2021-${new Date().getMonth()+1}-${checkTime(new Date().getDate())}`);
        await page.goto(`https://selfreport.shu.edu.cn/DayReport.aspx?day=2021-${new Date().getMonth()+1}-${checkTime(new Date().getDate())}`);
        if ((await frame.title()) === TITLE_REDIRECTION_FAIL) {
          await page.goto(`https://selfreport.shu.edu.cn/DayReport.aspx?day=2021-${new Date().getMonth()+1}-${checkTime(new Date().getDate())}`);
        }
        const list = [7,9,12];
        await frame.waitForSelector(SELECTOR_REPORT_SUBMIT);
        await frame.waitForSelector(SELECTOR_INPUT_CHECKBOX);
        for(let index of list){
          let el = await frame.waitForSelector(`#fineui_${index}-inputEl-icon`,{visible: true});
          await el.click();
        }
        await frame.click(SELECTOR_INPUT_CHECKBOX);
        await frame.click('#p1_ctl00_btnSubmit');
        await page.screenshot({
          path:'1.png'
        })
        let result =  await Promise.race([frame.waitForXPath('/html/body/div[2]/div[2]/div[2]/div/div/a[1]'),frame.waitForXPath('html/body/div[3]/div[2]/div[2]/div/div/a[1]')]) 
        await result.click();
        await frame.waitForXPath('/html/body/div[3]/div[2]/div[2]/div/div/a')
        await page.screenshot({
          path:'success.png'
        })
        console.log('Reported successfully.', new Date().toString());
        await sleep(3000);
    await browser.close();

  }catch(err){
    await page.screenshot({
      path:'error.png'
    })
    console.error('fail to finish task ,look eror.png to check the problems. errorinfo:' ,err);
  }

};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
