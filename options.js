document.getElementById('save').addEventListener('click', () => {
  const token = document.getElementById('token').value.trim();
  const chatId = document.getElementById('chat').value.trim();
  chrome.storage.sync.set({botToken: token, chatId: chatId}, () => {
    document.getElementById('status').textContent = 'Saved!';
    setTimeout(() => { document.getElementById('status').textContent = ''; }, 2000);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['botToken', 'chatId'], (result) => {
    if (result.botToken) document.getElementById('token').value = result.botToken;
    if (result.chatId) document.getElementById('chat').value = result.chatId;
  });
});
