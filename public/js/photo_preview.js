document.addEventListener("DOMContentLoaded", function () {
    const photoUpload = document.getElementById('photo_upload');
    if (photoUpload) {
        photoUpload.onchange = evt => {
            const [photo] = photoUpload.files
            if (photo) {
                document.getElementById('photo_preview').src = URL.createObjectURL(photo);
                document.getElementById('upload_source').value = photo.name;
            }
        }
    }
});