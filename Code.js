/**
 * "When the spreadsheet is opened, create a menu called 'Curriculum' with two items: 'Add Curriculum'
 * and 'Modify Curriculum'."
 *
 * The first item, 'Add Curriculum', will call the function showAddSidebar when clicked. The second
 * item, 'Modify Curriculum', will call the function showModifySidebar when clicked
 */
const onOpen = () => {
  SpreadsheetApp.getUi()
    .createMenu('Curriculum')
    .addItem('📌 Add Curriculum', 'showAddSidebar')
    .addItem('🔧 Modify Curriculum', 'showModifySidebar')
    .addSeparator()
    .addItem('🔨 Rebuild Website', 'triggerRebuild')
    .addItem('📢 Contact Developer', 'emailDeveloper')
    .addToUi()
}

/**
 * It creates an HTML file called Sidebar-add, and then shows it in the sidebar
 */
const showAddSidebar = () => {
  const html =
    HtmlService.createHtmlOutputFromFile('Sidebar-add').setTitle(
      'Add Curriculum'
    )
  SpreadsheetApp.getUi().showSidebar(html)
}

/**
 * It returns the last row of the sheet named 'Curricula'
 * @returns The last row of the sheet named 'Curricula'
 */
const getLastRow = () => {
  const ss = SpreadsheetApp.getActive()
  return ss.getSheetByName('Curricula').getLastRow()
}

/**
 * It takes a row of data, appends it to the Curricula sheet, and returns a success message
 * @param row - an array of values to be added to the row
 * @returns An object with a success property.
 */
const addCurriculum = (row) => {
  const ss = SpreadsheetApp.getActive()
  const curricula = ss.getSheetByName('Curricula')
  curricula.appendRow(row)
  return {
    success: true,
  }
}

/**
 * It creates an HTML file called Sidebar-modify, sets the title of the sidebar to "Modify Curriculum",
 * and then shows the sidebar
 */
const showModifySidebar = () => {
  const html =
    HtmlService.createHtmlOutputFromFile('Sidebar-modify').setTitle(
      'Modify Curriculum'
    )
  SpreadsheetApp.getUi().showSidebar(html)
}

/**
 * It gets all the rows from the Curricula sheet
 * @returns An array of arrays.
 */
const getAllRows = () => {
  const ss = SpreadsheetApp.getActive()
  const curricula = ss.getSheetByName('Curricula')
  return curricula.getDataRange().getValues()
}

/**
 * It takes an array of data and a row number, and inserts the data into the row number
 * @param data - an array of values to insert into the spreadsheet
 * @param rowNumber - the row number of the row you want to update
 */
const saveChanges = (data, rowNumber) => {
  const rowToInsert = [data]
  const ss = SpreadsheetApp.getActive()
  const curricula = ss.getSheetByName('Curricula')
  const insertRange = curricula.getRange(rowNumber, 1, 1, data.length)
  insertRange.setValues(rowToInsert)
}

/**
 * It sends a POST request to a Netlify build hook
 */
const triggerRebuild = () => {
  const { github_token } =
    PropertiesService.getScriptProperties().getProperties()
  const url =
    'https://api.github.com/repos/nfmastroianni/gatsby-lbps-curriculum/dispatches'
  const postData = {
    event_type: 'Triggered by Curriculum Google Sheet',
  }
  const options = {
    method: 'post',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: 'token ' + github_token,
    },
    muteHttpExceptions: true,
    payload: JSON.stringify(postData),
  }
  const response = UrlFetchApp.fetch(url, options)
  Logger.log(response)
  alertRebuild()
}

/**
 * It creates a pop-up alert that says "Website Rebuild Initiated" and "Please check the website in
 * about 2 minutes to view the changes."
 *
 * The first line of the function is a constant variable called ui. This variable is assigned the value
 * of the getUi() method from the SpreadsheetApp class
 */
const alertRebuild = () => {
  const ui = SpreadsheetApp.getUi()
  ui.alert(
    'Website Rebuild Initiated',
    'Please check the website in about 5 minutes to view the changes.',
    ui.ButtonSet.OK
  )
}

const emailDeveloper = () => {
  let htmlBody = HtmlService.createTemplateFromFile('email-template')
  htmlBody.recipientName = 'Neil'
  const email_html = htmlBody.evaluate().getContent()
  MailApp.sendEmail({
    to: 'nmastroianni@longbranch.k12.nj.us',
    subject: 'Curriculum Site - Spreadsheet Problem',
    htmlBody: email_html,
    cc: 'nesposito@longbranch.k12.nj.us',
  })
  const ui = SpreadsheetApp.getUi()
  ui.alert(
    'Message Sent',
    'Neil has been notified that you are in need of assistance. If you do not hear back from him soon, please call him at 732-278-1844',
    ui.ButtonSet.OK
  )
}
