// Function to start webcam and draw video frames on canvas
async function startWebcam() {
    const video = document.getElementById('videoElement');
    const canvas = document.getElementById('canvasElement');
    const ctx = canvas.getContext('2d');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }});
        video.srcObject = stream;
        
        video.onloadedmetadata = function() {
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            // Draw video frames onto canvas
            drawToCanvas();
        };
    } catch (err) {
        console.error('Error accessing webcam:', err);
    }
}

// Function to continuously draw video frames onto canvas
function drawToCanvas() {
    const video = document.getElementById('videoElement');
    const canvas = document.getElementById('canvasElement');
    const ctx = canvas.getContext('2d');

    // Get the aspect ratio of the video
    const aspectRatio = video.videoWidth / video.videoHeight;

    // Calculate the new width and height for the canvas
    let newWidth, newHeight;
    if (aspectRatio > 1) {
        newWidth = canvas.width;
        newHeight = canvas.width / aspectRatio;
    } else {
        newWidth = canvas.height * aspectRatio;
        newHeight = canvas.height;
    }

    // Set the new canvas dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Draw video frame onto canvas with new dimensions
    ctx.drawImage(video, 0, 0, newWidth, newHeight);

    // Request next frame
    requestAnimationFrame(drawToCanvas);
}

// Function to take a photo
function takePhoto() {
    const shutterSound = new Audio('./assets/cameraShutter.mp3');
    shutterSound.play();
    console.log('Photo captured!');
    
    // Display response div
    const responseDiv = document.getElementById("response");
    responseDiv.style.display = "block";

    // Pause the video
    const video = document.getElementById('videoElement');
    video.pause();

    // Fetch response and handle it
    getResponseAndHandle(video);
}

function getResponseAndHandle(video) {
    fetch('https://c-express-gemini.vercel.app/about')
    .then(response => response.text())
    .then(data => {
        handleResponse(data.substring(5));
        video.play();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        handleResponse("AI回复在这里");
        video.play();
    });
}

function handleResponse(resStr){
    console.log(resStr)
    // Update HTML with the response content
    const resContainer = document.getElementById('resDisplay');
    const newResElement = document.createElement('div');
    newResElement.innerHTML = `
        <div>
            <h4 class="my-4 rounded-lg bg-zinc-900 p-2">${resStr}</h4>
            <div class="font-bold">Jackie Chaston</div>
            <div class="text-zinc-400">6pm - Sage Stage</div>
        </div>
    `;
    resContainer.appendChild(newResElement);
}

// Start webcam when page loads
window.onload = function() {
    startWebcam();
};

// Event listener for camera button click
document.getElementById("cameraButton").addEventListener("click", takePhoto);
