// window.FB.getLoginStatus(function (response) {
//     console.log('getLoginStatus: called', response)
// });


// window.fbAsyncInit = function () {
//     window.FB.init({
//         appId: '513213246765464',
//         cookie: true,                     // Enable cookies to allow the server to access the session.
//         xfbml: true,                     // Parse social plugins on this webpage.
//         version: 'v11.0'           // Use this Graph API version for this call.
//     });
//        window.FB.getLoginStatus(function (response) {
//        renderUI();
//     });

// };
const rankingsBody = document.querySelector("#rankings > tbody");
console.log(rankingsBody);



/* FB Share */

$(function () {

$('#fb-share').on('click', function(e) {
    e.preventDefault();

    FB.ui(
	    {
		method: 'share',
        	href: 'https://happu.zee5.com/',
		image: 'https://happu.zee5.com/FbImg.png',
		description: 'Play Happu Ki Nikli Savaari',
		title: 'Happu Ki Nikli Savaari',    
  		
	    },
	    function(response) {
		if (response && response.post_id) {
		    alert('Post was published.');
			gtag('event', 'Shared_To_FB');
		} else {
		    alert('Post was not published.');
			gtag('event', 'Did_Not_Share');
		}
	    }
    );
});
});


/* End FB Share */









function autoPostScore() {
    
    FB.getLoginStatus((response) => {
		if (response.status === 'connected') {
			//user is authorized
             window.FB.api('/me', { fields: 'last_name,picture,first_name' }, function (response) {
            if (response.id) {
                postData('https://d1ygamnvncasrc.cloudfront.net/test/postscore', {
                    "id": response.id,
                    "firstname": response.first_name,
                    "lastname": response.last_name,
                    "score": currentScore,
                    "profilePic": response.picture.data.url,
                }).then(data => {
                    // JSON data parsed by `data.json()` call
                }).catch(error => { console.log(error) })
            }
    
          
            document.getElementById('fbLogin').style.display = 'none';
          
            renderUI().then();
            
                        
            
            
        });
            
			
		} else {
			document.getElementById('fbLogin').style.display = 'block';
		}
	});
    
    
    
}    



function postScore() { FB.login(function(response) {
    if (response.authResponse) {
      window.FB.api('/me', { fields: 'last_name,picture,first_name' }, function (response) {
            if (response.id) {
                postData('https://d1ygamnvncasrc.cloudfront.net/test/postscore', {
                    "id": response.id,
                    "firstname": response.first_name,
                    "lastname": response.last_name,
                    "score": currentScore,
                    "profilePic": response.picture.data.url,
                }).then(data => {
                    // JSON data parsed by `data.json()` call
                }).catch(error => { console.log(error) })
            }
    
            //document.getElementById('status').innerHTML = 'Your score was posted!';
          
             alert('Your Score Was Posted.');
	      gtag('event', 'Posted_To_LeaderBoard');
	      
	      document.getElementById('fbLogin').style.display = 'none';
          
            renderUI().then();
            
                        
            
            
        });
    } else {
            alert('Please Login To Post Your Score');
	    gtag('event', 'Did_Not_Post_To_LeaderBoard');
    }
});

}


/**Renders UI based on login-status */
async function renderUI() {
    console.log(333);
   await populateRankings();
}

function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');

};

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response; // parses JSON response into native JavaScript objects
}

async function getData(url = '') {
    // Default options are marked with *
    const response = await fetch(url);
    return response.json(); // parses JSON response into native JavaScript objects
}

/**An implemenatation function */
// async function renderLeaderBoard() {
//     try {
//         let data = await getData('https://e1qgd37uc2.execute-api.us-east-1.amazonaws.com/getScore');
//         let arrayOfUsers = data.result.Items;
//         console.log(arrayOfUsers);
//         let html = arrayOfUsers.map((object) => {
//             return `
//         <div>
//         <p>${object.id} ${object.firstname} ${object.profilePic} </p>
//         <p></p>
//         </div>
//         `
//         }).join('');
//         document.querySelector('#root').insertAdjacentHTML("afterbegin", html);
//     } catch (error) {
//         console.log(error)
//     }
// }

async function populateRankings() {
    
    $("#rankings tbody tr").remove();
    try {
           // Populate Leaderboard
    let data = await getData('https://d1ygamnvncasrc.cloudfront.net/test/getscores?skip=0&limit=50');
    let json = data;
    console.log('JSON :',json)
    let i = 1;
    json.forEach((row) => {
        const tr = document.createElement("tr");
        console.log('row :',row);

        let changedSortObj = {
            'rank': i,
            'profilePic' : row['profilePic'],
            'name': row['firstname'],
            'score': row['score']
            };
                 
        for(prop in changedSortObj){
            
            if(prop === 'lastname' || prop === 'id'){
            /**Skip**/
            }else {

            const td = document.createElement("td");
            if(prop === 'profilePic'){
            let src = changedSortObj[prop];
            let imageElem = document.createElement("img");
            imageElem.src = src;    
            tr.appendChild(imageElem);
            }
                else {
            td.textContent = changedSortObj[prop];
            tr.appendChild(td);
            }
            }
 

        }
        i++;
        rankingsBody.appendChild(tr);
    }); 
    } catch (error) {
        console.log(error)
    }
}

renderUI();



