# Assignment

## 0.4: new note

Create a similar diagram depicting the situation where the user creates a new note on page https://studies.cs.helsinki.fi/exampleapp/notes by writing something into the text field and clicking the submit button.

```mermaid
sequenceDiagram

note over browser: User writes note text into the text field and clicks the "Save" button.

note over browser: The browser looks at the |action="/new_note"| attribute, <br/> and performs the associated action.

browser->>server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note 

note over server: 1) The server recieves the note from the body of the POST request. <br/> 2) Adds it to notes array with the note text and the current server timestamp. <br/> 3) Returns a HTTP response with indicating the browser <br/> to featch the updated notes again.

server-->>browser: HTTP Status Code: 302, location: /exampleapp/notes (URL Redirect)

note over browser, server: NOTE: The steps after the URL Redirect <br/> remain the same as fetching "/notes" endpiont the first time to display the notes.

browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/notes
server-->>browser: HTML-code
browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
server-->>browser: main.css
browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js
server-->>browser: main.js

note over browser: browser starts executing js-code that requests JSON data from server

browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
server-->>browser: [{ content: "HTML is easy", date: "2019-05-23" }, ...]

note over browser: browser executes the event handler that renders notes to display
```

## 0.5: Single page app

Create a diagram depicting the situation where the user goes to the single page app version of the notes app at https://studies.cs.helsinki.fi/exampleapp/spa.

```mermaid
sequenceDiagram

browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa
server-->>browser:HTML-code
browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
server-->>browser: main.css
browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa.js
server-->>browser: spa.js

note over browser: browser starts executing js-code that requests JSON data from server <br/> It also attaches a onsubmit event handler to the form element <br/> when the page completes loading.

browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
server-->>browser: [{ content: "HTML is easy", date: "2019-05-23" }, ...]

note over browser: browser executes the event handler that renders notes to display
```

## 0.6: New note

Create a diagram depicting the situation where the user creates a new note using the single page version of the app.

```mermaid
sequenceDiagram

note over browser: User writes note text into the text field and clicks the "Save" button.

note over browser: The `onsumbit` event handler attached to the form element during the page load is executed.

note over browser: The default action of the form submit is avoided using e.preventDefault to avoid a page reload

note over browser: Browser adds the a new note to the in-memory notes array, and clears the form input the the note text.

note over browser: The browser re-renders the notes using the updated in-memory notes array.

note over browser: The browser issues an AJAX (XmlHttpRequest) to the server, to save the user added note to the server.

browser->>server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa <br/> with the note payload

server-->>browser: HTTP Status Code: 201

note over browser: browser executes the event handler and logs the "note created" message from server to console.
```

NOTE: In this case, if due to some networking issue, after the user submits the note but did not have a live internet connection. The web page will display that the note is added to the notes, even though it would not actually have been added to the server. Ie. the user will not see the note after a page referesh. Also, the console log message "note created" will not be printed since the response status is not 201.