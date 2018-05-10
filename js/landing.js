$('#pauseBTN button').click(function(){
    // $(this).next('ul').slideToggle('500');
    alert("This is running")
    $(this).find('i').toggleClass('fas fa-play')
});
