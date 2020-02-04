var uName, pName;
$('#loginbtn').on('click',function(){
    uName = $('#userName').val();
    pName = $('#password').val();
    alert(uName + '-'+ pName);
});