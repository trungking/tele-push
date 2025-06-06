const MENU_SEND_URL = 'send_url';
const MENU_SEND_SELECTION = 'send_selection';
const MENU_SEND_CLIPBOARD = 'send_clipboard';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_SEND_URL,
    title: 'Send current URL to Telegram',
    contexts: ['page', 'browser_action']
  });
  chrome.contextMenus.create({
    id: MENU_SEND_SELECTION,
    title: 'Send selected text to Telegram',
    contexts: ['selection']
  });
  chrome.contextMenus.create({
    id: MENU_SEND_CLIPBOARD,
    title: 'Send clipboard text to Telegram',
    contexts: ['action']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === MENU_SEND_URL && tab) {
    sendMessageToTelegram(tab.url);
  }
  if (info.menuItemId === MENU_SEND_SELECTION && info.selectionText) {
    sendMessageToTelegram(info.selectionText);
  }
  if (info.menuItemId === MENU_SEND_CLIPBOARD) {
    navigator.clipboard.readText().then(text => {
      if (text) {
        sendMessageToTelegram(text);
      }
    });
  }
});

function sendMessageToTelegram(text) {
  chrome.storage.sync.get(['botToken', 'chatId'], (result) => {
    const token = result.botToken;
    const chatId = result.chatId;
    if (!token || !chatId) {
      console.warn('Telegram token or chat ID not set');
      return;
    }
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    }).then(response => {
      if (!response.ok) {
        console.error('Failed to send message to Telegram', response.statusText);
      }
    }).catch(err => console.error('Error sending message', err));
  });
}
