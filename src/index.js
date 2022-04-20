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
    iframeContainer.setAttribute('src', config['iframe-settings']['source']);
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
    messagePrinterContainer.style.outline = 'groove 2px';

    messageContentContainer.style.width = config['iframe-settings']['style']['width'];
    messageContentContainer.style.textAlign = 'center';
}

function setMessageEventListener() {
    window.addEventListener('message', function(event){
        if (event.data == 'messageFromIframe') {
            console.log('Message from iFrame received!');
        } else if (event.data == 'messageToIframe') {
            console.log('Message to iFrame received!');
        }
    });
}

function sendMessageFromIframe() {
    window.top.postMessage('messageFromIframe', '*');
}

function sendMessageToIframe(iframeContainer) {
    iframeContainer.contentWindow.postMessage('messageToIframe', '*');
}

function testFlow(iframeContainer) {
    setMessageEventListener();
    setTimeout(() => {
        sendMessageToIframe(iframeContainer);
        setTimeout(() => { 
            sendMessageFromIframe(iframeContainer) 
        }, 2000);
    }, 2000);
}

init();