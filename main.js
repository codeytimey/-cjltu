status = "";
objects = [];

function setup() {
    canvas = createCanvas(300, 300);
    canvas.center();
    video = createCapture(VIDEO);
    video.hide();
}

function modelLoaded() {
    console.log("Model Loaded!");
    status = true;
}

function start() {
    objectDetector = ml5.objectDetector('cocoSSD', modelLoaded);
    document.getElementById("status_model").innerHTML = "Status: Detecting Objects";
    object_name = document.getElementById("object_input").value;
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
    }
    console.log(results);
    objects = results;
}

function draw() {
    image(video, 0, 0, 300, 300);
    if (status != "") {
        objectDetector.detect(video, gotResult);
        for (i = 0; i < objects.length; i++) {
            document.getElementById("status_model").innerHTML = "Status: Objects Detected";

            fill("red");
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke("red");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            if (object_name == objects[i].label) {
                video.stop()
                objectDetector.detect(gotResult);
                document.getElementById("object_status").innerHTML = object_name + " found";
                synth = window.speechSynthesis;
                utterThis = new SpeechSynthesisUtterance(object_name + " found");
                synth.speak(utterThis);
            }
            else {
                document.getElementById("object_status").innerHTML = object_name + " not found";
            }
        }

    }
}