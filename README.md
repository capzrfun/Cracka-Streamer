### Project Structure

```bash
project/
server/
node_modules/
package.json
app.js
client/
index.html
styles.css
script.js (Electron)
webpack.config.js
package.json
README.md
```

### Server-Side (Node.js)

Install dependencies in the server folder:

```bash
npm init -y
npm install express socket.io webrtc-adapter @google-cloud-storage
```


### Packaging and Running

Run the following command in your project directory to start the server:

```bash
node server/app.js
```


Open `client/index.html` in a web browser or use an Electron desktop application.

**Note:** This is just a basic implementation. For production, consider using WebRTC's peer-to-peer connections for lower latency and better scalability. You may also need
to implement error handling and other features depending on your specific requirements.