define([
    'base/js/namespace',
    'base/js/events'
    ], function(Jupyter, events) {

        // Adds a cell above current cell (will be top if no cells)
        var add_cell = function() {
            const uuid = UID();

    $(`<div id="section`+uuid+`">
    <video id="video`+uuid+`"></video>
    <img id="image`+uuid+`">
    </div>`).appendTo(document.body);
    
    Jupyter.notebook.insert_cell_above('markdown').set_text("\nscreenshot");
    Jupyter.notebook.select_prev();
    CaptureNow(uuid);
        };
        // Button to add default cell
        var defaultCellButton = function () {
            Jupyter.toolbar.add_buttons_group([
                Jupyter.keyboard_manager.actions.register ({
                    'help': 'take screenshot',
                    'icon' : 'fa-image',
                    'handler': add_cell
                }, 'screenshooter', 'screen shot')
            ])
        };
        var prefix = 'screenShooter';
        var action_name = 'take_screenShot';
        
        // Run on start
        function load_ipython_extension() {
            defaultCellButton();
        }
        
    var UID = function () {
        // generates a random ID so we can easily have multiple screenshots saved
        return '_' + Math.random().toString(36).substr(2, 9);
    };
        /* Main Screen shooter */
    function CaptureNow(uuid) {
        // connect to image & video
        console.log('screenshot '+uuid+' capturing');
        var videoElem = document.getElementById("video"+uuid);
        var image = document.getElementById("image"+uuid);
        var ourDiv = document.getElementById("section"+uuid);
        // hey user select what they want to capture
    navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: true
        })
        .then(mediaStream => {
        videoElem.srcObject = mediaStream;
        // Stop the stream after .1 seconds
        setTimeout(() => {
            const tracks = mediaStream.getTracks()
            tracks[0].stop()
        }, 100)
        return videoElem.play();
        }).then(() => { // enable the button
        takeASnap(videoElem, image);
        ourDiv.remove();
        })
    };
        /* Helper methods to take screenshot */
    function takeASnap(videoElem, image) {
        const canvas = document.createElement('canvas'); // create a canvas
        const ctx = canvas.getContext('2d'); // get its context
        canvas.width = videoElem.videoWidth; // set its size to the one of the video
        canvas.height = videoElem.videoHeight;
        ctx.drawImage(videoElem, 0, 0); // the video

        canvas.toBlob(download(image), 'image/jpeg');
        // return new Promise((res, rej) => {
        //   canvas.toBlob(res, 'image/jpeg'); // request a Blob from the canvas
        // });
    }
    
    function download(image) {
        // ad to img tag
        return function(blob) {
            console.log( blob );
            Jupyter.notebook.get_selected_cell().
                    insert_inline_image_from_blob(blob);
            
            setTimeout(function(){ 
                Jupyter.notebook.execute_cell_and_select_below();
            }, 500);  
                
            var reader = new FileReader();
            reader.readAsDataURL(blob); 
            reader.onloadend = function() {
                image.src =  reader.result; 
            }
        }
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
