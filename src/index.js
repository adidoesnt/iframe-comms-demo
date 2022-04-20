import _ from 'lodash';
import config from '../test/config.json';
import { convertStyles } from './utils'

function init() {
    const mainContainerElement = document.createElement('div');
    mainContainerElement.setAttribute('class', 'main-container');
    setMainContainerStyle(mainContainerElement)
    document.body.appendChild(mainContainerElement);
    initialiseIframeContainer(mainContainerElement);
}

function setMainContainerStyle(mainContainerElement) {
    mainContainerElement.style.position = 'absolute';
    mainContainerElement.style.width = '100%';
    mainContainerElement.style.height = '100%';
    mainContainerElement.style.display = 'flex';
    mainContainerElement.style.alignItems = 'center';
    mainContainerElement.style.justifyContent = 'center';
}

function initialiseIframeContainer(mainContainerElement) {
    const iframeContainer = document.createElement('iframe');
    iframeContainer.setAttribute('class', 'iframeContainer');
    const source = config['iframe-settings']['source'] ? 
        config['iframe-settings']['source'] : '../dist/subpage.html';
    iframeContainer.setAttribute('src', source);
    const style = convertStyles(config['iframe-settings']['style']);
    iframeContainer.setAttribute('style', style);
    mainContainerElement.appendChild(iframeContainer);
    initialiseMessagePrinter(mainContainerElement);
    testFlow(iframeContainer);
}

function initialiseMessagePrinter(mainContainerElement) {
    const messagePrinter = document.createElement('div');
    messagePrinter.setAttribute('class', 'messagePrinterContainer');
    const message = document.createElement('p');
    message.setAttribute('class', 'message-content');
    messagePrinter.appendChild(message);
    setMessageContainerStyle(messagePrinter, message)
    mainContainerElement.appendChild(messagePrinter);
}

function setMessageContainerStyle(messagePrinterContainer, messageContentContainer) {
    messagePrinterContainer.style.position = 'absolute';
    messagePrinterContainer.style.width = config['iframe-settings']['style']['width'];
    messagePrinterContainer.style.display = 'flex';
    messagePrinterContainer.style.alignItems = 'center';
    messagePrinterContainer.style.justifyContent = 'center';
    messagePrinterContainer.style.top = '0px';
    messagePrinterContainer.style.outline = 'groove 3px';

    messageContentContainer.style.width = config['iframe-settings']['style']['width'];
    messageContentContainer.style.textAlign = 'center';
}

function setMessageEventListener() {
    const messageContainer = document.querySelector('.messagePrinterContainer');
    const messageContentContainer = messageContainer.querySelector('.message-content');
    const iframeContainer = document.querySelector('.iframeContainer');
    window.addEventListener('message', function(event){
        if (event.data == 'messageFromIframe') {
            messageContentContainer.innerHTML = 'Message received by main container!';
        }
    });

    iframeContainer.contentWindow.addEventListener('message', function(event){
        if (event.data == 'messageToIframe') {
            messageContentContainer.innerHTML = 'Message received by iFrame!';
        }
    });
}

function sendMessageFromIframe() {
    window.top.postMessage('messageFromIframe', 'http://localhost:8080/dist/');
}

function sendMessageToIframe(iframeContainer) {
    iframeContainer.contentWindow.postMessage('messageToIframe', 'http://localhost:8080/dist/');
}

function testFlow(iframeContainer) {
    setMessageEventListener();
    const messageContainer = document.querySelector('.messagePrinterContainer');
    messageContainer.addEventListener('click', (event) => {
        sendMessageToIframe(iframeContainer);
    });
    iframeContainer.addEventListener('click', (event) => {
        sendMessageFromIframe(iframeContainer);
    });
}

init();