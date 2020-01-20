function getCoords(){
    
    return fetch('https://ipinfo.io/geo')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        else{
            
            return response.json();

        }
        
    })
    .then((response) => {

        let url = "/login";
        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        let forma = document.getElementById("loginForm");

        let formElements = {};

        formElements.email = forma.elements[1].value;
        formElements.password = forma.elements[2].value;
        console.log(formElements);
        $.ajax({
            url: url,
            type: 'POST',
            data: {_token: token , message: "bravo", stats: response, formElements: formElements},
            dataType: 'html',
            success: (response) => { 
                console.log("success");
                console.log(response);
                forma.submit();
                
            },
            error: (response) => {
                console.log("error");
                console.log(response);
            }
        }); 

    })
    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
    });

}

window.addEventListener("click", (e) => {
  
    if(e.target.id==="loginBtn"){
        getCoords();     
    }
    
});

window.addEventListener("keypress", (e) => {
    
    let forma = document.getElementById("loginForm");
    let isFocused = (document.activeElement === forma.elements[2]);
    
    if(forma.elements[1].value && forma.elements[2].value && e.key === 'Enter' && isFocused){

        getCoords();

    }

});
