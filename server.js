const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'students.json');

// HTML template containing the Student Record Form
const htmlForm = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Student Records</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background-color: #f4f4f9; }
        .container { max-width: 400px; margin: auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        h2 { text-align: center; color: #333; }
        label { font-weight: bold; font-size: 14px; color: #555; }
        input { width: 100%; padding: 10px; margin: 8px 0 20px 0; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        button { background-color: #28a745; color: white; padding: 10px; width: 100%; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
        button:hover { background-color: #218838; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Add Student Record</h2>
        <form method="POST" action="/">
            <label for="name">Student Name:</label>
            <input type="text" id="name" name="name" required>

            <label for="roll">Roll Number:</label>
            <input type="text" id="roll" name="roll" required>

            <label for="course">Course:</label>
            <input type="text" id="course" name="course" required>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <button type="submit">Add Student</button>
        </form>
    </div>
</body>
</html>
`;

// 1. Create HTTP Server
const server = http.createServer((req, res) => {
    
    // 2. Serve the HTML Form on GET request
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlForm);
    } 
    
    // 3. Handle Form Submission on POST request
    else if (req.method === 'POST' && req.url === '/') {
        let body = '';

        // Receive the data in chunks
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // When all data has been received
        req.on('end', () => {
            // Parse the URL-encoded form data
            const parsedData = new URLSearchParams(body);
            const newStudent = {
                name: parsedData.get('name'),
                roll: parsedData.get('roll'),
                course: parsedData.get('course'),
                email: parsedData.get('email')
            };

            // Read the existing data from students.json
            fs.readFile(DATA_FILE, 'utf8', (err, data) => {
                let students = [];
                
                // If the file exists and is not empty, parse it
                if (!err && data) {
                    try {
                        students = JSON.parse(data);
                    } catch (e) {
                        console.error('Error parsing existing JSON file.');
                    }
                }

                // Add the newly submitted student record
                students.push(newStudent);

                // Write the updated array back to students.json
                fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), err => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Server Error: Failed to save the record.');
                        return;
                    }

                    // Render a success message and provide a link to go back
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`
                        <div style="text-align:center; font-family:Arial; margin-top:50px;">
                            <h2 style="color:#28a745;">Student Record Saved Successfully!</h2>
                            <a href="/" style="text-decoration:none; color:white; background:#007bff; padding:10px 20px; border-radius:4px;">Add Another Student</a>
                        </div>
                    `);
                });
            });
        });
    } 
    
    // Fallback for any unsupported routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Run the server on port 3000 and display the welcome message
server.listen(PORT, () => {
    console.log(`\n===========================================`);
    console.log(` WELCOME! The HTTP Server is now running. `);
    console.log(` Access the application at: http://localhost:${PORT}`);
    console.log(`===========================================\n`);
});