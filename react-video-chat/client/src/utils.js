const deleteh3 = ()=>{
    const x = document.querySelectorAll("h3");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].innerText = " ";
        }
}

export default deleteh3 ;