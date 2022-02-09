$(document).ready(function(){
    var fileTarget = $('#img-box #img');

    fileTarget.on('change', function(){
        if(window.FileReader){
            var filename = $(this)[0].files[0].name;
        } else{
            var filename = $(this).val().split('/').pop().split('//').pop();
        }

        $(this).siblings('.upload-name').val(filename);
    });
});