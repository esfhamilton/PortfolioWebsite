const chevron = () => {
    let chevron = document.getElementById('nav-expand');
    if(chevron.name==='chevron-down'){
        chevron.name = 'chevron-up';
        document.getElementById('nav-list').style.display = "grid";

    } else{
        chevron.name = 'chevron-down'; 
        document.getElementById('nav-list').style.display = "none";
    } 
}

window.addEventListener('resize', () => {
    document.getElementById('nav-expand').name = 'chevron-down';
    if (window.innerWidth > 767) {
        document.getElementById('nav-list').style.display = "inline-block";
        
    } else{
        document.getElementById('nav-list').style.display = "none";
    }  
});