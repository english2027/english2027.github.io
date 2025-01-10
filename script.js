        let sendButton = window.document.getElementById('sendButton');
        let inp = window.document.getElementById('textInput');
        let outp = window.document.getElementById('textOutput');
        let conversation = [];

        let speechRecognizer = new webkitSpeechRecognition();        
        let speechSynthesis = window.speechSynthesis;                

        const speech = () => {
            speechRecognizer.lang = 'en-EN';
            speechRecognizer.start();
            sendButton.innerText = 'Speak...';
        }

        const talk = (text) => {
            let textToTalk = new SpeechSynthesisUtterance(text);
            textToTalk.onend = function(event) {
                sendButton.innerText = 'Do you have anything else you want to say? Click here - and speak up';
            };
            textToTalk.lang = 'en-EN';
            textToTalk.rate = 0.5;
            speechSynthesis.speak(textToTalk);
        }

        speechRecognizer.onresult = (event) => {                    
            inp.value = event.results[0][0].transcript;
            requestFunc();
        }

        const requestFunc = () => {
            if (inp.value) {
                sendButton.innerText = 'Wait...';
                let message = {
                    "role": "user",
                    "content": inp.value
                }
                conversation.push(message);

                // Отправка на сервер
                axios.post('https://openai-server-ral2.onrender.com/api/chat', { messages: conversation })
                    .then(response => {
                        let aiResponse = response.data.choices[0].message.content;
                        outp.value = aiResponse;

                        let gptMessage = {
                            "role": "assistant",
                            "content": aiResponse
                        }
                        conversation.push(gptMessage);
                        talk(aiResponse);
                    })
                    .catch(error => {
                        console.error("Error request:", error.message);
                        sendButton.innerText = 'Error. Try again.';

                    });
            }
        }
